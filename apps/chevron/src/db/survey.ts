import { and, eq, inArray } from "drizzle-orm";
import { User } from "lucia";
import { memoize } from "nextjs-better-unstable-cache";

import { survey_sessions, SurveySession } from "@/drizzle/schema";
import { Survey } from "@/lib/constants";
import { isLastPage } from "@/lib/pages";
import { getPageData } from "@/lib/pages/pages.server";
import { db, first } from ".";

// memoized as this is nestedly called by layout/page
export const getSurveySessions = memoize(
  async <T extends string | string[]>(
    user: User,
    surveyId: T
  ): Promise<T extends string ? SurveySession | null : SurveySession[]> => {
    const sessions = await db
      .select()
      .from(survey_sessions)
      .where(
        and(
          eq(survey_sessions.userId, user.id),
          typeof surveyId === "string"
            ? eq(survey_sessions.surveyId, surveyId)
            : inArray(survey_sessions.surveyId, surveyId)
        )
      );

    if (typeof surveyId === "string") {
      return first(sessions) as T extends string
        ? SurveySession | null
        : SurveySession[];
    }

    return sessions as T extends string ? SurveySession : SurveySession[];
  },
  {
    persist: false,
  }
);

export const isSurveySessionFinished = (
  session: SurveySession | null | undefined
) => {
  return session && session.finishedAt !== null;
};

export const getSurveyStatus = async (user: User) => {
  const sessions = await getSurveySessions(user, [
    Survey.INTAKE,
    Survey.OUTTAKE,
  ]);
  const intakeSession = sessions.find(
    (session) => session.surveyId === Survey.INTAKE
  );
  const outtakeSession = sessions.find(
    (session) => session.surveyId === Survey.OUTTAKE
  );

  return {
    intakeDone: isSurveySessionFinished(intakeSession),
    outtakeDone: isSurveySessionFinished(outtakeSession),
  };
};

export const isOuttakeReady = (user: User) => {
  const userPage = getPageData(user.pageSlug);
  const outtakeReady =
    isLastPage(userPage) ||
    isLastPage(getPageData(userPage?.next_slug ?? null));

  return outtakeReady;
};
