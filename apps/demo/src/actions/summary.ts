"use server";

import { revalidateTag } from "next/cache";
import { and, count, desc, eq, isNotNull, sql } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { db, first } from "@/db";
import {
  CreateSummarySchema,
  events,
  focus_times,
  summaries,
  users,
} from "@/drizzle/schema";
import {
  Condition,
  EventType,
  EXCELLENT_SUMMARY_THRESHOLD,
  isProduction,
  PAGE_SUMMARY_THRESHOLD,
  Tags,
} from "@/lib/constants";
import { isLastPage } from "@/lib/pages";
import { getPageData, isPageAfter, nextPage } from "@/lib/pages/pages.server";
import { updatePersonalizationStreak } from "@/lib/personalization";
import { authedProcedure } from "./utils";

/**
 * - Create summary record for current user
 * - If summary is passed or enough summaries has been written, update user's page slug to the next page that requires s summary, if user is at the last page, set finished to true
 * - Create keystroke events
 */
export const createSummaryAction = authedProcedure
  .input(
    z.object({
      summary: CreateSummarySchema.omit({ userId: true }),
      keystroke: z.object({
        start: z.string(),
        data: z.array(z.array(z.union([z.number(), z.string(), z.boolean()]))),
        isMobile: z.boolean(),
      }),
    })
  )
  .output(
    z.object({
      nextPageSlug: z.string().nullable(),
      canProceed: z.boolean(),
      isExcellent: z.boolean(),
    })
  )
  .handler(async ({ input, ctx }) => {
    let shouldRevalidate = false;
    const data = await db.transaction(async (tx) => {
      let canProceed =
        input.summary.condition === Condition.STAIRS
          ? input.summary.isPassed
          : true;
      if (!canProceed) {
        const [record] = await tx
          .select({ count: count() })
          .from(summaries)
          .where(
            and(
              eq(summaries.userId, ctx.user.id),
              eq(summaries.pageSlug, input.summary.pageSlug)
            )
          );
        canProceed = record.count + 1 >= PAGE_SUMMARY_THRESHOLD;
      }

      // Evaluate whether a summary is an "Excellent" summary (> the content score at a percentile defined by EXCELLENT_SUMMARY_THRESHOLD)
      const excellentThreshold = first(
        await tx
          .select({
            score: sql<number | null>`
          percentile_disc(${1 - EXCELLENT_SUMMARY_THRESHOLD})
          within group (order by ${summaries.contentScore})
        `,
          })
          .from(summaries)
          .where(isNotNull(summaries.contentScore))
      );

      const isExcellent = input.summary.contentScore
        ? input.summary.contentScore > (excellentThreshold?.score ?? Infinity)
        : false;

      // create summary record
      const { summaryId } = (
        await tx
          .insert(summaries)
          .values({
            ...input.summary,
            userId: ctx.user.id,
            isExcellent,
          })
          .returning({ summaryId: summaries.id })
      )[0];

      // create events
      if (isProduction) {
        await tx.insert(events).values({
          type: EventType.KEYSTROKE,
          pageSlug: input.summary.pageSlug,
          userId: ctx.user.id,
          data: {
            summaryId,
            start: input.keystroke.start,
            keystrokes: input.keystroke.data,
            isMobile: input.keystroke.isMobile,
          },
        });
      }

      // update user page slug
      const nextPageSlug = nextPage(input.summary.pageSlug);
      const shouldUpdateUserPageSlug = isPageAfter(
        nextPageSlug,
        ctx.user.pageSlug
      );

      // update user summary streak info
      if (canProceed) {
        shouldRevalidate = true;

        const newPersonalization = updatePersonalizationStreak(ctx.user, {
          summary: {
            isPassed: input.summary.isPassed,
            isExcellent: isExcellent,
          },
        });

        const page = getPageData(input.summary.pageSlug);
        if (page) {
          await tx
            .update(users)
            .set({
              pageSlug: shouldUpdateUserPageSlug ? nextPageSlug : undefined,
              finished: isLastPage(page),
              personalization: newPersonalization,
            })
            .where(eq(users.id, ctx.user.id));
        }
      }

      return {
        nextPageSlug: shouldUpdateUserPageSlug
          ? nextPageSlug
          : ctx.user.pageSlug,
        canProceed,
        isExcellent,
      };
    });

    if (shouldRevalidate) {
      revalidateTag(Tags.GET_SESSION);
    }

    revalidateTag(Tags.COUNT_SUMMARY);

    return data;
  });

/**
 * Get data to make the summary scoring request
 *
 */
export const getSummaryScoreRequestAction = authedProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    return await db.transaction(async (tx) => {
      const contentScoreHistory = (
        await tx
          .select({
            content: summaries.contentScore,
          })
          .from(summaries)
          .where(and(eq(summaries.userId, ctx.user.id)))
      ).map((v) => v.content);

      const focusTimes = first(
        await tx
          .select()
          .from(focus_times)
          .where(
            and(
              eq(focus_times.userId, ctx.user.id),
              eq(focus_times.pageSlug, input.pageSlug)
            )
          )
      );

      return {
        contentScoreHistory,
        focusTimes,
      };
    });
  });

/**
 * Get summary for class
 */
export const getSummariesClassAction = authedProcedure
  .input(z.object({ classId: z.string(), pageSlug: z.string().optional() }))
  .handler(async ({ input }) => {
    return await getSummariesClassHandler(input.classId, input.pageSlug);
  });
export const getSummariesClassHandler = memoize(
  async (classId: string, pageSlug?: string) => {
    return await db
      .select({
        id: summaries.id,
        text: summaries.text,
        pageSlug: summaries.pageSlug,
        isPassed: summaries.isPassed,
        createdAt: summaries.createdAt,
        updatedAt: summaries.updatedAt,
      })
      .from(summaries)
      .leftJoin(users, eq(users.id, summaries.userId))
      .where(
        and(
          eq(users.classId, classId),
          pageSlug !== undefined ? eq(summaries.pageSlug, pageSlug) : undefined
        )
      )
      .orderBy(desc(summaries.updatedAt));
  },
  {
    persist: false,
    // @ts-expect-error bypass server action check
    revalidateTags: async (classId, pageSlug) => [
      "get-summaries-class",
      classId,
      pageSlug ?? "",
    ],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Get summaries class",
  }
);

/**
 * Count summaries by pass / fail for current user and page
 */
export const countSummaryByPassingAction = authedProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    return countSummaryByPassingHandler(ctx.user.id, input.pageSlug);
  });

const countSummaryByPassingHandler = memoize(
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
