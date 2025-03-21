The vercel CLI is used to share environmental variables.

## Installation

See installation instructions at <https://vercel.com/docs/cli>

## Authenticate

Run the following commands at the root folder.

Authenticate the CLI by logging in to lab Vercel account.

```bash
vercel login
```

Link local folder to Vercel project.

```bash
vercel link --repo
```

> [!NOTE] You will need to run `vercel link --repo` again if you start working
> on a new project that does not exist at the last time of linking.

## Getting environmental variables

Run the following command at the project folder where you need the environmental
variables.

```bash
vercel env pull .env --environment=development
```
