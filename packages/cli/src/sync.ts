import path from "path";
import fs from "fs/promises";
import { Config, ChangedFile } from "./types.js";
import { getProjectNameFromPath, validateProjectPath } from "./utils.js";
import { Logger } from "./logger.js";
import { StateManager } from "./state.js";

export class Sync {
  private logger: Logger;
  private stateManager: StateManager;

  constructor(
    private config: Config,
    private rootDir: string,
    verbose: boolean = false,
  ) {
    this.logger = new Logger(verbose);
    this.stateManager = new StateManager(rootDir);
  }

  private async init() {
    await this.stateManager.init();
  }

  private isProtected(projectPath: string, filePath: string): boolean {
    const projectName = getProjectNameFromPath(projectPath);
    const projectConfig = this.config.projects?.[projectName];
    const protectedFiles =
      projectConfig?.protectedFiles || this.config.protectedFiles || [];

    return protectedFiles.some((pattern) => {
      // if the protected pattern is dir/ then all files inside should be skipped
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
      sourceProject,
      changedFile.shortPath,
    );
    const targetPath = path.join(
      this.rootDir,
      targetProject,
      changedFile.shortPath,
    );
    if (this.isProtected(targetProject, changedFile.shortPath)) {
      this.logger.warn(`Skipping protected file: ${changedFile.shortPath}`);
      return false;
    }

    // Check state to see if the sync has been done
    if (
      !this.stateManager.needsSync(
        changedFile.path,
        changedFile.hash || "",
        targetProject,
      )
    ) {
      this.logger.info(
        `File ${changedFile.shortPath} already synced to ${targetProject}`,
      );
      return false;
    }

    try {
      if (changedFile.status === "deleted") {
        await fs.unlink(targetPath);
        this.logger.error(`Deleted: ${changedFile.shortPath}`);
      } else {
        const content = await fs.readFile(sourcePath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, content);
        this.logger.success(`Synced: ${changedFile.shortPath}`);
      }
      // Record successful sync
      this.stateManager.recordSync(
        changedFile.path,
        changedFile.hash || "",
        targetProject,
      );
      await this.stateManager.save();
      return true;
    } catch (error) {
      this.logger.error(`Error syncing ${changedFile.path}: ${error}`);
      return false;
    }
  }

  async syncChanges(changedFiles: ChangedFile[]) {
    await this.init();

    let targetProjects: string[] = [];

    if (this.config.targetProjects) {
      targetProjects = this.config.targetProjects;
      for (const project of targetProjects) {
        await validateProjectPath(this.rootDir, project);
      }
    } else {
      throw new Error("targetProjects must be specified in the configuration");
    }

    for (const project of targetProjects) {
      this.logger.info(`\nSyncing changes to ${project}...`);
      let syncCount = 0;
      for (const file of changedFiles) {
        const didSync = await this.syncFile(
          file,
          this.config.mainProject,
          project,
        );
        if (didSync) syncCount++;
      }

      this.logger.info(`Synced ${syncCount} files to ${project}`);
    }
  }
}
