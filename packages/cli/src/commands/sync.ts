import { Command } from "commander";
import { loadConfig } from "../config.js";
import { GitManager } from "../git.js";
import { Sync } from "../sync.js";
import { findMonorepoRoot, validateProjectPath } from "../utils.js";
import path from "path";

export function createSyncCommand(): Command {
  const syncCommand = new Command("sync")
    .description("Sync changes from main project to other projects")
    .option("-c, --config <path>", "path to config file")
    .option("-m, --main-project <path>", "main project path")
    .option("-v, --verbose", "enable verbose logging")
    .option("--compare <ref>", "git reference to compare with (e.g., HEAD~2)")
    .option(
      "-d, --dry-run",
      "show what changes would be made without actually making them",
    )
    .option(
      "-f, --file <paths...>",
      "specific file to sync (relative to main project, e.g., src/components/button.tsx)",
    )
    .action(async (options) => {
      try {
        const rootDir = await findMonorepoRoot();
        let config = await loadConfig(options.config);

        if (options.mainProject) {
          config = { ...config, mainProject: options.mainProject };
        }

        await validateProjectPath(rootDir, config.mainProject);
        const mainProjectPath = path.join(rootDir, config.mainProject);
        const gitManager = new GitManager(mainProjectPath);

        if (!(await gitManager.isGitRepository())) {
          throw new Error(`${config.mainProject} is not a git repository`);
        }
        const changedFiles = await gitManager.getChangedFiles(
          config.mainProject,
          options.compare,
          options.file,
        );
        if (changedFiles.length === 0) {
          if (options.verbose) {
            console.log(
              options.file
                ? `No changes detected for file ${options.file}`
                : `No changes detected in src directory of project ${config.mainProject}`,
            );
          }
          return;
        }

        const sync = new Sync(config, rootDir, options.verbose, options.file);
        await sync.syncChanges(changedFiles, options.dryRun);
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        process.exit(1);
      }
    });

  return syncCommand;
}
