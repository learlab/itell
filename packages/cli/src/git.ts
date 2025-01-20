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
    // let diffCommand = ["HEAD"];
    // if (compareWith) {
    //   // Validate the compare reference exists
    //   try {
    //     await this.git.revparse(compareWith);
    //     diffCommand = [compareWith, "HEAD"];
    //   } catch (error) {
    //     throw new Error(`Invalid git reference: ${compareWith}`);
    //   }
    // }

    const status = await this.git.status();
    // const diffFiles = compareWith
    //   ? (await this.git.diff(diffCommand))
    //       .split("\n")
    //       .filter((line) => line.startsWith("diff --git"))
    //       .map((line) => line.split(" ").pop()?.slice(2))
    //       .filter((file): file is string => !!file && file.startsWith("src/"))
    //   : [];

    const re = new RegExp(`^${mainProject}/`);
    const files: ChangedFile[] = [
      ...status.modified.map((path) => ({
        path: path.replace(re, ""),
        status: "modified",
      })),
      ...status.not_added.map((path) => ({
        path: path.replace(re, ""),
        status: "added",
      })),
      ...status.deleted.map((path) => ({
        path: path.replace(re, ""),
        status: "deleted",
      })),
    ]
      // NOTE: ignore files outside of src/
      .filter((file) => file.path.startsWith("src"));

    return files;
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
