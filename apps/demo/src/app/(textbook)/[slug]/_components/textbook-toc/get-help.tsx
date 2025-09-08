import Link from "next/link";
import { buttonVariants } from "@itell/ui/button";
import { cn } from "@itell/utils";
import { HelpCircleIcon } from "lucide-react";

import { routes } from "@/lib/navigation";

export function GetHelp() {
  return (
    <Link
      href={routes.guide()}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex w-full items-center justify-start p-2 xl:text-lg"
      )}
    >
      <span className="flex w-full items-center justify-start gap-2 py-2 xl:gap-4">
        <HelpCircleIcon className="size-4 xl:size-6" />
        Help
      </span>
    </Link>
  );
}
