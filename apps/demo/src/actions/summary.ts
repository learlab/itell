"use server";

import { revalidateTag } from "next/cache";
import { and, count, eq, isNotNull, sql } from "drizzle-orm";
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
        const count = await tx.$count(
          summaries,
          and(
            eq(summaries.userId, ctx.user.id),
            eq(summaries.pageSlug, input.summary.pageSlug),
            isNotNull(summaries.contentScore)
          )
        );
        canProceed = count + 1 >= PAGE_SUMMARY_THRESHOLD;
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

      // update user page slug
      const nextPageSlug = nextPage(input.summary.pageSlug);
      const shouldUpdateUserPageSlug = isPageAfter(
        nextPageSlug,
        ctx.user.pageSlug
      );

      // update user summary streak
      if (canProceed) {
        shouldRevalidate = true;
        let newPersonalization = ctx.user.personalization;
        if (input.summary.condition === Condition.STAIRS) {
          newPersonalization = updatePersonalizationStreak(ctx.user, {
            summary: {
              isExcellent,
              isPassed: input.summary.isPassed,
            },
          });
        }

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

      // return value for the transaction
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
 * Get data for summary scoring request (stairs)
 *
 * keep this as a server action as it is called client side by summary-form-stairs
 */
export const getStairsHistory = authedProcedure
  .input(z.object({ pageSlug: z.string() }))
  .handler(async ({ input, ctx }) => {
    return await db.transaction(async (tx) => {
      const contentScoreHistory = (
        await tx
          .select({
            content: sql<number>`${summaries.contentScore}`,
          })
          .from(summaries)
          .where(
            and(
              eq(summaries.userId, ctx.user.id),
              isNotNull(summaries.contentScore)
            )
          )
      ).map((v) => v.content);

      const focusTimes = first(
        await tx
          .select({ data: focus_times.data })
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
