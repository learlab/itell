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
import { cn } from "@itell/utils";
import { Page } from "#content";
import { type User } from "lucia";

import { isQuizAnswered } from "@/db/quiz";
import { Condition, SUMMARY_DESCRIPTION_ID } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { MarkCompletedForm } from "./mark-completed-form";
import { PageAssignmentsStatusOverlay } from "./page-assignments-status-overlay";
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
  const hasQuiz = page.quiz && page.quiz.length > 0;
  const quizAnswered = await isQuizAnswered(user.id, page.slug);

  if (hasQuiz) {
    if (quizAnswered) {
      if (user.isAdmin) {
        return (
          <AssignmentsShell>
            <DeleteQuiz pageSlug={page.slug} />
          </AssignmentsShell>
        );
      } else {
        return null;
      }
    } else {
      return (
        <AssignmentsShell>
          <PageQuiz page={page} user={user} />;
        </AssignmentsShell>
      );
    }
  }

  if (page.assignments.length === 0) {
    // currently on a free page, show "mark as completed"
    if (!pageStatus.unlocked) {
      return (
        <AssignmentsShell showOverlay={false}>
          <MarkCompletedForm user={user} page={page} />
        </AssignmentsShell>
      );
    }

    return null;
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
            {!pageStatus.unlocked && (
              <>
                You can unlock the next page by submitting{" "}
                <Link
                  href={`#${SUMMARY_DESCRIPTION_ID}`}
                  className="text-info font-semibold underline underline-offset-4"
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

  if (page.assignments.length !== 0) {
    return (
      <AssignmentsShell key={"summary"}>
        <PageSummary />
      </AssignmentsShell>
    );
  }

  return null;
}

function AssignmentsShell({
  children,
  className,
  showOverlay = true,
  ...rest
}: {
  children: React.ReactNode;
  showOverlay?: boolean;
} & React.HtmlHTMLAttributes<HTMLDivElement>) {
  return (
    <section
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
      className={cn(
        "animate-in fade-in relative mt-6 space-y-4 border-t-2 pt-6 duration-1000",
        className
      )}
      {...rest}
    >
      <h2 className="sr-only" id="page-assignments-heading">
        assignments
      </h2>
      {showOverlay && <PageAssignmentsStatusOverlay />}
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
