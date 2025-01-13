import { and, desc, eq, inArray } from "drizzle-orm";
import { memoize } from "nextjs-better-unstable-cache";

import { quiz_answers, users } from "@/drizzle/schema";
import { isProduction, Tags } from "@/lib/constants";
import { quizPages } from "@/lib/pages/pages.server";
import { db } from ".";

/**
 * If user answered the quiz for page
 */
export const isQuizAnswered = memoize(
  async (userId: string, pageSlug: string) => {
    const count = await db.$count(
      quiz_answers,
      and(eq(quiz_answers.pageSlug, pageSlug), eq(quiz_answers.userId, userId))
    );
    return count > 0;
  },
  {
    persist: false,
    revalidateTags: (userId, pageSlug) => [
      userId,
      pageSlug,
      Tags.GET_QUIZ_ANSWER,
    ],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "quiz-answered",
    suppressWarnings: true,
  }
);

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

export const analyzeClassQuiz = memoize(
  async (studentIds: string[], classId: string) => {
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
      .where(inArray(quiz_answers.userId, studentIds))
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
    revalidateTags: (_, classId) => ["analyze-class-quiz", classId],
    log: isProduction ? undefined : ["dedupe", "datacache", "verbose"],
    logid: "Analyze class quiz",
  }
);

export const getUserQuizzes = memoize(
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
