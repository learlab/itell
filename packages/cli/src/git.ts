import { simpleGit, SimpleGit } from "simple-git";
import { ChangedFile } from "./types.js";
import crypto from "crypto";

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
  ): Promise<ChangedFile[]> {
    let diffArgs = ["HEAD"];
    if (compareWith) {
      // Validate the compare reference exists
      try {
        await this.git.revparse(compareWith);
        diffArgs = [compareWith, "HEAD"];
      } catch (error) {
        throw new Error(`Invalid git reference: ${compareWith}`);
      }
    }

    const status = await this.git.status();
    const diffFiles = compareWith
      ? (await this.git.diff(diffArgs))
          .split("\n")
          .filter((line) => line.startsWith("diff --git"))
          .map((line) => line.split(" ").pop()?.slice(2))
          .filter(
            (file): file is string => !!file && file.startsWith(mainProject),
          )
      : [];

    const changedFiles: ChangedFile[] = [];
    const re = new RegExp(`^${mainProject}/`);

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
