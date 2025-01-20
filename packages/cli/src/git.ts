import { SimpleGit, simpleGit } from "simple-git";
import { ChangedFile } from "./types.js";

export class GitManager {
  private git: SimpleGit;

  constructor(workingDir: string) {
    this.git = simpleGit(workingDir);
  }

  async getChangedFiles(): Promise<ChangedFile[]> {
    const status = await this.git.status();

    const files: ChangedFile[] = [
      ...status.modified.map((path) => ({ path, status: "modified" })),
      ...status.not_added.map((path) => ({ path, status: "added" })),
      ...status.deleted.map((path) => ({ path, status: "deleted" })),
    ];

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
