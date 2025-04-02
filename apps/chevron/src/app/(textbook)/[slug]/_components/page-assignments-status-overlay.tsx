"use client";

import { Alert, AlertTitle } from "@itell/ui/alert";
import { useSelector } from "@xstate/store/react";
import { InfoIcon } from "lucide-react";

import { useCRIStore } from "@/components/provider/page-provider";
import { SelectSummaryReady } from "@/lib/store/cri-store";

export function PageAssignmentsStatusOverlay() {
  const criStore = useCRIStore();
  const isSummaryReady = useSelector(criStore, SelectSummaryReady);
  return (
    !isSummaryReady && (
      <div
        className="bg-background/80 animate-in animate-out absolute top-0 right-0 bottom-0 left-0
          z-10 mt-4 mb-0 flex cursor-not-allowed justify-center gap-2 backdrop-blur-sm
          transition-all duration-100"
      >
        <Alert variant="warning" className="h-fit rounded-t-md">
          <InfoIcon className="size-4" />
          <AlertTitle>
            Unlock this assignment after finishing the entire page and click the
            &quot;Unlock assignments&quot; button
          </AlertTitle>
        </Alert>
      </div>
    )
  );
}
