import { Elements } from "@itell/constants";
import { Badge } from "@itell/ui/badge";
import { buttonVariants } from "@itell/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@itell/ui/popover";
import { cn } from "@itell/utils";
import { PencilIcon } from "lucide-react";

import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";
import { AdminTools } from "../admin-tools";
import { GetHelp } from "./get-help";
import { ResetPage } from "./reset-page";

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  text: string;
  href: string;
  icon: React.ReactNode;
}

function AnchorLink({ text, href, icon, className, ...rest }: LinkProps) {
  return (
    <a
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex items-center justify-start p-2 xl:text-lg",
        className
      )}
      {...rest}
    >
      <span className="flex items-center gap-2 xl:gap-4">
        {icon}
        {text}
      </span>
    </a>
  );
}

export async function PageControl({
  assignment,
  pageSlug,
}: {
  assignment: boolean;
  pageSlug: string;
}) {
  const { user } = await getSession();
  return (
    <div className="mt-12 space-y-2">
      {user?.isAdmin && (
        <PageConditionBadge
          condition={user?.conditionAssignments[pageSlug] as string}
        />
      )}
      {user?.isAdmin ? <AdminTools user={user} pageSlug={pageSlug} /> : null}
      {assignment ? (
        <AnchorLink
          icon={<PencilIcon className="size-4 xl:size-6" />}
          text="Assignment"
          href={`#${Elements.PAGE_ASSIGNMENTS}`}
          aria-label="assignments for this page"
        />
      ) : null}
      <ResetPage pageSlug={pageSlug} />
      <GetHelp />
    </div>
  );
}

function PageConditionBadge({ condition }: { condition: string }) {
  return (
    <Popover>
      <PopoverTrigger>
        <Badge className="text-base xl:text-lg">{condition}</Badge>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        side="right"
        sideOffset={12}
        className="prose prose-sm dark:prose-invert"
      >
        <p>
          Current page is in <span className="font-medium">{condition}</span>{" "}
          condition.
        </p>
        {condition === Condition.STAIRS && (
          <ul>
            <li>CRI with AI feedback and explain button</li>
            <li>
              Summary with AI feedback, can pass with a sucessful summary or at
              least two summaries with non-null content score
            </li>
          </ul>
        )}
        {condition === Condition.RANDOM_REREAD && (
          <ul>
            <li>No feedback for CRI and summary</li>
            <li>
              Summary will pass with any text, with no limit on length,
              language, etc.
            </li>
          </ul>
        )}

        {condition === Condition.RANDOM_REREAD && (
          <ul>
            <li>No question and summary</li>
            <li>
              Users read short question answers and professional summaries
              directly.
            </li>
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
