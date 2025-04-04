"use client";

import { memo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { useSelector } from "@xstate/store/react";
import { ArrowBigRightIcon, FlameIcon, StepForward } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createEventAction } from "@/actions/event";
import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import { useCRIStore } from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { SelectSummaryReady } from "@/lib/store/cri-store";
import { reportSentry } from "@/lib/utils";
import type { PageData } from "@/lib/pages";
import type { FormEvent } from "react";
import { sendScormUpdate } from "@/lib/scorm/scorm-communication";
import { allPagesSorted } from "tests/utils";


type Props = {
  pageStatus: PageStatus;
  page: PageData;
  streak: number;
  available_summary_skips: number;
};

// eslint-disable-next-line react/display-name
export const SummaryFormSkip = memo(
  ({ pageStatus, page, streak, available_summary_skips }: Props) => {
    const criStore = useCRIStore();
    const isSummaryReady = useSelector(criStore, SelectSummaryReady);
    const router = useRouter();

    const {
      action,
      isError,
      isPending: _isPending,
      error,
      isDelayed,
    } = useActionStatus(
      async (e: FormEvent) => {
        e.preventDefault();

        const [, err] = await incrementUserPageSlugAction({
          currentPageSlug: page.slug,
          withStreakSkip: true,
        });
        if (err) {
          throw new Error("increment user page slug action", { cause: err });
        }

        const totalPages = allPagesSorted.length;
      const currentPageIndex = page.order;
      const progressPercentage = Math.round(((currentPageIndex + 1) / totalPages) * 100);
      
      // Send SCORM updates
      sendScormUpdate({
        score: progressPercentage,
        progress: page.title,
        lessonStatus: isLastPage(page) ? "completed" : "incomplete",
        completion: isLastPage(page)
      });
        if (isLastPage(page)) {
          toast.info("You have finished the entire textbook!", {
            duration: 100000,
          });
          return;
        }

        if (page.next_slug) {
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
          <h3 className="text-2xl font-extrabold">
            You have earned the write to skip writing a summary!
          </h3>
          <p>Finish the page first to unlock the summary section.</p>
          <p>
            You can skip writing a summary for this page once you have answered
            all the questions.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-extrabold">Nicely Done!</h3>
        <div className="flex flex-col gap-1 leading-relaxed">
          {pageStatus.unlocked ? (
            <>
              <p>
                You have earned the write to skip writing a summary by writing
                good summaries consistently or by writing an excellent summary.
              </p>
              <p>
                You can skip writing a summary on a page you haven&apos;t
                completed yet.
              </p>
            </>
          ) : (
            <>
              <p>
                You have earned the write to skip writing a summary by writing
                good summaries consistently or by writing an excellent summary.{" "}
                <span className="font-bold underline decoration-sky-500 decoration-solid decoration-2">
                  a streak of writing good summaries!{" "}
                </span>
              </p>
              <p>
                Click on the skip summary button below to skip writing a summary
                for this page.{" "}
              </p>
            </>
          )}

          <p className="flex items-center">
            <FlameIcon className="mr-1 size-6 stroke-red-500" /> Streak count:{" "}
            <span className="text-warning font-semibold">{streak}</span>{" "}
          </p>
          <p className="flex items-center">
            <ArrowBigRightIcon className="stroke-info mr-1 size-6" /> Summary
            skips available:{" "}
            <span className="text-warning font-semibold">
              {available_summary_skips}
            </span>{" "}
          </p>
        </div>

        <h2 id="completion-form-heading" className="sr-only">
          Page Completion Form
        </h2>
        <form
          aria-labelledby="completion-form-heading"
          className="flex justify-end gap-2"
          onSubmit={action}
        >
          {pageStatus.latest && (
            <StatusButton
              pending={isPending}
              disabled={isPending}
              onClick={() => {
                createEventAction({
                  type: EventType.REWARD_SPENT,
                  pageSlug: page.slug,
                  data: {
                    rewardType: "summary-skip",
                  },
                });
              }}
            >
              <span className="flex items-center gap-2">
                <StepForward className="size-4" />
                <span>Skip Summary</span>
              </span>
            </StatusButton>
          )}
        </form>
        {isError ? (
          <Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
        ) : null}
        {isDelayed ? <DelayMessage /> : null}
      </div>
    );
  }
);
