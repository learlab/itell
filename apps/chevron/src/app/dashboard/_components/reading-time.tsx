import Link from "next/link";
import { getReadingTimeChartData, PrevDaysLookup } from "@itell/core/dashboard";
import { Button } from "@itell/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import { Skeleton } from "@itell/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { getDatesBetween } from "@itell/utils";
import { InfoIcon } from "lucide-react";
import pluralize from "pluralize";

import { CreateErrorFallback } from "@/components/error-fallback";
import { getReadingTime } from "@/db/dashboard";
import { routes } from "@/lib/navigation";
import { ReadingTimeChart } from "./reading-time-chart";
import { ReadingTimeControl } from "./reading-time-control";
import type { ReadingTimeChartParams } from "@itell/core/dashboard";

type Props = {
  userId: string;
  params: ReadingTimeChartParams;
  name?: string;
};

export async function ReadingTime({ userId, params, name }: Props) {
  const startDate = subDays(new Date(), PrevDaysLookup[params.level]);
  const intervalDates = getDatesBetween(startDate, new Date());

  const { readingTimeGrouped, summaryCount } = await getReadingTime({
    userId,
    startDate,
    intervalDates,
  });

  const { totalViewTime, chartData } = getReadingTimeChartData(
    readingTimeGrouped,
    intervalDates,
    params
  );
  return (
    <Card className="has-[[data-pending]]:animate-pulse">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="lg"
                  className="flex items-center gap-1 pl-0 text-lg xl:text-xl"
                >
                  Total Reading Time
                  <InfoIcon className="ml-1 size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Measures how long a user has stayed in all textbook pages, in
                  minutes
                </p>
              </TooltipContent>
            </Tooltip>
            <ReadingTimeControl />
          </div>
        </CardTitle>
        <CardDescription>
          {name ? name : "You"} spent {Math.round(totalViewTime / 60)} minutes
          reading the textbook, wrote{" "}
          <Link
            className="font-semibold underline"
            href={routes.dashboardSummaries()}
          >
            {pluralize("summary", summaryCount, true)}
          </Link>{" "}
          during {startDate.toLocaleDateString()} -{" "}
          {new Date().toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pl-2">
        <ReadingTimeChart data={chartData} />
      </CardContent>
    </Card>
  );
}

ReadingTime.Skeleton = function ReadingTimeSkeleton() {
  return <Skeleton className="h-[350px] w-full" />;
};
ReadingTime.ErrorFallback = CreateErrorFallback(
  "Failed to calculate total reading time"
);

const subDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(date.getDate() - days);
  return result;
};
