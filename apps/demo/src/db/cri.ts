import { count, eq } from "drizzle-orm";

import { constructed_responses, users } from "@/drizzle/schema";
import { db } from ".";

/**
 * Get CRI statistics for class
 */
export const getClassCRIStats = async (classId: string) => {
  const byScore = await db
    .select({
      count: count(),
      isPassed: constructed_responses.is_passed,
    })
    .from(constructed_responses)
    .leftJoin(users, eq(users.id, constructed_responses.userId))
    .where(eq(users.classId, classId))
    .groupBy(constructed_responses.score);

  return { byScore };
};

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
        isPassed: constructed_responses.is_passed,
      })
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, userId))
      .groupBy(constructed_responses.score);

    return { records, byScore };
  });
};
