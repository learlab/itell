import path from "path";
import fs from "fs/promises";

export async function findMonorepoRoot(
  startDir: string = process.cwd(),
): Promise<string> {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    try {
      // Check for essential monorepo files
      const hasPackageJson = await fs
        .access(path.join(currentDir, "package.json"))
        .then(() => true)
        .catch(() => false);
      const hasPnpmWorkspace = await fs
        .access(path.join(currentDir, "pnpm-workspace.yaml"))
        .then(() => true)
        .catch(() => false);
      const hasTurboJson = await fs
        .access(path.join(currentDir, "turbo.json"))
        .then(() => true)
        .catch(() => false);

      if (hasPackageJson && hasPnpmWorkspace && hasTurboJson) {
        // Verify apps and packages directories exist
        const hasApps = await fs
          .access(path.join(currentDir, "apps"))
          .then(() => true)
          .catch(() => false);
        const hasPackages = await fs
          .access(path.join(currentDir, "packages"))
          .then(() => true)
          .catch(() => false);

        if (hasApps && hasPackages) {
          return currentDir;
        }
      }
      currentDir = path.dirname(currentDir);
    } catch (error) {
      currentDir = path.dirname(currentDir);
    }
  }

  throw new Error(
    "Could not find monorepo root. Make sure you are in a monorepo with package.json, pnpm-workspace.yaml, and turbo.json",
  );
}

export async function validateProjectPath(
  rootDir: string,
  projectName: string,
): Promise<void> {
  const projectPath = path.join(rootDir, "apps", projectName);
  try {
    await fs.access(projectPath);
  } catch {
    throw new Error(`Project "${projectName}" not found in apps directory`);
  }
}
