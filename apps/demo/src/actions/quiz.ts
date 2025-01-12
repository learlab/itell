"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { quiz_answers, QuizDataSchema } from "@/drizzle/schema";
import { authedProcedure } from "./utils";

export const createQuizAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
      data: QuizDataSchema,
    })
  )
  .handler(async ({ input, ctx }) => {
    return await db.insert(quiz_answers).values({
      pageSlug: input.pageSlug,
      userId: ctx.user.id,
      data: input.data,
    });
  });

export const deleteQuizAction = authedProcedure
  .input(
    z.object({
      pageSlug: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await db
      .delete(quiz_answers)
      .where(and(eq(quiz_answers.pageSlug, input.pageSlug), eq(quiz_answers.userId, ctx.user.id)));
  });
