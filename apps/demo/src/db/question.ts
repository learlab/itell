import { count, eq } from "drizzle-orm";

import { constructed_responses } from "@/drizzle/schema";
import { db } from ".";

/**
 * Get CRI statistics
 *
 * - all answers
 * - count answers by score
 */
export const getCRIStats = async (userId: string) => {
  return await db.transaction(async (tx) => {
    const records = await tx
      .select()
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, userId));

    const byScore = await tx
      .select({
        count: count(),
        score: constructed_responses.score,
      })
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, userId))
      .groupBy(constructed_responses.score);

    return { records, byScore };
  });
};
