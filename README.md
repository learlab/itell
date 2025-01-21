![itell_panoramic](https://github.com/user-attachments/assets/97897488-c989-4856-98b6-62abb33985b9)

# iTELL

See our documentation here: [iTELL Wiki](https://github.com/learlab/itell/wiki)

## Development Instructions

There are two ways to run a iTELL project locally:

- Use [Dev Containers](#with-dev-containers). This is the recommended approach
  if you are comfortable working with VSCode and Docker.

- Build the project [manually](#manual-setup). This may be more straightforward
  if you are experienced in working with pnpm monorepos.

Either way, you can start with cloning this repository

```
git clone https://github.com/learlab/itell.git
```

## Manual Setup

Make sure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/): use version 20.0 or higher

- [pnpm](https://pnpm.io/installation): use version 9.0 or higher

- A postgres database. If you choose to use a local database, you need to create
  a database with an arbitrary name and get its url. You can use a tool like
  [pgAdmin](https://www.pgadmin.org/) for this.

After cloning the repository and `cd` into the folder, you will see the
following folder structure: (omitting some folders for brevity)

```bash
apps/
  demo/
    package.json
  special-volume/
packages
  package-1/
  package-2/
package.json
```

The `apps` folder contains the frontend code for our volumes. You will most
likely be working with `apps/demo` all the time, which serves the demo volume.
In cases where certain volume needs a special feature that should not be added
to demo and other volumes, you may go to `apps/specific-volume`.

Assuming you are working with the demo volume, run:

```bash
cd apps/demo
```

Create a new file `.env` in the volume folder. Fill in the necessary environment
variables, see [instructions](./vercel.md)

> [!IMPORTANT]
>
> Replace `DATABASE_URL` in `.env` with the URL of your postgres database, this
> string looks like
> `DATABASE_URL=postgresql://postgres:<username>@localhost:5432/<dbname>`

After you have `.env` set up, you can initialize your database and build the
app.

```bash
pnpm run setup
```

The command takes care of all the setup jobs including installing dependencies,
building internal libraries, initializing the database, etc. It should finish in
less than 5 minutes, the logs at the end looks like

```
@itell/demo:build: ○  (Static)   prerendered as static content
@itell/demo:build: ●  (SSG)      prerendered as static HTML (uses generateStaticParams)
@itell/demo:build: ƒ  (Dynamic)  server-rendered on demand
@itell/demo:build:
@itell/demo:build:

 Tasks:    10 successful, 10 total
Cached:    0 cached, 10 total
  Time:    1m40.234s
```

If no error message is shown, the setup is successful. You can now start the
development server via

```
pnpm run dev
```

This will print a localhost URL where you can view the app in your browser.

The next time you want to start the development server, you only need to run
`pnpm run dev` in the volume folder. No need to run the other commands again.

### All commands

```bash
# install dependencies
pnpm install
# go to the volume directory
cd apps/demo

# fill in the .env file and initialize the database
pnpm drizzle-kit migrate
# build
pnpm run build:deps

# start the development server
pnpm run dev
```

## Working with multiple volumes

> [!NOTE]
>
> Feel free to skip this section if you don't need to change volumes other than
> the demo.

If you changed `apps/demo` and want to bring the changes to other volumes, run

```
pnpm sync
```

If you have already committed the changes, run

```bash
pnpm sync --compare HEAD~1 # or other commit signatures
```

The CLI respects configuration in `.itellrc.json` in the monorepo root

```json
// .itellrc.json
{
  // project to copy from
  "mainProject": "apps/demo",
  // projects to bring changes to
  "targetProjects": ["apps/chevron"],
  // files that should not be changed (relative to mainProject)
  "protectedFiles": [
    "src/drizzle/",
    "src/lib/auth/conditions.ts",
    "src/app/auth/_components/knowledge-carousel.tsx"
  ]
}
```

If you need to synchronize a file that is protected or outside of the `src`
directory (whose changes are ignored by default), use the `-f` option:

```bash
# this will sync apps/chevron/README.md against apps/demo/README.md
pnpm sync -f README.md
```

The CLI will update your working directory directly. It is recommended to use
the `--dry-run` option if you are not sure what is going to happen:

```bash
> pnpm sync -v -f "README.md" "src/drizzle/schema.ts" --dry-run

[DRY RUN] Processing 2 files from apps/demo

Syncing changes to apps/chevron...

Results for apps/chevron:
+-----------------------+----------+------------+---------------------+
| File                  | Status   | Action     | Reason             |
+-----------------------+----------+------------+---------------------+
| src/drizzle/schema.ts | modified | Would Sync |                    |
| README.md             | modified | Would Sync |                    |
+-----------------------+----------+------------+---------------------+
```

<!-- ## With Dev Containers -->
<!---->
<!-- Dev containers are a convenient method for ensuring a completely reproducible -->
<!-- development environment. -->
<!---->
<!-- 1. Install Docker and VS Code. -->
<!-- 2. Install the Remote - Containers extension in VS Code. -->
<!-- 3. Clone this repository and open it in VS Code. -->
<!-- 4. Add a `.env` file to the root of the repository (speak to a team member for -->
<!--    the contents). -->
<!-- 5. Use the "Reopen in Container" command. -->
<!-- 6. Open a new VS Code terminal (inside the container) and run -->
<!--    `pnpm install turbo --global`. -->
<!-- 7. Make sure that the git repository is trusted. Use the "Git: Manage Unsafe -->
<!--    Repositories" command. -->
<!-- 8. Run `turbo run dev --filter=@itell/research-methods-in-psychology` (or -->
<!--    whichever iTELL volume/app you want to work on). -->
