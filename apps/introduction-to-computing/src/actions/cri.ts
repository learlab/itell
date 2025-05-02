"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  constructed_responses,
  createCRIFeedbackSchema,
  createCRISchema,
  feedbacks,
  users,
} from "@/drizzle/schema";
import { updatePersonalizationStreak } from "@/lib/personalization";
import { authedProcedure } from "./utils";

/**
 * Create constructed response item
 */
export const createCRIAnswerAction = authedProcedure
  .input(createCRISchema.omit({ userId: true }))
  .handler(async ({ input, ctx }) => {
    return await db.insert(constructed_responses).values({
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
      isCorrect: z.boolean(),
    })
  )
  .handler(async ({ ctx, input }) => {
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
