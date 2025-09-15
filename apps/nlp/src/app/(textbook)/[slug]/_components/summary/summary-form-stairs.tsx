"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Elements } from "@itell/constants";
import {
  useDebounce,
  useKeystroke,
  useScreenIssue,
  useTimer,
} from "@itell/core/hooks";
import { PortalContainer } from "@itell/core/portal-container";
import {
  ErrorFeedback,
  ErrorType,
  SummaryResponseSchema,
  validateSummary,
} from "@itell/core/summary";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { cn, getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { type User } from "lucia";
import { FileQuestionIcon, SendHorizontalIcon } from "lucide-react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createSummaryAction, getStairsHistory } from "@/actions/summary";
import { DelayMessage } from "@/components/delay-message";
import {
  useChatStore,
  useCRIStore,
  usePageStatus,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { rocketBlast } from "@/lib/animations";
import { apiClient } from "@/lib/api-client";
import { Condition } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage, PageData } from "@/lib/pages";
import { getHistory, SelectStairsAnswered } from "@/lib/store/chat-store";
import {
  getExcludedChunks,
  SelectAssignmentReady,
} from "@/lib/store/cri-store";
import {
  SelectError,
  SelectPrevInput,
  SelectResponse,
  SelectStairs,
} from "@/lib/store/summary-store";
import { makePageHref, reportSentry, scrollToElement } from "@/lib/utils";
import { SummaryResponseFeedback } from "./summary-feedback";
import {
  getSummaryLocal,
  saveSummaryLocal,
  SummaryInput,
} from "./summary-input";
import useDriver from "./use-driver";
import type { StairsQuestion } from "@/lib/store/summary-store";
import type { SummaryResponse } from "@itell/core/summary";

interface Props {
  user: User;
  page: PageData;
  pageStatus: PageStatus;
  afterSubmit?: React.ReactNode;
}

type ApiRequest = Parameters<
  typeof apiClient.api.summary.stairs.$post
>[0]["json"];

export function SummaryFormStairs({ user, page, afterSubmit }: Props) {
  const pageSlug = page.slug;
  const isLast = isLastPage(page);
  const router = useRouter();
  const { addStage, clearStages, finishStage, stages } = useSummaryStage();

  // for debugging
  const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
  const requestBodyRef = useRef<ApiRequest | null>(null);
  const summaryResponseRef = useRef<SummaryResponse | null>(null);
  const stairsDataRef = useRef<StairsQuestion | null>(null);
  const stairsAnsweredRef = useRef(false);
  const screenIssue = useScreenIssue();

  // stores
  const chatStore = useChatStore();
  const criStore = useCRIStore();
  const summaryStore = useSummaryStore();
  const pageStatus = usePageStatus();

  // states
  const isAssignmentReady = useSelector(criStore, SelectAssignmentReady);
  const response = useSelector(summaryStore, SelectResponse);
  const prevInput = useSelector(summaryStore, SelectPrevInput);
  const stairsQuestion = useSelector(summaryStore, SelectStairs);
  const submissionError = useSelector(summaryStore, SelectError);

  const {
    action,
    isPending: _isPending,
    isDelayed,
    error,
  } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      clearStages();
      summaryStore.trigger.submit();
      addStage("Scoring");

      const formData = new FormData(e.currentTarget);
      const input = String(formData.get("input")).trim();

      saveSummaryLocal(pageSlug, input);
      const error = validateSummary(input, prevInput);

      if (error) {
        summaryStore.trigger.fail({ error });
        return;
      }

      const [data, err] = await getStairsHistory({ pageSlug });
      if (err) {
        throw new Error("get stairs history", { cause: err });
      }
      const requestBody: ApiRequest = {
        summary: input,
        page_slug: pageSlug,
        focus_time: data.focusTimes?.data,
        chat_history: getHistory(chatStore),
        excluded_chunks: getExcludedChunks(criStore),
        score_history: data.contentScoreHistory,
        class_id: user.classId ?? undefined,
      };
      requestBodyRef.current = requestBody;
      const response = await apiClient.api.summary.stairs.$post({
        json: requestBody,
      });

      if (response.ok && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let chunkIndex = 0;
        let stairsChunk: string | null = null;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          const chunk = decoder.decode(value, { stream: true });
          if (chunkIndex === 0) {
            const data = chunk
              .trim()
              .split("\n")
              .at(1)
              ?.replace(/data:\s+/, "");

            console.log("summary response chunk", data, chunk);

            const parsed = SummaryResponseSchema.safeParse(
              JSON.parse(String(data))
            );
            if (parsed.success) {
              summaryResponseRef.current = parsed.data;
              summaryStore.trigger.scored({ response: parsed.data });
              finishStage("Scoring");
            } else {
              clearStages();
              summaryStore.trigger.fail({ error: ErrorType.INTERNAL });
              // summaryResponse parsing failed, return early
              reportSentry(
                "first chunk of stairs summary response in wrong shape",
                {
                  body: requestBody,
                  chunk: data,
                  error: parsed.error,
                }
              );
              return;
            }
          } else {
            if (summaryResponseRef.current?.is_passed) {
              // if the summary passed, we don't need to process later chunks
              // note that if the user pass by summary amount
              // question will still be generated but will not be asked
              // they can still see the "question" button
              break;
            }

            if (chunkIndex === 1) {
              addStage("Analyzing");
            }
            if (chunk) {
              stairsChunk = chunk;
            }
          }

          chunkIndex++;
        }

        if (stairsChunk) {
          const regex = /data: ({"request_id":.*?})\n*/;
          const match = regex.exec(stairsChunk.trim());
          if (match?.[1]) {
            const stairsString = match[1];
            const stairsData = JSON.parse(stairsString) as StairsQuestion;
            stairsDataRef.current = stairsData;
            finishStage("Analyzing");
            chatStore.trigger.setStairsQuestion({ data: stairsData });
          } else {
            throw new Error("invalid stairs chunk", { cause: stairsChunk });
          }
        }
      } else {
        throw new Error("fetch score summary stairs", {
          cause: await response.text(),
        });
      }

      if (summaryResponseRef.current) {
        const response = summaryResponseRef.current;
        addStage("Saving");

        const [data, err] = await createSummaryAction({
          summary: {
            text: input,
            pageSlug,
            condition: Condition.STAIRS,
            isPassed: response.is_passed ?? false,
            containmentScore: Number(response.metrics.containment?.score) ?? -1,
            similarityScore: Number(response.metrics.similarity?.score) ?? -1,
            contentScore: Number(response.metrics.content?.score),
            contentThreshold: response.metrics.content?.threshold as number,
          },
          keystroke: {
            start: prevInput ?? getSummaryLocal(pageSlug) ?? "",
            data: keystrokes,
            isMobile: screenIssue ? false : screenIssue === "mobile",
          },
        });
        if (err) {
          throw new Error("create summary action", { cause: err });
        }

        clearKeystroke();
        finishStage("Saving");

        if (data.isExcellent) {
          const blastYPos = window.innerHeight - 10;
          rocketBlast(blastYPos);
        }

        summaryStore.trigger.finishPage({
          input,
        });

        if (stairsDataRef.current) {
          summaryStore.trigger.stairs({ data: stairsDataRef.current });

          if (!data.canProceed) {
            const chunk = getChunkElement(stairsDataRef.current.chunk);
            if (chunk) {
              highlight(chunk);
            }
          }
        }
      }
    },
    { delayTimeout: 20000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (pageStatus.unlocked && summaryResponseRef.current) {
      if (isLast) {
        toast.info("You have finished the entire textbook!");
      } else {
        const title = summaryResponseRef.current.is_passed
          ? "Good job summarizing 🎉"
          : "You can continue to the next page 👏";
        toast.success(title, {
          description: () =>
            page.next_slug ? (
              <Link
                href={makePageHref(page.next_slug)}
                className={cn(
                  "flex items-center gap-1 font-semibold underline underline-offset-4"
                )}
              >
                Next Page
              </Link>
            ) : undefined,
        });
      }
    }
  }, [isLast, page, router, pageStatus]);

  const { portals, highlight } = useDriver({
    pageSlug,
    condition: Condition.STAIRS,
    stairsData: stairsDataRef,
    summaryResponse: summaryResponseRef,
    stairsAnswered: stairsAnsweredRef,
    exitButton: FinishReadingButton,
  });

  useEffect(() => {
    if (error) {
      summaryStore.trigger.fail({ error: ErrorType.INTERNAL });
      clearStages();
      reportSentry("score summary stairs", {
        requestBody: requestBodyRef.current,
        summaryResponse: summaryResponseRef.current,
        stairsData: stairsDataRef.current,
        error: error.cause,
      });
    }
  }, [error, clearStages, summaryStore]);

  return (
    <>
      <PortalContainer portals={portals} />
      <div className="flex flex-col gap-2" id={Elements.SUMMARY_FORM}>
        {response ? (
          <SummaryResponseFeedback
            className={isPending ? "opacity-70" : ""}
            response={response}
            needRevision={isLast ? !user.finished : !pageStatus.unlocked}
          />
        ) : null}

        <div className="flex items-center gap-2">
          {stairsQuestion ? (
            <Button
              variant="outline"
              onClick={() => {
                const chunk = getChunkElement(stairsQuestion.chunk);
                if (chunk) {
                  highlight(chunk);
                }
              }}
            >
              <span className="flex items-center gap-2">
                <FileQuestionIcon className="size-4" />
                Reflection
              </span>
            </Button>
          ) : null}
          <Confetti active={response?.is_passed ?? false} />
        </div>
        <h2 id="summary-form-heading" className="sr-only">
          submit summary
        </h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={action}
          aria-labelledby="summary-form-heading"
        >
          {submissionError ? (
            <Errorbox title={ErrorFeedback[submissionError]} />
          ) : null}
          {isDelayed ? <DelayMessage /> : null}

          <SummaryInput
            pageSlug={pageSlug}
            pending={isPending}
            stages={stages}
            isAdmin={user.isAdmin}
            enableSimilarity
            prevInput={prevInput}
            ref={ref}
          />

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={isPending || !isAssignmentReady}
              pending={isPending}
              className="w-40"
            >
              <span className="inline-flex items-center gap-2">
                <SendHorizontalIcon className="size-3" />
                Submit
              </span>
            </Button>

            {afterSubmit}
          </div>
        </form>
      </div>
    </>
  );
}

function FinishReadingButton({ onClick }: { onClick: (_: number) => void }) {
  const store = useChatStore();
  const stairsAnswered = useSelector(store, SelectStairsAnswered);
  const { time, clearTimer } = useTimer();

  return (
    <div className="mt-4 flex justify-end">
      <Button
        size="sm"
        disabled={!stairsAnswered}
        id={Elements.STAIRS_RETURN_BUTTON}
        onClick={() => {
          onClick(time);
          clearTimer();
          scrollToElement(
            document.getElementById(Elements.PAGE_ASSIGNMENTS) as HTMLElement
          );
        }}
      >
        Return to summary
      </Button>
    </div>
  );
}
