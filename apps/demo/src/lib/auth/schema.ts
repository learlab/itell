import { z } from "zod";

export const GoogleUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  picture: z.string().optional(),
});

export const AzureUserSchema = z.object({
  oid: z.string(),
  preferred_username: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
});
