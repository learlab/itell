import { simpleGit, SimpleGit } from "simple-git";
import { ChangedFile } from "./types.js";
import path from "path";

export class GitManager {
  private git: SimpleGit;

  constructor(workingDir: string) {
    this.git = simpleGit(workingDir);
  }

  async getChangedFiles(mainProject: string): Promise<ChangedFile[]> {
    const status = await this.git.status();

    const re = new RegExp(`^${mainProject}`);
    // Filter for files in src directory only
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
    ].filter((file) => file.path.startsWith(path.join(mainProject, "src")));

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
