"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { StatusButton } from "@itell/ui/status-button";
import { TextArea } from "@itell/ui/textarea";
import { useSelector } from "@xstate/store/react";
import { PencilIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createCRIAnswerAction } from "@/actions/cri";
import { InternalError } from "@/components/internal-error";
import { useCRIStore, useSession } from "@/components/provider/page-provider";
import { apiClient } from "@/lib/api-client";
import { Condition, isProduction } from "@/lib/constants";
import { SelectShouldBlur } from "@/lib/store/cri-store";
import { insertNewline, reportSentry } from "@/lib/utils";
import { CRIContent, CRIHeader, CRIShell } from "./cri-shell";
import { FinishCRIButton } from "./finish-cri-button";
import { StatusReread } from "./types";
import type { QuestionScore } from "./types";

type Props = {
  question: string;
  answer: string;
  chunkSlug: string;
  pageSlug: string;
};

type State = {
  status: StatusReread;
  show: boolean;
  error: string | null;
};

export function CRIReread({ question, chunkSlug, pageSlug }: Props) {
  const { user } = useSession();
  const store = useCRIStore();
  const shouldBlur = useSelector(store, SelectShouldBlur);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, setState] = useState<State>({
    error: null,
    status: StatusReread.UNANSWERED,
    show: shouldBlur,
  });

  const {
    action: onSubmit,
    isPending: _isPending,
    error,
  } = useActionStatus(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState((prevState) => ({ ...prevState, error: null }));
    const formData = new FormData(e.currentTarget);
    const input = String(formData.get("input")).trim();
    if (input.length === 0) {
      setState((state) => ({ ...state, error: "Answer cannot be empty" }));
      return;
    }

    const response = await apiClient.api.cri.$post({
      json: {
        answer: input,
        chunk_slug: chunkSlug,
        page_slug: pageSlug,
      },
    });
    if (!response.ok) {
      const { error, details } = await response.json();
      throw new Error(error, { cause: details });
    }

    const data = await response.json();
    const score = data.score as QuestionScore;

    store.trigger.finishChunk({ chunkSlug, passed: false });

    setState((state) => ({
      ...state,
      error: null,
      status: StatusReread.ANSWERED,
    }));

    createCRIAnswerAction({
      text: input,
      condition: Condition.RANDOM_REREAD,
      chunkSlug,
      pageSlug,
      score: score.toString(),
    });
  });
  const isPending = useDebounce(_isPending, 100);

  const isNextButtonDisplayed =
    shouldBlur && state.status === StatusReread.ANSWERED;

  useEffect(() => {
    if (error) {
      setState((state) => ({
        ...state,
        error: "Failed to evaluate answer, please try again later",
      }));
      reportSentry("evaluate constructed response", { error: error?.cause });
    }
  }, [error]);

  if (!state.show) {
    return (
      <CRIShell>
        <CRIContent>
          <p className="my-2 text-[0.9em] font-light">
            You can skip the following question or click to reveal.
          </p>
          <div>
            <Button
              variant="outline"
              onClick={() => {
                setState((state) => ({ ...state, show: true }));
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
    <CRIShell>
      <CRIHeader isOptional={!shouldBlur} question={question} />
      <CRIContent>
        <div role="status">
          {state.status === StatusReread.ANSWERED && (
            <p className="text-muted-foreground text-sm">
              Thanks for completing this question. You can move on to the next
              section or refine your answer.
            </p>
          )}
        </div>

        <h2 id="form-question-heading" className="sr-only">
          Answer the question
        </h2>
        <form
          ref={formRef}
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
              onPaste={(e) => {
                if (isProduction && !user?.isAdmin) {
                  e.preventDefault();
                  toast.warning(
                    "Copy & Paste is disallowed, please answer with your own words."
                  );
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.shiftKey) {
                  e.preventDefault();
                  insertNewline(e.currentTarget);
                  return;
                }

                if (e.key === "Enter") {
                  e.preventDefault();
                  formRef.current?.requestSubmit();
                }
              }}
            />
          </Label>

          {state.error ? (
            <InternalError>
              <p>{state.error}</p>
            </InternalError>
          ) : null}

          <div className="flex flex-col items-center gap-2 sm:flex-row">
            {state.status === StatusReread.UNANSWERED ? (
              <StatusButton
                pending={isPending}
                type="submit"
                disabled={_isPending}
                variant={
                  state.status === StatusReread.UNANSWERED
                    ? "default"
                    : "secondary"
                }
                className="w-40"
              >
                <span className="flex items-center gap-2">
                  <PencilIcon className="size-4" />
                  Answer
                </span>
              </StatusButton>
            ) : null}

            {state.status !== StatusReread.UNANSWERED &&
            isNextButtonDisplayed ? (
              <FinishCRIButton
                pageSlug={pageSlug}
                chunkSlug={chunkSlug}
                condition={Condition.RANDOM_REREAD}
              />
            ) : null}
          </div>
        </form>
      </CRIContent>
    </CRIShell>
  );
}
