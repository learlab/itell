import { simpleGit, SimpleGit } from "simple-git";
import { ChangedFile } from "./types.js";
import crypto from "crypto";
import path from "path";
import util from "node:util";
import child_process from "node:child_process";
const exec = util.promisify(child_process.exec);

export class GitManager {
  private git: SimpleGit;
  private workingDir: string;

  constructor(workingDir: string) {
    this.workingDir = workingDir;
    this.git = simpleGit(workingDir);
  }

  private async getFileHash(filePath: string): Promise<string> {
    try {
      const content = await this.git.show(["HEAD:" + filePath]);
      return crypto.createHash("md5").update(content).digest("hex");
    } catch {
      return crypto
        .createHash("md5")
        .update(filePath + Date.now())
        .digest("hex");
    }
  }

  async getChangedFiles(
    mainProject: string,
    compareWith?: string,
    files?: string[],
  ): Promise<ChangedFile[]> {
    // validate commit ref
    if (compareWith) {
      try {
        this.git.revparse(compareWith);
      } catch (err) {
        throw new Error(`Invalid git reference: ${compareWith}`);
      }
    }
    const re = new RegExp(`^${mainProject}/`);
    const changedFiles: ChangedFile[] = [];
    // user synching a specific file
    if (files && files.length > 0) {
      const fullPaths = files.map((f) => path.join(mainProject, f));
      const { stdout } = await exec(
        `git status --porcelain ${fullPaths.join(" ")}`,
      );
      if (stdout) {
        const statusLines = stdout.split("\n").filter(Boolean);
        for (const line of statusLines) {
          console.log(line);
          const statusCode = line.substring(0, 2);
          const filePath = line.substring(3);
          const shortPath = filePath.replace(re, "");
          let status: string;
          if (statusCode.includes("D")) {
            status = "deleted";
          } else if (statusCode.includes("??")) {
            status = "added";
          } else if (statusCode.includes("M") || statusCode.includes("A")) {
            status = "modified";
          } else {
            continue;
          }

          const hash = await this.getFileHash(filePath);
          changedFiles.push({
            path: filePath,
            shortPath,
            status,
            hash,
          });
        }
      }

      if (compareWith) {
        const { stdout } = await exec(
          `git diff ${compareWith} HEAD -- ${fullPaths.join(" ")}`,
        );
        if (stdout) {
          const diffFiles = stdout
            .split("\n")
            .filter((line) => line.startsWith("diff --git"))
            .map((line) => line.split(" ").pop()?.slice(2))
            .filter((file): file is string => !!file);

          // Add files that appear in diff but not in local changes
          for (const diffFile of diffFiles) {
            if (!changedFiles.some((f) => f.path === diffFile)) {
              const hash = await this.getFileHash(diffFile);
              const shortPath = diffFile.replace(re, "");
              changedFiles.push({
                path: diffFile,
                shortPath,
                status: "modified",
                hash,
              });
            }
          }
        }
      }
      return changedFiles;
    }

    const status = await this.git.status();

    // Add modified and new files
    for (const path of [...status.modified, ...status.not_added]) {
      const shortPath = path.replace(re, "");
      if (shortPath.startsWith("src")) {
        const hash = await this.getFileHash(path);
        changedFiles.push({
          path,
          shortPath,
          status: "modified",
          hash,
        });
      }
    }
    // Add deleted files
    for (const path of status.deleted) {
      const shortPath = path.replace(re, "");
      if (shortPath.startsWith("src")) {
        const hash = crypto
          .createHash("md5")
          .update(`deleted-${path}-${Date.now()}`)
          .digest("hex");

        changedFiles.push({
          path,
          shortPath,
          status: "deleted",
          hash,
        });
      }
    }

    // Add files from diff if comparing with a specific commit
    if (compareWith) {
      const diffFiles = (await this.git.diff([compareWith, "HEAD"]))
        .split("\n")
        .filter((line) => line.startsWith("diff --git"))
        .map((line) => line.split(" ").pop()?.slice(2))
        .filter(
          (file): file is string => !!file && file.startsWith(mainProject),
        );
      for (const path of diffFiles) {
        const shortPath = path.replace(re, "");
        if (shortPath.startsWith("src")) {
          if (!changedFiles.some((f) => f.path === path)) {
            const hash = await this.getFileHash(path);
            changedFiles.push({ path, shortPath, status: "modified", hash });
          }
        }
      }
    }
    return changedFiles;
  }

  async isGitRepository(): Promise<boolean> {
    try {
      await this.git.revparse(["--git-dir"]);
      return true;
    } catch {
      return false;
    }
  }
}
