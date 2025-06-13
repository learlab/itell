import { env } from "@/env.mjs";

export const isAdmin = (email: string | null) =>
  email ? env.ADMINS?.includes(email) || false : false;
