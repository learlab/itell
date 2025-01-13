"use client";

import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";

import { createEventAction } from "@/actions/event";
import { useChunks, useCRIStore } from "@/components/provider/page-provider";
import { Condition, EventType } from "@/lib/constants";
import { SelectCurrentChunk, SelectSummaryReady } from "@/lib/store/cri-store";
import { CRIContent, CRIShell } from "./cri-shell";

type Props = {
  question: string;
  answer: string;
  pageSlug: string;
  chunkSlug: string;
};

export function CRISimple({ question, answer, pageSlug, chunkSlug }: Props) {
  const store = useCRIStore();
  const currentChunk = useSelector(store, SelectCurrentChunk);
  const isSummaryReady = useSelector(store, SelectSummaryReady);
  const disabled = isSummaryReady || currentChunk !== chunkSlug;
  const chunks = useChunks();
  const isLastQuestion = chunkSlug === chunks[chunks.length - 1];

  return (
    <CRIShell>
      <CRIContent className="prose-p:my-2">
        <p className="text-muted-foreground">
          Below is a question related to the content you just read. When you
          finished reading its answer, click the finish button below to move on.
        </p>
        <p>
          <span className="font-bold">Question: </span>
          {question}
        </p>
        <p>
          <span className="font-bold">Answer: </span>
          {answer}
        </p>

        <h2 id="question-form-heading" className="sr-only">
          Finish reading
        </h2>
        <form
          aria-labelledby="question-form-heading"
          onSubmit={(e) => {
            e.preventDefault();
            if (isLastQuestion) {
              store.send({ type: "finishPage" });
            } else {
              store.send({ type: "advanceChunk", chunkSlug });
            }
            createEventAction({
              type: EventType.CHUNK_REVEAL_QUESTION,
              pageSlug,
              data: {
                chunkSlug,
                condition: Condition.SIMPLE,
              },
            });
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <Button
              type="submit"
              variant="outline"
              disabled={disabled}
              className="w-40"
            >
              Continue
            </Button>
          </div>
        </form>
      </CRIContent>
    </CRIShell>
  );
}
