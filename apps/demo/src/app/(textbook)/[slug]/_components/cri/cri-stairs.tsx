"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { CardFooter } from "@itell/ui/card";
import { Label } from "@itell/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/popover";
import { StatusButton } from "@itell/ui/status-button";
import { TextArea } from "@itell/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { Flame, KeyRoundIcon, PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useServerAction } from "zsa-react";

import { createCRIAnswerAction, updateCRIStreakAction } from "@/actions/cri";
import {
  useCRIStore,
  usePageStatus,
  useSession,
} from "@/components/provider/page-provider";
import { Confetti } from "@/components/ui/confetti";
import { apiClient } from "@/lib/api-client";
import { Condition, isProduction } from "@/lib/constants";
import { SelectShouldBlur } from "@/lib/store/cri-store";
import { insertNewline, reportSentry } from "@/lib/utils";
import { ExplainCRIButton } from "./cri-explain-button";
import { CRIFeedback } from "./cri-feedback";
import { CRIContent, CRIHeader, CRIShell } from "./cri-shell";
import { FinishCRIButton } from "./finish-cri-button";
import { borderColors, QuestionScore, StatusStairs } from "./types";

type Props = {
  question: string;
  answer: string;
  chunkSlug: string;
  pageSlug: string;
};

type State = {
  status: StatusStairs;
  error: string | null;
  input: string;
};

export function CRIStairs({ question, answer, chunkSlug, pageSlug }: Props) {
  const { user } = useSession();
  const pageStatus = usePageStatus();
  const store = useCRIStore();
  const shouldBlur = useSelector(store, SelectShouldBlur);
  const form = useRef<HTMLFormElement>(null);
  const {
    execute: updateStreak,
    data: _streak,
    setOptimistic: setStreak,
  } = useServerAction(updateCRIStreakAction);
  const streak =
    _streak === undefined ? (user?.personalization.cri_streak ?? 0) : _streak;

  const [collapsed, setCollapsed] = useState(!shouldBlur);
  const [state, setState] = useState<State>({
    status: StatusStairs.UNANSWERED,
    error: null,
    input: "",
  });

  const {
    action: onSubmit,
    isPending: _isPending,
    error,
  } = useActionStatus(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = String(formData.get("input")).trim();

    if (input.length === 0) {
      setState((state) => ({ ...state, error: "Answer cannot be empty" }));
      return;
    }

    if (input === state.input) {
      setState((state) => ({
        ...state,
        error: "Please submit a different answer",
      }));
      return;
    }

    const res = await apiClient.api.cri.$post({
      json: {
        page_slug: pageSlug,
        chunk_slug: chunkSlug,
        answer: input,
      },
    });
    if (!res.ok) {
      const { details, error } = await res.json();
      throw new Error(error, { cause: details });
    }
    const response = await res.json();
    const score = response.score as QuestionScore;
    createCRIAnswerAction({
      text: input,
      chunkSlug,
      pageSlug,
      score,
      condition: Condition.STAIRS,
    });

    // if answer is correct, mark chunk as finished
    // this will add the chunk to the list of finished chunks that gets excluded from stairs question
    if (score === 2) {
      store.trigger.finishChunk({ chunkSlug, passed: true });

      setState({
        status: StatusStairs.BOTH_CORRECT,
        error: null,
        input,
      });
      setStreak((streak) => (streak ? streak + 1 : 1));
      updateStreak({ isCorrect: true });
    }

    if (score === 1) {
      setState({
        status: StatusStairs.SEMI_CORRECT,
        error: null,
        input,
      });
    }

    if (score === 0) {
      setState({
        status: StatusStairs.BOTH_INCORRECT,
        error: null,
        input,
      });
      setStreak(0);
      updateStreak({ isCorrect: false });
    }
  });

  const isPending = useDebounce(_isPending, 100);

  const status = state.status;
  const isNextButtonDisplayed =
    shouldBlur && status !== StatusStairs.UNANSWERED;

  const borderColor = borderColors[state.status];

  useEffect(() => {
    if (error) {
      setState((state) => ({
        ...state,
        status: StatusStairs.PASSED,
        error: "Failed to evaluate answer, please try again later",
      }));
      reportSentry("evaluate constructed response", { error: error?.cause });
    }
  }, [error]);

  if (collapsed) {
    return (
      <CRIShell>
        <CRIContent>
          <p className="my-2 text-sm font-light">
            You can skip the following question or click to reveal.
          </p>
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setCollapsed(false);
              }}
            >
              Reveal optional question
            </Button>
          </div>
        </CRIContent>
      </CRIShell>
    );
  }

  return (
    <>
      <Confetti active={status === StatusStairs.BOTH_CORRECT} />

      <CRIShell
        className={cn(borderColor, {
          shake: state.status === StatusStairs.BOTH_INCORRECT,
        })}
      >
        <CRIHeader
          isOptional={!shouldBlur}
          question={question}
          headerRight={
            streak !== undefined && streak >= 2 ? (
              <Tooltip>
                <TooltipTrigger>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Flame color="#b91c1c" className={toClassName(streak)} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You have answered {streak} questions correctly in a row,
                    good job!
                  </p>
                </TooltipContent>
              </Tooltip>
            ) : null
          }
        />

        <CRIContent>
          <div role="status">
            {status === StatusStairs.BOTH_INCORRECT && (
              <p className="text-destructive-foreground text-sm">
                <b>iTELL AI says:</b> You likely got a part of the answer wrong.
                Please try again.
              </p>
            )}

            {status === StatusStairs.SEMI_CORRECT && (
              <p className="text-warning text-sm">
                <b>iTELL AI says:</b> You may have missed something, but you
                were generally close.
              </p>
            )}

            {status === StatusStairs.BOTH_CORRECT ? (
              <p className="text-center text-xl text-emerald-600">
                Your answer is correct!
              </p>
            ) : null}
          </div>

          <h3 id="form-question-heading" className="sr-only">
            Answer the question
          </h3>

          <div className="flex items-center gap-2">
            {(status === StatusStairs.SEMI_CORRECT ||
              status === StatusStairs.BOTH_INCORRECT) && (
              <ExplainCRIButton
                chunkSlug={chunkSlug}
                pageSlug={pageSlug}
                input={state.input}
              />
            )}
            {(status !== StatusStairs.UNANSWERED || pageStatus.unlocked) && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="secondary" type="button" className="gap-2">
                    <KeyRoundIcon className="size-4" />
                    Reveal Answer
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="no-select w-80 leading-relaxed"
                  side="right"
                  sideOffset={12}
                >
                  {answer}
                </PopoverContent>
              </Popover>
            )}
          </div>

          <form
            ref={form}
            aria-labelledby="form-question-heading"
            onSubmit={onSubmit}
            className="flex flex-col gap-4"
          >
            <Label className="font-normal">
              <span className="sr-only">your answer</span>
              <TextArea
                name="input"
                rows={3}
                className="rounded-md p-4 shadow-md xl:text-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.shiftKey) {
                    e.preventDefault();
                    insertNewline(e.currentTarget);
                    return;
                  }

                  if (e.key === "Enter") {
                    e.preventDefault();
                    form.current?.requestSubmit();
                  }
                }}
                onPaste={(e) => {
                  if (isProduction) {
                    e.preventDefault();
                    toast.warning(
                      "Copy & Paste is disallowed, please answer with your own words."
                    );
                  }
                }}
              />
            </Label>

            <div className="flex flex-col items-center gap-2 sm:flex-row">
              {status === StatusStairs.BOTH_CORRECT && isNextButtonDisplayed ? (
                // when answer is both correct and next button should be displayed
                <FinishCRIButton
                  chunkSlug={chunkSlug}
                  pageSlug={pageSlug}
                  condition={Condition.STAIRS}
                />
              ) : (
                // when answer is not both correct
                <>
                  {status !== StatusStairs.BOTH_CORRECT && (
                    <StatusButton
                      pending={isPending}
                      type="submit"
                      disabled={_isPending}
                      className="min-w-40"
                      variant={
                        status === StatusStairs.UNANSWERED
                          ? "default"
                          : "secondary"
                      }
                    >
                      <span className="flex items-center gap-2">
                        <PencilIcon className="size-4" />
                        Answer
                      </span>
                    </StatusButton>
                  )}

                  {status !== StatusStairs.UNANSWERED &&
                  isNextButtonDisplayed ? (
                    <FinishCRIButton
                      chunkSlug={chunkSlug}
                      pageSlug={pageSlug}
                      condition={Condition.STAIRS}
                    />
                  ) : null}
                </>
              )}
            </div>
            {state.error && <Errorbox>{state.error}</Errorbox>}
          </form>
        </CRIContent>

        <CardFooter className="text-muted-foreground flex-col items-start gap-2 text-sm">
          <p className="m-0">
            Answer the question above the continue reading. iTELL evaluation is
            based on AI and may not always be accurate.{" "}
            <CRIFeedback pageSlug={pageSlug} chunkSlug={chunkSlug} />
          </p>
        </CardFooter>
      </CRIShell>
    </>
  );
}

function streakToSize(streakCount: number) {
  return 4 + (7 * streakCount) / (8 + streakCount);
}

function toClassName(streakCount: number) {
  const classString = `size-[${streakToSize(streakCount).toString()}]`;
  if (streakCount < 2) {
    return "";
  } else if (streakCount < 5) {
    return `${classString} motion-safe:animate-bounce`;
  } else if (streakCount < 7) {
    return `${classString} motion-safe:animate-pulse`;
  }
  return `${classString} motion-safe:animate-ping`;
}
