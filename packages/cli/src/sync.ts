import path from "path";
import fs from "fs/promises";
import { Config, ChangedFile } from "./types.js";
import { getProjectNameFromPath, validateProjectPath } from "./utils.js";
import { Logger } from "./logger.js";
import { StateManager } from "./state.js";

export class Sync {
  private logger: Logger;
  private stateManager: StateManager;
  private results: ProjectSyncResults;

  constructor(
    private config: Config,
    private rootDir: string,
    verbose: boolean = false,
  ) {
    this.logger = new Logger(verbose);
    this.stateManager = new StateManager(rootDir);
    this.results = {};
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
  private recordResult(targetProject: string, result: SyncResult) {
    if (!this.results[targetProject]) {
      this.results[targetProject] = [];
    }
    this.results[targetProject].push(result);
  }

  private displayResults() {
    for (const [project, results] of Object.entries(this.results)) {
      this.logger.info(`\nResults for ${project}:`);
      this.logger.info(formatResultsTable(results));

      // Display summary
      const totals = {
        synced: results.filter((r) => r.action === "Synced").length,
        skipped: results.filter((r) => r.action === "Skipped").length,
        deleted: results.filter((r) => r.action === "Deleted").length,
        errors: results.filter((r) => r.action === "Error").length,
      };

      this.logger.info("\nSummary:");
      this.logger.info(`Total: ${results.length} files`);
      this.logger.info(`Synced: ${totals.synced}`);
      this.logger.info(`Skipped: ${totals.skipped}`);
      this.logger.info(`Deleted: ${totals.deleted}`);
      if (totals.errors > 0) {
        this.logger.error(`Errors: ${totals.errors}`);
      }
    }
  }
  async syncFile(
    changedFile: ChangedFile,
    sourceProject: string,
    targetProject: string,
    dryRun: boolean,
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
      this.recordResult(targetProject, {
        filePath: changedFile.shortPath,
        fileStatus: changedFile.status,
        action: "Skipped",
        reason: "Protected file",
      });
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
      this.recordResult(targetProject, {
        filePath: changedFile.shortPath,
        fileStatus: changedFile.status,
        action: "Skipped",
        reason: "Already synced",
      });
      return false;
    }

    try {
      if (dryRun) {
        this.recordResult(targetProject, {
          filePath: changedFile.shortPath,
          fileStatus: changedFile.status,
          action:
            changedFile.status === "deleted" ? "Would Delete" : "Would Sync",
        });
        return true;
      }

      if (changedFile.status === "deleted") {
        await fs.unlink(targetPath);
        this.recordResult(targetProject, {
          filePath: changedFile.shortPath,
          fileStatus: "deleted",
          action: "Deleted",
        });
      } else {
        // modified or added
        const content = await fs.readFile(sourcePath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.writeFile(targetPath, content);
        this.recordResult(targetProject, {
          filePath: changedFile.shortPath,
          fileStatus: changedFile.status,
          action: "Synced",
        });
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
      this.recordResult(targetProject, {
        filePath: changedFile.shortPath,
        fileStatus: changedFile.status,
        action: "Error",
        reason: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async syncChanges(changedFiles: ChangedFile[], dryRun: boolean) {
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

    this.logger.info(
      `${dryRun ? "[DRY RUN] " : ""}Processing ${changedFiles.length} files from ${this.config.mainProject}`,
    );

    for (const project of targetProjects) {
      this.logger.info(`\nSyncing changes to ${project}...`);
      for (const file of changedFiles) {
        await this.syncFile(file, this.config.mainProject, project, dryRun);
      }

      this.displayResults();
    }
  }
}

interface SyncResult {
  filePath: string;
  fileStatus: string;
  action: string;
  reason?: string;
}

interface ProjectSyncResults {
  [projectPath: string]: SyncResult[];
}

function pad(str: string, width: number): string {
  return str + " ".repeat(width - str.length);
}

function formatResultsTable(results: SyncResult[]): string {
  if (results.length === 0) return "No files processed";

  // Sort results by Action
  const sortedResults = [...results].sort((a, b) =>
    a.action.localeCompare(b.action),
  );

  // Calculate column widths
  const filePathWidth = Math.max(
    ...results.map((r) => r.filePath.length),
    "File".length,
  );
  const statusWidth = Math.max(
    ...results.map((r) => r.fileStatus.length),
    "Status".length,
  );
  const actionWidth = Math.max(
    ...results.map((r) => r.action.length),
    "Action".length,
  );
  const reasonWidth = Math.max(
    ...results.map((r) => r.reason?.length || 0),
    "Reason".length,
  );

  // Create horizontal line
  const horizontalLine = `+${"-".repeat(filePathWidth + 2)}+${"-".repeat(statusWidth + 2)}+${"-".repeat(actionWidth + 2)}+${reasonWidth ? `-${"-".repeat(reasonWidth + 2)}+` : ""}`;

  const resetColor = "\x1b[0m";

  // Create header row
  let header = [
    horizontalLine,
    `| ${pad("File", filePathWidth)} | ${pad("Status", statusWidth)} | ${pad("Action", actionWidth)} |${reasonWidth ? ` ${pad("Reason", reasonWidth)} |` : ""}`,
  ].join("\n");

  // Create table body
  const body = sortedResults
    .map((result) => {
      const actionColor = getActionColor(result.action);
      let row = `| ${pad(result.filePath, filePathWidth)} | ${pad(result.fileStatus, statusWidth)} | ${actionColor}${pad(result.action, actionWidth)}${resetColor} |`;
      if (reasonWidth && result.reason) {
        row += ` ${pad(result.reason, reasonWidth)} |`;
      }
      return row;
    })
    .join("\n");

  // Combine all parts
  return [header, horizontalLine, body, horizontalLine].join("\n");
}

function getActionColor(action: string): string {
  const colors = {
    Synced: "\x1b[32m", // Green
    Skipped: "\x1b[33m", // Yellow
    Deleted: "\x1b[31m", // Red
    Error: "\x1b[31m", // Red
    "Would Sync": "\x1b[36m", // Cyan
    "Would Delete": "\x1b[36m", // Cyan
  } as Record<string, string>;
  return colors[action] || "\x1b[0m"; // Default to reset if action not found
}
