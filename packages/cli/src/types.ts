import { z } from "zod";

export const ConfigSchema = z.object({
  mainProject: z.string(),
  targetProjects: z.array(z.string()).optional(), // New field for target projects
  protectedFiles: z.array(z.string()),
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
  status: string;
}
