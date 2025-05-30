import { Button } from "@itell/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { EyeIcon, LockIcon, UnlockIcon } from "lucide-react";

import { PageStatus } from "@/lib/page-status";

type Props = {
  status: PageStatus;
};

export function PageStatusInfo({ status }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button className="px-1.5 text-sm" variant="ghost" size={"sm"}>
          {status.unlocked ? (
            <>
              <UnlockIcon className="mr-1 inline size-4" />
              Unlocked
            </>
          ) : status.latest ? (
            <>
              <EyeIcon className="mr-1 inline size-4" />
              In progress
            </>
          ) : (
            <>
              <LockIcon className="mr-1 inline size-4" />
              Locked
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="w-48 text-sm" side="bottom" sideOffset={12}>
        {status.latest
          ? "Answer questions and summarize this chapter to move forward"
          : status.unlocked
            ? "You have completed this page. You can now view all its content"
            : "You haven't got access to this page yet"}
      </TooltipContent>
    </Tooltip>
  );
}
