import path from "path";
import fs from "fs/promises";
import { Config, ChangedFile } from "./types.js";
import chalk from "chalk";
import { validateProjectPath } from "./utils.js";

export class Sync {
  constructor(
    private config: Config,
    private rootDir: string,
    private verbose: boolean = false,
  ) {}

  private log(message: string) {
    if (this.verbose) {
      console.log(message);
    }
  }

  private isProtected(projectName: string, filePath: string): boolean {
    const projectConfig = this.config.projects?.[projectName];
    const protectedFiles =
      projectConfig?.protectedFiles || this.config.protectedFiles;

    return protectedFiles.some((pattern) => {
      if (pattern.endsWith("/")) {
        return filePath.startsWith(pattern);
      }
      return filePath === pattern;
    });
  }

  async syncFile(
    changedFile: ChangedFile,
    sourceProject: string,
    targetProject: string,
  ) {
    const sourcePath = path.join(
      this.rootDir,
      "apps",
      sourceProject,
      changedFile.path,
    );
    const targetPath = path.join(
      this.rootDir,
      "apps",
      targetProject,
      changedFile.path,
    );

    if (this.isProtected(targetProject, changedFile.path)) {
      this.log(
        chalk.yellow(
          `Skipping protected file: ${changedFile.path} in ${targetProject}`,
        ),
      );
      return;
    }

    try {
      if (changedFile.status === "deleted") {
        await fs.unlink(targetPath);
        this.log(chalk.red(`Deleted: ${changedFile.path} in ${targetProject}`));
      } else {
        const content = await fs.readFile(sourcePath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, content);
        this.log(
          chalk.green(`Synced: ${changedFile.path} to ${targetProject}`),
        );
      }
    } catch (error) {
      this.log(
        chalk.red(
          `Error syncing ${changedFile.path} to ${targetProject}: ${error}`,
        ),
      );
    }
  }

  async syncChanges(changedFiles: ChangedFile[]) {
    // Get target projects from config or find all projects
    let targetProjects: string[] = [];

    if (this.config.targetProjects) {
      // Use configured target projects
      targetProjects = this.config.targetProjects;
      // Validate all target projects exist
      for (const project of targetProjects) {
        await validateProjectPath(this.rootDir, project);
      }
    } else {
      // If no target projects specified, use all projects in apps directory except main
      const allProjects = await fs.readdir(path.join(this.rootDir, "apps"));
      targetProjects = allProjects.filter((p) => p !== this.config.mainProject);
    }

    for (const project of targetProjects) {
      this.log(chalk.blue(`\nSyncing changes to ${project}...`));

      for (const file of changedFiles) {
        await this.syncFile(file, this.config.mainProject, project);
      }
    }
  }
}
