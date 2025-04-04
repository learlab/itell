"use client";

import { Button } from "@itell/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { useSelector } from "@xstate/store/react";
import { KeyIcon } from "lucide-react";

import { createEventAction } from "@/actions/event";
import { useCRIStore } from "@/components/provider/page-provider";
import { EventType } from "@/lib/constants";
import { SelectSummaryReady } from "@/lib/store/cri-store";

export function UnlockAssignmentsButton({
  pageSlug,
  chunkSlug,
  condition,
}: {
  pageSlug: string;
  chunkSlug: string;
  condition: string;
}) {
  const store = useCRIStore();
  const isSummaryReady = useSelector(store, SelectSummaryReady);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={isSummaryReady}
          size={"lg"}
          onClick={() => {
            store.trigger.finishPage();

            createEventAction({
              pageSlug,
              type: EventType.CHUNK_REVEAL,
              data: {
                chunkSlug,
                condition,
              },
            });
          }}
        >
          <KeyIcon className="mr-2 size-4" />
          <span>Unlock assignments</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Start working on assessment items for this page, after you finish them,
        you will gain access to the next page.
      </TooltipContent>
    </Tooltip>
  );
}
