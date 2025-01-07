"use client";

import { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { useSelector } from "@xstate/store/react";
import { ArrowRightIcon, StepForward } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import {
  useQuestionStore,
  useQuizStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { Confetti } from "@/components/ui/confetti";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { SelectIsNextPageVisible } from "@/lib/store/summary-store";
import { makePageHref, reportSentry } from "@/lib/utils";
import type { PageData } from "@/lib/pages";
import type { FormEvent } from "react";
import { createEventAction } from "@/actions/event";
import { EventType } from "@/lib/constants";

type Props = {
  pageStatus: PageStatus;
  page: PageData;
  streak: number;
  available_summary_skips: number;
};

// eslint-disable-next-line react/display-name
export const SummaryFormSkip = memo(({ pageStatus, page, streak, available_summary_skips }: Props) => {
  const questionStore = useQuestionStore();
  const quizStore = useQuizStore();
  const summaryStore = useSummaryStore();
  const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
  const isNextPageVisible = useSelector(summaryStore, SelectIsNextPageVisible);
  const router = useRouter();
  const [pageFinished, setPageFinished] = useState(pageStatus.unlocked);

  const {
    action,
    isError,
    isPending: _isPending,
    error,
    isDelayed,
  } = useActionStatus(
    async (e: FormEvent) => {
      e.preventDefault();

      const [_, err] = await incrementUserPageSlugAction({
        currentPageSlug: page.slug,
        withStreakSkip: true,
      });
      if (err) {
        throw new Error("increment user page slug action", { cause: err });
      }

      if (page.quiz && page.quiz.length > 0 && !pageStatus.unlocked) {
        quizStore.send({
          type: "toggleQuiz",
        });
        return;
      }

      if (isLastPage(page)) {
        toast.info("You have finished the entire textbook!", {
          duration: 100000,
        });
        return;
      }

      if (page.next_slug) {
        setPageFinished(true);
        router.push(page.next_slug);
        return;
      }
    },
    { delayTimeout: 3000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (error) {
      reportSentry("summary skip", {
        pageSlug: page.slug,
        error: error?.cause,
      });
    }
  }, [error, page]);

  if (!isSummaryReady) {
    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-extrabold">You have earned the write to skip writing a summary!</h3>
        <p>Finish the page first to unlock the summary section.</p>
        <p>
          You can skip writing a summary for this page once you have answered all the questions.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Confetti active={pageFinished} />
      <h3 className="text-2xl font-extrabold">Nicely Done!</h3>
      <div>
        {pageFinished ? (
          <>
            <p>You have earned the write to skip writing a summary by writing good summaries consistently or by writing an excellent summary.</p>
            <p>
              You can skip writing a summary on a page you haven&apos;t
              completed yet.
            </p>
            <p>
              🔥{" "}Streak count:{" "}
              <span className="font-semibold text-warning">{streak}</span>{" "}
            </p>
            <p>
              ⏭️{" "}Summary skips available:{" "}
              <span className="font-semibold text-warning">{available_summary_skips}</span>{" "}
            </p>
          </>
        ) : (
          <>
            <p>
            You have earned the write to skip writing a summary by writing good summaries consistently or by writing an excellent summary.{" "}
              <span className="font-bold underline decoration-sky-500 decoration-solid decoration-2">
                a streak of writing good summaries!{" "}
              </span>
            </p>
            <p>Click on the skip summary button below to skip writing a summary for this page. </p>
            <p>
              🔥{" "}Streak count:{" "}
              <span className="font-semibold text-warning">{streak}</span>{" "}
            </p>
            <p>
              ⏭️{" "}Summary skips available:{" "}
              <span className="font-semibold text-warning">{available_summary_skips}</span>{" "}
            </p>
          </>
        )}
      </div>

      <h2 id="completion-form-heading" className="sr-only">
        Page Completion Form
      </h2>
      <form
        aria-labelledby="completion-form-heading"
        className="flex justify-end gap-2"
        onSubmit={action}
      >
        <StatusButton
          pending={isPending}
          disabled={pageFinished ? !page.next_slug : false}
          onClick={() => {
            if (!pageFinished) {
              createEventAction({
                type: EventType.REWARD_SPENT,
                pageSlug: page.slug,
                data: {
                  rewardType: "summary-skip",
                }
              });
            }
          }}
        >
          {!pageFinished ? (
            <span className="inline-flex items-center gap-1">
              <StepForward className="size-4" /> Skip Summary{" "}
              {page.quiz ? "and Take Quiz" : ""}
            </span>
          ) : page.next_slug ? (
            <span className="inline-flex items-center gap-1">
              <ArrowRightIcon className="size-4" /> Go to next page
            </span>
          ) : (
            <span>Textbook finished</span>
          )}
        </StatusButton>
      </form>
      {isError ? (
        <Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
      ) : null}
      {isDelayed ? <DelayMessage /> : null}
    </div>
  );
});
