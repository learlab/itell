"use server";

import { and, eq, inArray } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { db } from "@/db";
import { quiz_answers, QuizDataSchema } from "@/drizzle/schema";
import { Tags } from "@/lib/constants";
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
      .where(
        and(
          eq(quiz_answers.pageSlug, input.pageSlug),
          eq(quiz_answers.userId, ctx.user.id)
        )
      );
  });

export const getQuizAttemps = authedProcedure.handler(async ({ ctx }) => {
  return await getUserQuizAttemptsHandler(ctx.user.id);
});

export const getQuizAttemptsByClass = authedProcedure
  .input(
    z.object({
      ids: z.array(z.string()),
    })
  )
  .handler(async ({ input }) => {
    return await getClassQuizAttemptsHandler(input.ids);
  });

const getClassQuizAttemptsHandler = memoize(
  async (ids: string[]) => {
    const records = await db
      .select({
        userId: quiz_answers.userId,
        pageSlug: quiz_answers.pageSlug,
      })
      .from(quiz_answers)
      .where(inArray(quiz_answers.userId, ids));

    return records;
  },
  {
    persist: false,
  }
);

const getUserQuizAttemptsHandler = memoize(
  async (userId: string) => {
    const records = await db
      .select({
        pageSlug: quiz_answers.pageSlug,
      })
      .from(quiz_answers)
      .where(eq(quiz_answers.userId, userId));

    return records;
  },
  {
    persist: false,
    revalidateTags: (userId) => [userId, Tags.GET_QUIZ_ATTEMPTS],
  }
);
