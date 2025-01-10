"use server";

import { count, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  constructed_responses,
  constructed_responses_feedback,
  CreateConstructedResponseFeedbackSchema,
  CreateConstructedResponseSchema,
  users,
} from "@/drizzle/schema";
import { isProduction } from "@/lib/constants";
import { updatePersonalizationStreak } from "@/lib/personalization";
import { authedProcedure } from "./utils";

/**
 * Create constructed response item
 */
export const createQuestionAnswerAction = authedProcedure
  .input(CreateConstructedResponseSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    if (isProduction) {
    }
    return await db.insert(constructed_responses).values({
      ...input,
      userId: ctx.user.id,
    });
  });

/**
 * Create constructed response feedback
 */
export const createQuestionFeedbackAction = authedProcedure
  .input(CreateConstructedResponseFeedbackSchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    return await db.insert(constructed_responses_feedback).values({
      ...input,
      userId: ctx.user.id,
    });
  });

/**
 * Change streak of correctly answered questions for user
 */
export const updateCRIStreakAction = authedProcedure
  .input(
    z.object({
      isCorrect: z.boolean().optional(),
    })
  )
  .handler(async ({ ctx, input }) => {
    if (input.isCorrect === undefined) {
      // Return current streak, to fill the initial streak render for QuestionBoxStairs
      return ctx.user.personalization.cri_streak;
    }

    const newPersonalization = updatePersonalizationStreak(ctx.user, {
      cri: {
        isCorrect: input.isCorrect,
      },
    });

    const updatedUser = await db
      .update(users)
      .set({ personalization: newPersonalization })
      .where(eq(users.id, ctx.user.id))
      .returning({
        personalization: users.personalization,
      });

    return updatedUser[0].personalization?.cri_streak ?? 0;
  });
