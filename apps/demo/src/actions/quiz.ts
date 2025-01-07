"use server";

import { desc, eq, inArray } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";
import { z } from "zod";

import { quiz_answers, QuizDataSchema, users } from "@/drizzle/schema";
import { isProduction, Tags } from "@/lib/constants";
import { quizPages } from "@/lib/pages/pages.server";
import { db } from "./db";
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

const correctAnswers = quizPages
  .flatMap((page) =>
    page.quiz?.map((q) => {
      const correctAnswer = q.answers.find((a) => a.correct);
      return { answer: correctAnswer?.answer ?? null, pageSlug: page.slug };
    })
  )
  .filter(Boolean)
  .reduce<Record<string, Array<string | null>>>((acc, { answer, pageSlug }) => {
    acc[pageSlug] = acc[pageSlug] || [];
    acc[pageSlug].push(answer);
    return acc;
  }, {});

const getCorrectCount = (
  answers: string[],
  correctAnswers: Array<string | null>
) => {
  if (answers.length !== correctAnswers.length) return 0;
  const correctCount = answers.filter(
    (answer, index) => answer === correctAnswers[index]
  ).length;
  return correctCount;
};

export const analyzeClassQuizAction = authedProcedure
  .input(
    z.object({
      studentIds: z.array(z.string()),
      classId: z.string(),
    })
  )
  .handler(async ({ input, ctx }) => {
    return await analyzeClassQuizHandler(input.studentIds, ctx.user.id);
  });

const analyzeClassQuizHandler = memoize(
  // need userId as cache key
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (ids: string[], userId: string) => {
    const results = await db
      // select distinct to only get the latest submission for each user/page
      .selectDistinctOn([quiz_answers.userId, quiz_answers.pageSlug], {
        userId: quiz_answers.userId,
        name: users.name,
        pageSlug: quiz_answers.pageSlug,
        data: quiz_answers.data,
        createdAt: quiz_answers.createdAt,
      })
      .from(quiz_answers)
      .leftJoin(users, eq(quiz_answers.userId, users.id))
      .where(inArray(quiz_answers.userId, ids))
      .orderBy(
        quiz_answers.userId,
        quiz_answers.pageSlug,
        desc(quiz_answers.createdAt)
      );

    const analyzedResults = results.map((result) => {
      const pageCorrectAnswers = correctAnswers[result.pageSlug];
      const count = getCorrectCount(result.data, pageCorrectAnswers);
      return {
        userId: result.userId,
        pageSlug: result.pageSlug,
        name: result.name ?? "Anonymous",
        count,
      };
    });

    return analyzedResults;
  },
  {
    persist: true,
    duration: 60 * 5,
    revalidateTags: (_, userId) => ["get-class-quiz", userId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Analyze class quiz",
  }
);

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
