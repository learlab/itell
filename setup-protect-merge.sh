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
    mkdir -p "$cache_dir/files"
    local cache_path="$cache_dir/files/$(echo "$path" | sed 's/\//_/g')"
    cp "$path" "$cache_path"
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

    # Store current state of protected directories
    while read -r dir; do
        [ -z "$dir" ] && continue
        if [ -d "$dir" ]; then
            # Get list of all tracked files in the directory
            while IFS= read -r file; do
                [ -f "$file" ] || continue
                update_cache "$file"
                echo "$file" >> "$cache_dir/dir_contents.txt"
            done < <(git ls-files "$dir")
        fi
    done <<< "$protected_dirs"

    # Cache individual protected files
    while read -r file; do
        [ -z "$file" ] && continue
        [ -f "$file" ] || continue
        update_cache "$file"
    done <<< "$protected_files"
else
    protected_dirs=""
    protected_files=""
    [ -f "$cache_dir/protected_dirs.txt" ] && protected_dirs=$(cat "$cache_dir/protected_dirs.txt")
    [ -f "$cache_dir/protected_files.txt" ] && protected_files=$(cat "$cache_dir/protected_files.txt")
fi

tmp_dir=$(mktemp -d)

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

# Initialize/clear temporary storage
> "$tmp_dir/restore_files.txt"

# First, store all files from protected directories that should exist
while read -r dir; do
    [ -z "$dir" ] && continue
    while IFS= read -r file; do
        cached_path="$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"
        if [ -f "$cached_path" ]; then
            mkdir -p "$tmp_dir/$(dirname "$file")"
            cp "$cached_path" "$tmp_dir/$file"
            echo "$file" >> "$tmp_dir/restore_files.txt"
        fi
    done < <(git ls-files "$dir")
done <<< "$protected_dirs"

# Store individual protected files
while read -r file; do
    [ -z "$file" ] && continue
    cached_path="$cache_dir/files/$(echo "$file" | sed 's/\//_/g')"
    if [ -f "$cached_path" ]; then
        mkdir -p "$tmp_dir/$(dirname "$file")"
        cp "$cached_path" "$tmp_dir/$file"
        echo "$file" >> "$tmp_dir/restore_files.txt"
    fi
done <<< "$protected_files"

# Perform the merge
git merge "$target_branch" "${merge_args[@]}"
merge_status=$?

# Restore protected content
if [ -f "$tmp_dir/restore_files.txt" ] && [ "$merge_status" -eq 0 ]; then
    restored_count=0
    restored_files=""

    # First, remove any new files in protected directories
    while read -r dir; do
        [ -z "$dir" ] && continue
        current_files=$(git ls-files "$dir")
        while IFS= read -r file; do
            if ! grep -Fxq "$file" "$tmp_dir/restore_files.txt"; then
                git rm -f "$file" 2>/dev/null || rm -f "$file"
            fi
        done <<< "$current_files"
    done <<< "$protected_dirs"

    # Then restore all protected files
    while read -r file; do
        [ -z "$file" ] && continue
        mkdir -p "$(dirname "$file")"
        cp "$tmp_dir/$file" "$file"
        git add "$file"
        restored_files="${restored_files}${file}\n"
        ((restored_count++))
    done < "$tmp_dir/restore_files.txt"

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
