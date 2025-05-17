import { and, eq } from "drizzle-orm";

import { notes } from "@/drizzle/schema";
import { db } from ".";

export const getNotes = async (userId: string, pageSlug: string) => {
  return await db
    .select()
    .from(notes)
    .where(and(eq(notes.userId, userId), eq(notes.pageSlug, pageSlug)));
};
