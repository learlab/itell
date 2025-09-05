import { z } from "zod";

export const ScoreSchema = z.object({
  score: z.number(),
  is_passing: z.boolean(),
  feedback: z.string().optional(),
});
export type Score = z.infer<typeof ScoreSchema>;
