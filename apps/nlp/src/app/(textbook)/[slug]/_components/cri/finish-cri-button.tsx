"use client";

import { Button } from "@itell/ui/button";
import { useSelector } from "@xstate/store/react";
import { ChevronRightIcon } from "lucide-react";

import { createEventAction } from "@/actions/event";
import { useChunks, useCRIStore } from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import {
  SelectAssignmentReady,
  SelectCurrentChunk,
} from "@/lib/store/cri-store";

type Props = {
  chunkSlug: string;
  pageSlug: string;
  condition: string;
};

export function FinishCRIButton({ chunkSlug, pageSlug, condition }: Props) {
  const store = useCRIStore();
  const { finishPage, advanceChunk } = store.trigger;
  const currentChunk = useSelector(store, SelectCurrentChunk);
  const isAssignmentReady = useSelector(store, SelectAssignmentReady);
  const chunks = useChunks();
  const isLastQuestion = chunks[chunks.length - 1] === chunkSlug;

  const text = isLastQuestion ? "Unlock assignment" : "Continue reading";

  const disabled = isAssignmentReady || currentChunk !== chunkSlug;

  return (
    <Button
      disabled={disabled}
      type="button"
      onClick={() => {
        // Use setTimeout to prevent race conditions with state updates
        setTimeout(() => {
          if (isLastQuestion) {
            finishPage();
          } else {
            advanceChunk({ chunkSlug });
          }
          createEventAction({
            pageSlug,
            type: EventType.CHUNK_REVEAL_QUESTION,
            data: {
              chunkSlug,
              condition,
            },
          });
        }, 0);
      }}
    >
      <ChevronRightIcon className="mr-2" />
      {text}
    </Button>
  );
}
