import { cache } from "react";
import { and, desc, eq } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import { summaries } from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { db, first } from ".";

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

export const getSummary = cache(async (summaryId: number) => {
  return first(
    await db.select().from(summaries).where(eq(summaries.id, summaryId))
  );
});
