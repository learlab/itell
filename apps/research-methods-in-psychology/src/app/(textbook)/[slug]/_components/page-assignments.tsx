import { Suspense } from "react";
import Link from "next/link";
import { Elements } from "@itell/constants";
import { Errorbox } from "@itell/ui/callout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { type User } from "lucia";

import { Condition, SUMMARY_DESCRIPTION_ID } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { getPage } from "@/lib/pages/pages.server";
import { FinishedPrompt } from "./finished-prompt";
import { PageQuizModal } from "./page-quiz-modal";
import { SummaryCount } from "./summary/summary-count";
import { SummaryDescription } from "./summary/summary-description";
import { SummaryFormReread } from "./summary/summary-form-reread";
import { SummaryFormSimple } from "./summary/summary-form-simple";
import { SummaryFormSkip } from "./summary/summary-form-skip";
import { SummaryFormStairs } from "./summary/summary-form-stairs";

type Props = {
  pageSlug: string;
  pageStatus: PageStatus;
  user: User;
  condition: string;
};

export function PageAssignments({
  pageSlug,
  pageStatus,
  user,
  condition,
}: Props) {
  const page = getPage(pageSlug);
  if (!page) {
    return <Errorbox>failed to load assignments</Errorbox>;
  }

  const canSkipSummary = user.personalization.available_summary_skips > 0;

  if (canSkipSummary) {
    return (
      <AssignmentsShell>
        <Card className="border-info">
          <CardContent>
            <SummaryFormSkip
              pageStatus={pageStatus}
              page={page}
              streak={user.personalization.summary_streak}
            />
          </CardContent>
        </Card>
      </AssignmentsShell>
    );
  }

  return (
    <AssignmentsShell>
      <Card className="border-info">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">Summary</CardTitle>
          <CardDescription>
            You can unlock the next page by submitting{" "}
            <Link
              href={`#${SUMMARY_DESCRIPTION_ID}`}
              className="font-semibold text-info underline underline-offset-4"
            >
              a good summary
            </Link>{" "}
            of this page
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {user.finished ? (
            <Suspense fallback={<FinishedPrompt.Skeleton />}>
              <FinishedPrompt href="https://peabody.az1.qualtrics.com/jfe/form/SV_9zgxet1MhcfKxM2" />
            </Suspense>
          ) : null}
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
                  <SummaryCount pageSlug={pageSlug} />
                </Suspense>
              }
            />
          ) : null}
          {condition !== Condition.SIMPLE ? (
            <SummaryDescription condition={condition} />
          ) : null}
        </CardContent>
      </Card>
    </AssignmentsShell>
  );
}

function AssignmentsShell({ children }: { children: React.ReactNode }) {
  return (
    <section
      id={Elements.PAGE_ASSIGNMENTS}
      aria-labelledby="page-assignments-heading"
      className="mt-6 border-t-2 pt-6"
    >
      <h2 className="sr-only" id="page-assignments-heading">
        assignments
      </h2>
      {children}
    </section>
  );
}
