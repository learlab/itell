import { eq } from "drizzle-orm";

import { db, first } from "@/db";
import { cloze_answers } from "@/drizzle/schema";

export const getClozeSession = async (userId: string) => {
  return first(
    await db
      .select()
      .from(cloze_answers)
      .where(eq(cloze_answers.userId, userId))
  );
};
