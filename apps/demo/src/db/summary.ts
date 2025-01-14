import { and, count, desc, eq, sql } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import { summaries, users } from "@/drizzle/schema";
import { isProduction, Tags } from "@/lib/constants";
import { db } from ".";

/**
 * Get summary for user, if `summaryId` is not provided, return all summaries
 */
export const getUserSummary = memoize(
  async ({ userId, summaryId }: { userId: string; summaryId?: number }) => {
    return await db
      .select()
      .from(summaries)
      .where(
        and(
          eq(summaries.userId, userId),
          summaryId !== undefined ? eq(summaries.id, summaryId) : undefined
        )
      )
      .orderBy(desc(summaries.updatedAt));
  },
  {
    persist: false,
    // @ts-expect-error bypass server action check
    revalidateTags: async (userId, summaryId) => [
      "get-summaries",
      userId,
      String(summaryId),
    ],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get summaries",
  }
);

/** Get chart data for summary
 *
 */
export const getClassSummaryStats = memoize(
  async (classId: string, pageSlug?: string) => {
    return (
      await db
        .select({
          passed: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
          failed: count(sql`CASE WHEN NOT ${summaries.isPassed} THEN 1 END`),
          startDate: sql<string | null>`MIN(${summaries.createdAt})`,
          endDate: sql<string | null>`MAX(${summaries.createdAt})`,
        })
        .from(summaries)
        .leftJoin(users, eq(users.id, summaries.userId))
        .where(
          and(
            eq(users.classId, classId),
            pageSlug !== undefined
              ? eq(summaries.pageSlug, pageSlug)
              : undefined
          )
        )
    )[0];
  },
  {
    persist: false,
    // @ts-expect-error bypass server action check
    revalidateTags: async (classId, pageSlug) => [
      "get-class-summaries",
      classId,
      pageSlug ?? "",
    ],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get class summaries",
  }
);

export const countSummary = memoize(
  async (userId: string, pageSlug: string) => {
    const record = await db
      .select({
        passed: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
        failed: count(sql`CASE WHEN NOT ${summaries.isPassed} THEN 1 END`),
      })
      .from(summaries)
      .where(
        and(eq(summaries.userId, userId), eq(summaries.pageSlug, pageSlug))
      );

    return record[0];
  },
  { persist: false, revalidateTags: [Tags.COUNT_SUMMARY] }
);
