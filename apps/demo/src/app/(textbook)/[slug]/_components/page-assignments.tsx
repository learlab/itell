import { Suspense } from "react";
import Link from "next/link";
import { Elements } from "@itell/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { Page } from "#content";
import { and, eq, inArray } from "drizzle-orm";
import { type User } from "lucia";

import { db } from "@/actions/db";
import { NavigationButton } from "@/components/navigation-button";
import { survey_sessions } from "@/drizzle/schema";
import { Condition, SUMMARY_DESCRIPTION_ID } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage, PageData } from "@/lib/pages";
import { getPageData } from "@/lib/pages/pages.server";
import { PageQuizModal } from "./page-quiz-modal";
import { PreAssignmentPrompt } from "./pre-assignment-prompt";
import { QuizPrompt } from "./quiz-prompt";
import {
  FloatingSummary,
  ToggleShowFloatingSummary,
} from "./summary/floating-summary";
import { SummaryCount } from "./summary/summary-count";
import { SummaryDescription } from "./summary/summary-description";
import { SummaryFormReread } from "./summary/summary-form-reread";
import { SummaryFormSimple } from "./summary/summary-form-simple";
import { SummaryFormSkip } from "./summary/summary-form-skip";
import { SummaryFormStairs } from "./summary/summary-form-stairs";

type Props = {
  page: Page;
  pageStatus: PageStatus;
  user: User;
  condition: string;
};

// prompt for outtake survey if user reaches second to last page
const isOuttakeReady = (userPage: PageData | null) => {
  const outtakeReady =
    isLastPage(userPage) ||
    isLastPage(getPageData(userPage?.next_slug ?? null));

  return outtakeReady;
};

const isQuizPromptReady = (userPage: PageData | null) => {
  return isLastPage(userPage);
};

const getSurveyStatus = async (user: User) => {
  const sessions = await db
    .select()
    .from(survey_sessions)
    .where(
      and(
        eq(survey_sessions.userId, user.id),
        inArray(survey_sessions.surveyId, ["intake", "outtake"])
      )
    );

  const intakeSession = sessions.find(
    (session) => session.surveyId === "intake"
  );
  const outtakeSession = sessions.find(
    (session) => session.surveyId === "outtake"
  );

  return {
    intakeDone: intakeSession && intakeSession.finishedAt !== null,
    outtakeDone: outtakeSession && outtakeSession.finishedAt !== null,
  };
};

export async function PageAssignments({
  page,
  pageStatus,
  user,
  condition,
}: Props) {
  const userPage = getPageData(user.pageSlug);
  const { intakeDone, outtakeDone } = await getSurveyStatus(user);
  const outtakeReady = isOuttakeReady(userPage);
  const quizPromptReady = isQuizPromptReady(userPage);

  if (!user.consentGiven) {
    return (
      <AssignmentsShell>
        <PreAssignmentPrompt
          title="Review Consent Form"
          description="Please indicate your consent to participate in this study."
        >
          <NavigationButton href={routes.consent()}>
            Consent Form
          </NavigationButton>
        </PreAssignmentPrompt>
      </AssignmentsShell>
    );
  }

  if (!intakeDone) {
    return (
      <AssignmentsShell>
        <PreAssignmentPrompt
          title="Take Intake Survey"
          description="Before starting the textbook, help us customize your learning experience by completing the intake survey."
        >
          <NavigationButton href={routes.surveyHome({ surveyId: "intake" })}>
            Intake Survey
          </NavigationButton>
        </PreAssignmentPrompt>
      </AssignmentsShell>
    );
  }

  if (outtakeReady && !outtakeDone) {
    return (
      <AssignmentsShell>
        <PreAssignmentPrompt
          title="Take Outtake Survey"
          description="
            Great job making it close to the end of the textbook! Please help us
            learn about your learning experience by completing the outtake
            survey.
          "
        >
          <NavigationButton href={routes.surveyHome({ surveyId: "outtake" })}>
            Outtake Survey
          </NavigationButton>
        </PreAssignmentPrompt>
      </AssignmentsShell>
    );
  }

  const canSkipSummary = user.personalization.available_summary_skips > 0;

  if (canSkipSummary) {
    return (
      <AssignmentsShell>
        {quizPromptReady && (
          <Suspense fallback={<QuizPrompt.Skeleton />}>
            <QuizPrompt />
          </Suspense>
        )}

        <Card className="border-info">
          <CardContent>
            {condition !== Condition.SIMPLE ? (
              <PageQuizModal page={page} pageStatus={pageStatus} />
            ) : null}
            <SummaryFormSkip
              pageStatus={pageStatus}
              page={page}
              streak={user.personalization.summary_streak}
              available_summary_skips={
                user.personalization.available_summary_skips
              }
            />
          </CardContent>
        </Card>
      </AssignmentsShell>
    );
  }

  if (page.assignments.length !== 0) {
    return (
      <AssignmentsShell>
        {quizPromptReady && (
          <Suspense fallback={<QuizPrompt.Skeleton />}>
            <QuizPrompt />
          </Suspense>
        )}

        <Card className="border-info">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <span>Summary</span>
              <ToggleShowFloatingSummary />
            </CardTitle>
            <CardDescription>
              {pageStatus.unlocked ? (
                <p>
                  You have finished this page, you are still welcome to improve
                  the summary.
                </p>
              ) : (
                <p>
                  You can unlock the next page by submitting{" "}
                  <Link
                    href={`#${SUMMARY_DESCRIPTION_ID}`}
                    className="font-semibold text-info underline underline-offset-4"
                  >
                    a good summary
                  </Link>{" "}
                  of this page
                </p>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {condition !== Condition.SIMPLE ? (
              <PageQuizModal page={page} pageStatus={pageStatus} />
            ) : null}
            {condition === Condition.SIMPLE ? (
              <SummaryFormSimple page={page} pageStatus={pageStatus} />
            ) : null}
            {condition === Condition.RANDOM_REREAD ? (
              <SummaryFormReread
                user={user}
                page={page}
                pageStatus={pageStatus}
              />
            ) : condition === Condition.STAIRS ? (
              <SummaryFormStairs
                user={user}
                page={page}
                pageStatus={pageStatus}
                afterSubmit={
                  <Suspense fallback={<SummaryCount.Skeleton />}>
                    <SummaryCount pageSlug={page.slug} />
                  </Suspense>
                }
              />
            ) : null}
            {condition !== Condition.SIMPLE ? (
              <>
                <SummaryDescription condition={condition} />
                <FloatingSummary />
              </>
            ) : null}
          </CardContent>
        </Card>
      </AssignmentsShell>
    );
  }

  return null;
}

function AssignmentsShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
      className="mt-6 space-y-4 border-t-2 pt-6"
    >
      <h2 className="sr-only" id="page-assignments-heading">
        assignments
      </h2>
      {children}
    </section>
  );
}

PageAssignments.Skeleton = function AssignmentsSkeleton() {
  return (
    <AssignmentsShell>
      <Skeleton className="h-32" />
    </AssignmentsShell>
  );
};
