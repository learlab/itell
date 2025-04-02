"use server";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { db, first } from "@/db";
import { findTeacher } from "@/db/teacher";
import { updateUser } from "@/db/user";
import {
  chat_messages,
  constructed_responses,
  events,
  feedbacks,
  focus_times,
  quiz_answers,
  summaries,
  teachers,
  TeacherSchema,
  UpdateUserSchema,
  users,
} from "@/drizzle/schema";
import { isProduction, Tags } from "@/lib/constants";
import { isLastPage } from "@/lib/pages";
import {
  firstPage,
  getPageData,
  isPageAfter,
  nextPage,
} from "@/lib/pages/pages.server";
import { authedProcedure } from "./utils";

/**
 * Check if user is a teacher
 */
export const getTeacherAction = authedProcedure
  .output(TeacherSchema.nullable())
  .handler(async ({ ctx }) => {
    return await getTeacherActionHandler(ctx.user.id);
  });

const getTeacherActionHandler = memoize(
  async (userId: string) => {
    return findTeacher(userId);
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: (userId) => ["get-teacher", userId],
    log: isProduction ? [] : ["dedupe", "datacache", "verbose"],
    logid: "Get teacher",
  }
);

/**
 * Update current user
 */
export const updateUserAction = authedProcedure
  .input(UpdateUserSchema)
  .handler(async ({ input, ctx }) => {
    const updatedUser = await updateUser(ctx.user.id, input);

    revalidateTag(Tags.GET_SESSION);

    return updatedUser[0];
  });

export const updateUserPrefsAction = authedProcedure
  .input(
    z.object({
      preferences: z.object({
        theme: z.string().optional(),
        note_color_light: z.string().optional(),
        note_color_dark: z.string().optional(),
      }),
    })
  )
  .handler(async ({ input, ctx }) => {
    await db.transaction(async (tx) => {
      const user = first(
        await tx.select().from(users).where(eq(users.id, ctx.user.id))
      );
      if (user) {
        const prefs = user.preferences ?? {};
        if (input.preferences.theme) {
          prefs.theme = input.preferences.theme;
        }

        if (input.preferences.note_color_light) {
          prefs.note_color_light = input.preferences.note_color_light;
        }

        if (input.preferences.note_color_dark) {
          prefs.note_color_dark = input.preferences.note_color_dark;
        }

        if (Object.keys(prefs).length === 0) {
          return;
        }

        await tx
          .update(users)
          .set({ preferences: prefs })
          .where(eq(users.id, ctx.user.id));
      }
    });
  });

/**
 * Reset user progress, also deletes all user data, including summaries, answers, events, etc.
 */
export const resetUserAction = authedProcedure
  .output(z.object({ pageSlug: z.string() }))
  .handler(async ({ ctx }) => {
    const userId = ctx.user.id;
    return await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ finished: false, pageSlug: null })
        .where(eq(users.id, userId));
      await tx.delete(summaries).where(eq(summaries.userId, userId));
      await tx.delete(chat_messages).where(eq(chat_messages.userId, userId));
      await tx.delete(focus_times).where(eq(focus_times.userId, userId));
      await tx.delete(events).where(eq(events.userId, userId));
      await tx
        .delete(constructed_responses)
        .where(eq(constructed_responses.userId, userId));
      await tx.delete(feedbacks).where(eq(feedbacks.userId, userId));
      await tx.delete(quiz_answers).where(eq(quiz_answers.userId, userId));

      return { pageSlug: firstPage.slug };
    });
  });

export const deleteUserAction = authedProcedure.handler(async ({ ctx }) => {
  return db.transaction(async (tx) => {
    await tx.delete(users).where(eq(users.id, ctx.user.id));
    await tx.delete(teachers).where(eq(teachers.id, ctx.user.id));
  });
});

/**
 Update user's page slug to the next page that requires a summary, if user is at the last page, set finished to true.

 This should only be used for the simple condition, for conditions with a summary, use createSummaryAction instead.
 */

export const incrementUserPageSlugAction = authedProcedure
  .input(
    z.object({
      currentPageSlug: z.string(),
      withStreakSkip: z.boolean().optional(),
    })
  )
  .handler(async ({ input, ctx }) => {
    const nextPageSlug = nextPage(input.currentPageSlug);
    const shouldUpdateUserPageSlug = isPageAfter(
      nextPageSlug,
      ctx.user.pageSlug
    );
    const page = getPageData(input.currentPageSlug);

    if (page) {
      let newPersonalization = ctx.user.personalization;
      if (input.withStreakSkip) {
        newPersonalization = {
          ...newPersonalization,
          available_summary_skips:
            newPersonalization.available_summary_skips > 0
              ? newPersonalization.available_summary_skips - 1
              : 0,
        };
      }

      await db
        .update(users)
        .set({
          pageSlug: shouldUpdateUserPageSlug ? nextPageSlug : undefined,
          finished: isLastPage(page),
          personalization: newPersonalization,
        })
        .where(eq(users.id, ctx.user.id));
    }

    revalidateTag(Tags.GET_SESSION);

    return {
      nextPageSlug: shouldUpdateUserPageSlug ? nextPageSlug : ctx.user.pageSlug,
    };
  });
