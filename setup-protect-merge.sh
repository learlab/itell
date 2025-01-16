#!/bin/bash

# Create a custom git command for protected merge
cat >.git/protect-merge <<'EOF'
#!/bin/bash

# Parse arguments
use_cache=true
verbose=false
target_branch=""
merge_args=()
has_ff_flag=false

for arg in "$@"; do
    if [ "$arg" = "--no-cache" ]; then
        use_cache=false
    elif [ "$arg" = "-v" ]; then
        verbose=true
    elif [[ "$arg" == "--ff"* ]]; then
        has_ff_flag=true
        merge_args+=("$arg")
    elif [ -z "$target_branch" ]; then
        target_branch="$arg"
    else
        merge_args+=("$arg")
    fi
done

if [ "$has_ff_flag" = false ]; then
    merge_args+=("--no-ff")
fi

repo_root=$(git rev-parse --show-toplevel)
cache_dir="$repo_root/.protect-merge-cache"
cache_manifest="$cache_dir/manifest.txt"

update_cache() {
    local path="$1"
    local hash="$2"
    mkdir -p "$cache_dir/files"
    local cache_path="$cache_dir/files/$(echo "$path" | sed 's/\//_/g')"
    if [ -d "$path" ]; then
        find "$path" -type f -print0 | while IFS= read -r -d '' file; do
            local file_hash=$(git hash-object "$file")
            echo "$file $file_hash" >> "$cache_manifest"
            cp "$file" "$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"
        done
    else
        cp "$path" "$cache_path"
        echo "$path $hash" >> "$cache_manifest"
    fi
}

get_gitattributes_hash() {
    find . -name ".gitattributes" -type f -exec sha256sum {} \; | sort | sha256sum | cut -d' ' -f1
}

rebuild_cache=false
current_gitattributes_hash=$(get_gitattributes_hash)

if [ "$use_cache" = false ]; then
    rebuild_cache=true
elif [ ! -f "$cache_manifest" ]; then
    rebuild_cache=true
elif [ -f "$cache_dir/gitattributes.hash" ]; then
    stored_hash=$(cat "$cache_dir/gitattributes_hash")
    if [ "$stored_hash" != "$current_gitattributes_hash" ]; then
        rebuild_cache=true
    fi
fi

if [ "$rebuild_cache" = true ]; then
    rm -rf "$cache_dir"
    mkdir -p "$cache_dir/files"

    # Get patterns with keep-ours from .gitattributes directly
    protected_patterns=$(grep "merge=keep-ours" "$(git rev-parse --git-dir)/../.gitattributes" | cut -d' ' -f1)
    
    # Separate directory patterns and file patterns
    protected_dirs=""
    protected_files=""
    
    while read -r pattern; do
        [ -z "$pattern" ] && continue
        # Remove trailing wildcards for directory matching
        clean_pattern=$(echo "$pattern" | sed 's/\/\*\*\/\*$//' | sed 's/\/\*$//')
        if [ -d "$clean_pattern" ]; then
            protected_dirs="${protected_dirs}${clean_pattern}"$'\n'
        else
            protected_files="${protected_files}${pattern}"$'\n'
        fi
    done <<< "$protected_patterns"

    echo "$protected_dirs" > "$cache_dir/protected_dirs.txt"
    echo "$protected_files" > "$cache_dir/protected_files.txt"
    echo "$current_gitattributes_hash" > "$cache_dir/gitattributes_hash"

    # Cache directories content
    while read -r dir; do
        [ -z "$dir" ] && continue
        if [ -d "$dir" ]; then
            while IFS= read -r -d '' file; do
                hash=$(git hash-object "$file")
                update_cache "$file" "$hash"
            done < <(find "$dir" -type f -print0)
        fi
    done <<< "$protected_dirs"

    # Cache individual files
    while read -r file; do
        [ -z "$file" ] && continue
        [ -f "$file" ] || continue
        hash=$(git hash-object "$file")
        update_cache "$file" "$hash"
    done <<< "$protected_files"
else
    protected_dirs=""
    protected_files=""
    [ -f "$cache_dir/protected_dirs.txt" ] && protected_dirs=$(cat "$cache_dir/protected_dirs.txt")
    [ -f "$cache_dir/protected_files.txt" ] && protected_files=$(cat "$cache_dir/protected_files.txt")
fi

merge_base=$(git merge-base HEAD "$target_branch")

# Function to check if a path is under any protected directory
is_under_protected_dir() {
    local check_path="$1"
    while read -r dir; do
        [ -z "$dir" ] && continue
        # Normalize paths by removing trailing slashes
        local norm_dir="${dir%/}"
        local norm_path="${check_path%/}"
        if [[ "$norm_path" == "$norm_dir"/* || "$norm_path" == "$norm_dir" ]]; then
            return 0
        fi
    done <<< "$protected_dirs"
    return 1
}

# Function to backup entire directory structure
backup_directory() {
    local dir="$1"
    local base_dir="$dir"
    
    # Create directory structure in tmp_dir
    mkdir -p "$tmp_dir/$dir"
    
    # Store list of all files that should exist
    while IFS= read -r cached_file; do
        local orig_path
        orig_path=$(echo "$cached_file" | sed "s|$cache_dir/files/||" | sed 's/_/\//g')
        if [[ "$orig_path" == "$dir"/* ]]; then
            local rel_path="${orig_path#$base_dir/}"
            mkdir -p "$tmp_dir/$dir/$(dirname "$rel_path")"
            cp "$cached_file" "$tmp_dir/$dir/$rel_path"
            echo "$orig_path" >> "$tmp_dir/protected_files.txt"
        fi
    done < <(find "$cache_dir/files" -type f -name "${dir//\//_}*")
}

tmp_dir=$(mktemp -d)

# Initialize/clear temporary storage
> "$tmp_dir/protected_files.txt"

# First, backup all protected directories
while read -r dir; do
    [ -z "$dir" ] && continue
    backup_directory "$dir"
done <<< "$protected_dirs"

# Get all changed files between merge base and target branch
changing_files=$(git diff --name-status "$merge_base" "$target_branch")

# Process individual file changes
while IFS= read -r change; do
    [ -z "$change" ] && continue
    
    status=$(echo "$change" | cut -f1)
    file=$(echo "$change" | cut -f2-)
    
    # Check if file is explicitly protected or under protected directory
    if echo "$protected_files" | grep -q "^${file}$" || is_under_protected_dir "$file"; then
        case "$status" in
            M|A)
                if [ -f "$file" ]; then
                    current_hash=$(git hash-object "$file")
                    cached_path="$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"
                    
                    if [ -f "$cached_path" ]; then
                        cached_hash=$(git hash-object "$cached_path")
                        if [ "$current_hash" != "$cached_hash" ]; then
                            update_cache "$file" "$current_hash"
                        fi
                    else
                        update_cache "$file" "$current_hash"
                    fi
                    
                    mkdir -p "$(dirname "$tmp_dir/$file")"
                    cp "$cached_path" "$tmp_dir/$file"
                    echo "$file" >> "$tmp_dir/protected_files.txt"
                fi
                ;;
            D)
                # For deleted files, restore them from cache
                cached_path="$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"
                if [ -f "$cached_path" ]; then
                    mkdir -p "$(dirname "$tmp_dir/$file")"
                    cp "$cached_path" "$tmp_dir/$file"
                    echo "$file" >> "$tmp_dir/protected_files.txt"
                fi
                ;;
        esac
    fi
done <<< "$changing_files"

# Perform the merge with its original output
git merge "$target_branch" "${merge_args[@]}"
merge_status=$?

# Our additional protections
if [ -f "$tmp_dir/protected_files.txt" ] && [ "$merge_status" -eq 0 ]; then
    if [ -s "$tmp_dir/protected_files.txt" ]; then
        restored_count=0
        restored_files=""
        while read -r file; do
            [ -z "$file" ] && continue
            mkdir -p "$(dirname "$file")"
            cp "$tmp_dir/$file" "$file"
            git add "$file"
            restored_files="${restored_files}${file}\n"
            ((restored_count++))
        done < "$tmp_dir/protected_files.txt"

        if [ "$restored_count" -gt 0 ]; then
            [ "$verbose" = true ] && echo -e "Protected files:\n${restored_files}"
            git commit --amend --no-edit

            # Check if there are any changes after restoring
            if [ -z "$(git diff HEAD^ HEAD --name-only)" ]; then
                git reset --hard HEAD^
                merge_status=1
            else
                [ "$verbose" = false ] && echo "Restored $restored_count protected files"
            fi
        fi
    fi
    rm -rf "$tmp_dir"
fi

exit $merge_status
EOF

chmod +x .git/protect-merge

# Create a Git alias
git config --local alias.protect-merge '!.git/protect-merge'

# Add .protect-merge-cache to .gitignore if not already present
if ! grep -q "^\.protect-merge-cache$" .gitignore 2>/dev/null; then
  echo ".protect-merge-cache" >>.gitignore
fi

echo "Protected merge command has been set up successfully."
echo "Usage: git protect-merge <target-branch> [-v,--no-cache]"
