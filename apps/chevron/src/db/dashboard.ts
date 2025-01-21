import { cache } from "react";
import { getGroupedReadingTime } from "@itell/core/dashboard";
import { and, count, eq, gte, inArray, sql } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import {
  constructed_responses,
  events,
  focus_times,
  summaries,
} from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { db } from ".";

export const incrementView = cache(
  async ({
    userId,
    pageSlug,
    data,
    type = "dashboard_page_view",
  }: {
    userId: string;
    pageSlug: string;
    data?: unknown;
    type?: string;
  }) => {
    await db.insert(events).values({
      type,
      pageSlug,
      userId,
      data,
    });
  }
);

/**
 * Get data for <UserRadarChart />
 */
export const getUserStats = memoize(
  async (userId: string) => {
    const [summary, answer] = await Promise.all([
      db
        .select({
          contentScore: sql<
            number | null
          >`PERCENTILE_CONT(0.5) within group (order by ${summaries.contentScore})`,
          contentScoreLastWeek: sql<number | null>`
			PERCENTILE_CONT(0.5) within group (
			  order by ${summaries.contentScore}
			) FILTER (WHERE ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS')
		  `,
          count: count(),
          passedCount: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`),
          countLastWeek: count(
            sql`CASE WHEN ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS' THEN 1 END`
          ),
          passedCountLastWeek: count(
            sql`CASE WHEN ${summaries.isPassed} AND ${summaries.updatedAt} <= now() - INTERVAL '7 DAYS' THEN 1 END`
          ),
        })
        .from(summaries)
        .where(eq(summaries.userId, userId)),

      db
        .select({
          count: count(),
          passedCount: count(
            sql`CASE WHEN ${constructed_responses.score} = 2 THEN 1 END`
          ),
        })
        .from(constructed_responses)
        .where(eq(constructed_responses.userId, userId)),
    ]);

    return {
      contentScore: summary[0].contentScore,
      contentScoreLastWeek: summary[0].contentScoreLastWeek,
      totalSummaries: summary[0].count,
      totalPassedSummaries: summary[0].passedCount,
      totalSummariesLastWeek: summary[0].countLastWeek,
      totalPassedSummariesLastWeek: summary[0].passedCountLastWeek,
      totalAnswers: answer[0].count,
      totalPassedAnswers: answer[0].passedCount,
    };
  },
  {
    persist: true,
    duration: 60,
    revalidateTags: (id) => ["user-stats", id],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "User stats",
  }
);

export const getOtherStats = memoize(
  async ({ otherIds }: { userId: string; otherIds: string[] }) => {
    const _summaryCount = db.$with("_summaryCount").as(
      db
        .select({
          total: count().as("total"),
          passed: count(sql`CASE WHEN ${summaries.isPassed} THEN 1 END`).as(
            "passed"
          ),
        })
        .from(summaries)
        .groupBy(summaries.userId)
        .where(inArray(summaries.userId, otherIds))
    );

    const _answerCount = db.$with("_answerCount").as(
      db
        .select({
          total: count().as("total"),
          passed: count(
            sql`CASE WHEN ${constructed_responses.score} = 2 THEN 1 END`
          ).as("passed"),
        })
        .from(constructed_responses)
        .groupBy(constructed_responses.userId)
        .where(inArray(constructed_responses.userId, otherIds))
    );

    const [summaryScores, summaryCount, answerCount] = await Promise.all([
      db
        .select({
          contentScore: sql<
            number | null
          >`PERCENTILE_CONT(0.5) within group (order by ${summaries.contentScore})`,
        })
        .from(summaries)
        .where(inArray(summaries.userId, otherIds)),

      db
        .with(_summaryCount)
        .select({
          total: sql<
            number | null
          >`PERCENTILE_CONT(0.5) within group (order by ${_summaryCount.total})`,
          passed: sql<
            number | null
          >`PERCENTILE_CONT(0.5) within group (order by ${_summaryCount.passed})`,
        })
        .from(_summaryCount),

      db
        .with(_answerCount)
        .select({
          total: sql<
            number | null
          >`PERCENTILE_CONT(0.5) within group (order by ${_answerCount.total})`,
          passed: sql<
            number | null
          >`PERCENTILE_CONT(0.5) within group (order by ${_answerCount.passed})`,
        })
        .from(_answerCount),
    ]);

    return {
      contentScore: summaryScores[0].contentScore,
      totalSummaries: summaryCount[0].total ?? 0,
      totalPassedSummaries: summaryCount[0].passed ?? 0,
      totalAnswers: answerCount[0].total ?? 0,
      totalPassedAnswers: answerCount[0].passed ?? 0,
    };
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: ({ userId }) => ["other-stats", userId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Other stats",
  }
);

export type UserStats = Awaited<ReturnType<typeof getUserStats>>;
export type OtherStats = Awaited<ReturnType<typeof getOtherStats>>;

/**
 * Get data for reading time chart, returns reading time and summary count
 */
export const getReadingTime = memoize(
  async ({
    userId,
    startDate,
    intervalDates,
  }: {
    userId: string;
    startDate: Date;
    intervalDates: Date[];
  }) => {
    // TODO: fix this query or how we store focus time data
    // for records created before start date, they can still be updated
    // but this won't be reflected in the reading time

    const { readingTime, summaryCount } = await db.transaction(async (tx) => {
      const dataExpanded = tx.$with("expanded").as(
        tx
          .select({
            value: sql`(jsonb_each(${focus_times.data})).value`.as("value"),
            createdAt: sql<Date>`${focus_times.createdAt}::date`.as(
              "createdAt"
            ),
          })
          .from(focus_times)
          .where(
            and(
              eq(focus_times.userId, userId),
              gte(focus_times.createdAt, startDate)
            )
          )
      );

      const readingTime = await tx
        .with(dataExpanded)
        .select({
          totalViewTime: sql<number>`sum(value::integer)::integer`.as(
            "totalViewTime"
          ),
          createdAt: dataExpanded.createdAt,
        })
        .from(dataExpanded)
        .groupBy(dataExpanded.createdAt);

      const summaryCount = await tx.$count(
        summaries,
        and(eq(summaries.userId, userId), gte(summaries.createdAt, startDate))
      );

      return { readingTime, summaryCount };
    });

    const readingTimeGrouped = await getGroupedReadingTime(
      readingTime,
      intervalDates
    );
    return { readingTimeGrouped, summaryCount };
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: ({ userId, startDate }) => [
      "reading-time",
      userId,
      startDate.toLocaleDateString(),
    ],
    additionalCacheKey: ["reading-time-chart"],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Reading time chart",
    suppressWarnings: true,
  }
);
