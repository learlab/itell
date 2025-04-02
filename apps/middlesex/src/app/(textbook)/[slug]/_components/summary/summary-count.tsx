import Link from "next/link";
import { Skeleton } from "@itell/ui/skeleton";
import pluralize from "pluralize";

import { countSummary } from "@/db/summary";
import { routes } from "@/lib/navigation";

type Props = {
  userId: string;
  pageSlug: string;
};

export async function SummaryCount({ userId, pageSlug }: Props) {
  const { failed, passed } = await countSummary(userId, pageSlug);
  const total = failed + passed;

  return (
    <Link
      className="text-sm text-muted-foreground underline-offset-4 hover:underline xl:text-base"
      href={routes.dashboardSummaries()}
      aria-label="past summary submissions for this page"
    >
      <span>
        {pluralize("summary", total, true)} were written
        {total > 0 ? (
          <span>
            {", "}
            {passed} passed, {failed} failed.
          </span>
        ) : null}
      </span>
    </Link>
  );
}

SummaryCount.Skeleton = function () {
  return <Skeleton className="h-8 w-48" />;
};
