import fs from "fs/promises";
import path from "path";
import { SyncState } from "./types.js";

export class StateManager {
  private statePath: string;
  private state: SyncState;

  constructor(rootDir: string) {
    this.statePath = path.join(rootDir, ".itell", "sync-state.json");
    this.state = {
      lastSync: {
        timestamp: 0,
        files: {},
      },
    };
  }

  async init() {
    try {
      await fs.mkdir(path.dirname(this.statePath), { recursive: true });
      const content = await fs.readFile(this.statePath, "utf-8");
      this.state = JSON.parse(content);
    } catch {
      // State file doesn't exist or is invalid, use default state
      await this.save();
    }
  }

  async save() {
    await fs.writeFile(this.statePath, JSON.stringify(this.state, null, 2));
  }

  needsSync(filePath: string, hash: string, targetProject: string): boolean {
    const fileState = this.state.lastSync.files[filePath];
    if (!fileState) return true;
    if (fileState.hash !== hash) return true;
    return !fileState.targets.includes(targetProject);
  }

  recordSync(filePath: string, hash: string, targetProject: string) {
    if (!this.state.lastSync.files[filePath]) {
      this.state.lastSync.files[filePath] = {
        hash,
        targets: [],
      };
    }

    const fileState = this.state.lastSync.files[filePath];
    if (fileState.hash !== hash) {
      fileState.hash = hash;
      fileState.targets = [targetProject];
    } else if (!fileState.targets.includes(targetProject)) {
      fileState.targets.push(targetProject);
    }

    this.state.lastSync.timestamp = Date.now();
  }

  clearState() {
    this.state.lastSync = {
      timestamp: Date.now(),
      files: {},
    };
  }
}
