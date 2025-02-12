"use client";

import { useEffect, useRef } from "react";
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
import { driver } from "@itell/driver.js";
import { Alert, AlertTitle } from "@itell/ui/alert";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { type User } from "lucia";
import { FileQuestionIcon, InfoIcon, SendHorizontalIcon } from "lucide-react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createSummaryAction, getStairsHistory } from "@/actions/summary";
import { DelayMessage } from "@/components/delay-message";
import {
  useChatStore,
  useCRIStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { rocketBlast } from "@/lib/animations";
import { apiClient } from "@/lib/api-client";
import { Condition } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage, PageData } from "@/lib/pages";
import { getHistory, SelectStairsAnswered } from "@/lib/store/chat-store";
import { getExcludedChunks, SelectSummaryReady } from "@/lib/store/cri-store";
import {
  SelectError,
  SelectIsNextPageVisible,
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
import { NextPageButton } from "./summary-next-page-button";
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

  // states
  const isSummaryReady = useSelector(criStore, SelectSummaryReady);
  const response = useSelector(summaryStore, SelectResponse);
  const prevInput = useSelector(summaryStore, SelectPrevInput);
  const isNextPageVisible = useSelector(summaryStore, SelectIsNextPageVisible);
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
      summaryStore.send({ type: "submit" });
      addStage("Scoring");

      const formData = new FormData(e.currentTarget);
      const input = String(formData.get("input")).trim();

      saveSummaryLocal(pageSlug, input);
      const error = validateSummary(input, prevInput);

      if (error) {
        summaryStore.send({ type: "fail", error });
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
              summaryStore.send({ type: "scored", response: parsed.data });
              finishStage("Scoring");
            } else {
              clearStages();
              summaryStore.send({ type: "fail", error: ErrorType.INTERNAL });
              // summaryResponse parsing failed, return early
              reportSentry(
                "first chunk of stairs summary response in wrong shape",
                {
                  body: requestBody,
                  chunk: data,
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
            chatStore.send({ type: "setStairsQuestion", data: stairsData });
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
            containmentScore: response.metrics.containment?.score ?? -1,
            similarityScore: response.metrics.similarity?.score ?? -1,
            contentScore: response.metrics.content?.score,
            contentThreshold: response.metrics.content?.threshold,
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

        summaryStore.send({
          type: "finishPage",
          isNextPageVisible: data.canProceed ? !isLast : undefined,
          input,
        });

        if (stairsDataRef.current) {
          summaryStore.send({
            type: "stairs",
            data: stairsDataRef.current,
          });

          if (!data.canProceed) {
            goToQuestion(stairsDataRef.current);
          }
        }
      }
    },
    { delayTimeout: 20000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (isNextPageVisible && summaryResponseRef.current) {
      if (isLast) {
        toast.info("You have finished the entire textbook!");
      } else {
        const title = summaryResponseRef.current.is_passed
          ? "Good job summarizing 🎉"
          : "You can now move on 👏";
        toast(title, {
          className: "toast",
          description: "Move to the next page to continue reading",
          duration: 5000,
          action: page.next_slug
            ? {
                label: "Next",
                onClick: () => {
                  router.push(makePageHref(page.next_slug));
                },
              }
            : undefined,
        });
      }
    }
  }, [isLast, isNextPageVisible, page, router]);

  const { portals } = useDriver(driverObj, {
    pageSlug,
    condition: Condition.STAIRS,
    stairsData: stairsDataRef,
    summaryResponse: summaryResponseRef,
    stairsAnswered: stairsAnsweredRef,
    exitButton: FinishReadingButton,
  });

  useEffect(() => {
    if (error) {
      summaryStore.send({ type: "fail", error: ErrorType.INTERNAL });
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
            needRevision={isLast ? !user.finished : !isNextPageVisible}
          />
        ) : null}

        <div className="flex items-center gap-2">
          {isNextPageVisible && page.next_slug ? (
            <div className="flex flex-col gap-2">
              <Alert variant={"success"}>
                <InfoIcon className="size-4" />
                <AlertTitle>
                  You have finished this page and can move on. You are still
                  welcome to improve the summary.
                </AlertTitle>
              </Alert>
              <div className="flex items-center gap-2">
                <NextPageButton pageSlug={page.next_slug} />
                {stairsQuestion ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      goToQuestion(stairsQuestion);
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <FileQuestionIcon className="size-4" />
                      Reflection
                    </span>
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <Confetti active={response?.is_passed ?? false} />
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
            disabled={!isSummaryReady}
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
              disabled={isPending || !isSummaryReady}
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
        }}
      >
        Return to summary
      </Button>
    </div>
  );
}

const driverObj = driver();

const goToQuestion = (question: StairsQuestion) => {
  const el = getChunkElement(question.chunk, "data-chunk-slug");
  if (el) {
    driverObj.highlight({
      element: el,
      popover: {
        description: "",
      },
    });
    setTimeout(() => {
      scrollToElement(el);
    }, 100);
  } else {
    toast.warning(
      "Please revise your summary with substantial changes and resubmit to unlock the next page"
    );
  }
};
