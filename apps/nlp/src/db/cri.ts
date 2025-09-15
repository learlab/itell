import { count, eq, getTableColumns, sql } from "drizzle-orm";

import { constructed_responses, users } from "@/drizzle/schema";
import { db } from ".";

/**
 * Get CRI statistics for class
 */
export const getClassCRIStats = async (classId: string) => {
  const roundedScore = sql<number>`ROUND(${constructed_responses.score})::integer`;

  const byScore = await db
    .select({
      score: roundedScore, // Select the rounded score
      count: count(), // Select the count for that score group
    })
    .from(constructed_responses)
    .leftJoin(users, eq(users.id, constructed_responses.userId))
    .where(eq(users.classId, classId))
    .groupBy(roundedScore);

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
      .select({
        ...getTableColumns(constructed_responses),
        score: sql<number>`ROUND(${constructed_responses.score})::integer`,
      })
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, userId));

    const roundedScore = sql<number>`ROUND(${constructed_responses.score})::integer`;

    const byScore = await tx
      .select({
        score: roundedScore,
        count: count(),
      })
      .from(constructed_responses)
      .where(eq(constructed_responses.userId, userId))
      .groupBy(roundedScore);

    return { records, byScore };
  });
};
