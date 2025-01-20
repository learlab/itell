import { z } from "zod";

export const ConfigSchema = z.object({
  mainProject: z.string(), // full path e.g. "apps/project-1"
  targetProjects: z.array(z.string()).optional(), // full paths e.g. ["apps/project-2"]
  protectedFiles: z.array(z.string()).optional(), // files/patterns within src directory
  projects: z
    .record(
      z.object({
        protectedFiles: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export interface ChangedFile {
  path: string;
  shortPath: string;
  status: string;
  hash?: string; // git hash for tracking
}

export interface SyncState {
  lastSync: {
    timestamp: number;
    files: {
      [filepath: string]: {
        hash: string;
        targets: string[];
      };
    };
  };
}
