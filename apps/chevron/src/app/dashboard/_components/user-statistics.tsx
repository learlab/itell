import { Suspense } from "react";
import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { ErrorBoundary } from "react-error-boundary";

import { ReadingTime } from "./reading-time";
import { UserDetails } from "./user-details";
import { LeaderboardMetric } from "./user-leaderboard-control";
import type { ReadingTimeChartParams } from "@itell/core/dashboard";

type Props = {
  userId: string;
  classId: string | null;
  pageSlug: string | null;
  readingTimeLevel?: ReadingTimeChartLevel;
  leaderboardMetric?: LeaderboardMetric;
};
export function UserStatistics({
  userId,
  classId,
  pageSlug,
  readingTimeLevel = ReadingTimeChartLevel.week_1,
  leaderboardMetric = LeaderboardMetric.all,
}: Props) {
  const readingTimeParams: ReadingTimeChartParams = {
    level: readingTimeLevel,
  };

  return (
    <div className="space-y-4">
      <Suspense fallback={<UserDetails.Skeleton />}>
        <ErrorBoundary fallback={<UserDetails.ErrorFallback />}>
          <UserDetails
            userId={userId}
            classId={classId}
            pageSlug={pageSlug}
            leaderboardMetric={leaderboardMetric}
          />
        </ErrorBoundary>
      </Suspense>

      <Suspense fallback={<ReadingTime.Skeleton />}>
        <ErrorBoundary fallback={<ReadingTime.ErrorFallback />}>
          <ReadingTime params={readingTimeParams} userId={userId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
