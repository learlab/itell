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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@itell/ui/tabs";
import { cn } from "@itell/utils";
import { Page } from "#content";
import { type User } from "lucia";

import { isQuizAnswered } from "@/db/quiz";
import { Condition, SUMMARY_DESCRIPTION_ID } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { MarkCompletedForm } from "./mark-completed-form";
import { PageQuiz } from "./quiz/page-quiz";
import { DeleteQuiz } from "./quiz/page-quiz-delete-answer";
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

export async function PageAssignments({
  page,
  pageStatus,
  user,
  condition,
}: Props) {
  if (page.assignments.length === 0) {
    if (!pageStatus.unlocked) {
      return (
        <AssignmentsShell>
          <MarkCompletedForm user={user} page={page} />
        </AssignmentsShell>
      );
    }

    return null;
  }
  const hasQuiz = page.quiz && page.quiz.length > 0;
  let quizReady = false;
  let quizAnswered = false;
  if (hasQuiz) {
    quizAnswered = await isQuizAnswered(user.id, page.slug);
    quizReady = pageStatus.unlocked && !quizAnswered;
  }

  function PageSummary() {
    const canSkipSummary = user.personalization.available_summary_skips > 0;
    if (condition !== Condition.SIMPLE && canSkipSummary) {
      return (
        <Card className="border-info">
          <CardContent>
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
      );
    }

    return (
      <Card className="border-info">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <span>Summary</span>
            <ToggleShowFloatingSummary />
          </CardTitle>
          <CardDescription>
            {pageStatus.unlocked ? (
              <>
                You have finished this page, you are still welcome to improve
                the summary.
              </>
            ) : (
              <>
                You can unlock the next page by submitting{" "}
                <Link
                  href={`#${SUMMARY_DESCRIPTION_ID}`}
                  className="font-semibold text-info underline underline-offset-4"
                >
                  a good summary
                </Link>{" "}
                of this page
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
                  <SummaryCount pageSlug={page.slug} userId={user.id} />
                </Suspense>
              }
            />
          ) : null}
          {condition !== Condition.SIMPLE ? (
            <>
              <SummaryDescription condition={condition} />
              <FloatingSummary isAdmin={user.isAdmin} />
            </>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  if (quizReady) {
    return (
      <AssignmentsShell key={"quiz"}>
        {quizAnswered && user.isAdmin && <DeleteQuiz pageSlug={page.slug} />}
        <Tabs defaultValue="quiz">
          <TabsList>
            <TabsTrigger value="quiz">Quiz</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="quiz">
            <PageQuiz page={page} user={user} />
          </TabsContent>
          <TabsContent value="summary">
            <PageSummary />
          </TabsContent>
        </Tabs>
      </AssignmentsShell>
    );
  }

  if (page.assignments.length !== 0) {
    return (
      <AssignmentsShell key={"summary"}>
        {quizAnswered && user.isAdmin && <DeleteQuiz pageSlug={page.slug} />}
        <PageSummary />
      </AssignmentsShell>
    );
  }

  return null;
}

function AssignmentsShell({
  children,
  className,
  ...rest
}: { children: React.ReactNode } & React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <section
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
      className={cn(
        "mt-6 space-y-4 border-t-2 pt-6 duration-1000 animate-in fade-in",
        className
      )}
      {...rest}
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
