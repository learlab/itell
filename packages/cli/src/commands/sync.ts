import path from "path";
import { Command } from "commander";
import { loadConfig } from "../config.js";
import { GitManager } from "../git.js";
import { Sync } from "../sync.js";
import { findMonorepoRoot, validateProjectPath } from "../utils.js";

export function createSyncCommand(): Command {
  const syncCommand = new Command("sync")
    .description("Sync changes from main project to other projects")
    .option("-c, --config <path>", "path to config file")
    .option("-m, --main-project <name>", "main project name")
    .option("-v, --verbose", "enable verbose logging")
    .action(async (options) => {
      try {
        const rootDir = await findMonorepoRoot();
        let config = await loadConfig(options.config);

        if (options.mainProject) {
          config = { ...config, mainProject: options.mainProject };
        }

        await validateProjectPath(rootDir, config.mainProject);
        const mainProjectPath = path.join(rootDir, "apps", config.mainProject);

        const gitManager = new GitManager(mainProjectPath);
        const changedFiles = await gitManager.getChangedFiles();

        if (changedFiles.length === 0) {
          if (options.verbose) {
            console.log("No changes detected in main project");
          }
          return;
        }

        const sync = new Sync(config, rootDir, options.verbose);
        await sync.syncChanges(changedFiles);
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return syncCommand;
}
