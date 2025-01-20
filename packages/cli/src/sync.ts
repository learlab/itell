import path from "path";
import fs from "fs/promises";
import { Config, ChangedFile } from "./types.js";
import { getProjectNameFromPath, validateProjectPath } from "./utils.js";
import { Logger } from "./logger.js";

export class Sync {
  private logger: Logger;

  constructor(
    private config: Config,
    private rootDir: string,
    verbose: boolean = false,
  ) {
    this.logger = new Logger(verbose);
  }

  private isProtected(projectPath: string, filePath: string): boolean {
    const projectName = getProjectNameFromPath(projectPath);
    const projectConfig = this.config.projects?.[projectName];
    const protectedFiles =
      projectConfig?.protectedFiles || this.config.protectedFiles || [];

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
    const sourcePath = path.join(this.rootDir, sourceProject, changedFile.path);
    const targetPath = path.join(this.rootDir, targetProject, changedFile.path);

    // Only sync files from src directory
    if (!changedFile.path.startsWith("src/")) {
      return;
    }

    if (this.isProtected(targetProject, changedFile.path)) {
      this.logger.warn(
        `Skipping protected file: ${changedFile.path} in ${targetProject}`,
      );
      return;
    }

    try {
      if (changedFile.status === "deleted") {
        await fs.unlink(targetPath);
        this.logger.error(`Deleted: ${changedFile.path} in ${targetProject}`);
      } else {
        const content = await fs.readFile(sourcePath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, content);
        this.logger.success(`Synced: ${changedFile.path} to ${targetProject}`);
      }
    } catch (error) {
      this.logger.error(
        `Error syncing ${changedFile.path} to ${targetProject}: ${error}`,
      );
    }
  }

  async syncChanges(changedFiles: ChangedFile[]) {
    let targetProjects: string[] = [];

    if (this.config.targetProjects) {
      targetProjects = this.config.targetProjects;
      for (const project of targetProjects) {
        await validateProjectPath(this.rootDir, project);
      }
    } else {
      throw new Error("targetProjects must be specified in the configuration");
    }

    // Only sync files from src directory
    const srcFiles = changedFiles.filter((file) =>
      file.path.startsWith("src/"),
    );

    if (srcFiles.length === 0) {
      this.logger.info("No changes detected in src directory");
      return;
    }

    for (const project of targetProjects) {
      this.logger.info(`\nSyncing changes to ${project}...`);
      for (const file of srcFiles) {
        await this.syncFile(file, this.config.mainProject, project);
      }
    }
  }
}
