import path from "path";
import fs from "fs/promises";

export async function findMonorepoRoot(
  startDir: string = process.cwd(),
): Promise<string> {
  let currentDir = startDir;

  while (currentDir !== path.parse(currentDir).root) {
    try {
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
        return currentDir;
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
  projectPath: string,
): Promise<void> {
  const fullPath = path.join(rootDir, projectPath);
  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`Project path "${projectPath}" not found`);
  }
}

export function getProjectNameFromPath(projectPath: string): string {
  return projectPath.split("/").pop() || "";
}
