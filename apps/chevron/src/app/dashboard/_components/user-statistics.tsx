import { Suspense } from "react";
import {
  type ReadingTimeChartLevel,
  type ReadingTimeChartParams,
} from "@itell/core/dashboard";
import { ErrorBoundary } from "react-error-boundary";

import { ReadingTime } from "./reading-time";
import { UserDetails } from "./user-details";

type Props = {
  userId: string;
  classId: string | null;
  pageSlug: string | null;
  readingTimeLevel: ReadingTimeChartLevel;
};
export function UserStatistics({
  userId,
  classId,
  pageSlug,
  readingTimeLevel,
}: Props) {
  // if searchParams is not passed as prop here, readingTimeParams will always be week 1
  // and switching levels in UserStatisticsControl won't work (although query params are set)
  // future work is to restructure the component hierarchy
  const readingTimeParams: ReadingTimeChartParams = {
    level: readingTimeLevel,
  };

  return (
    <div className="space-y-4">
      <Suspense fallback={<UserDetails.Skeleton />}>
        <ErrorBoundary fallback={<UserDetails.ErrorFallback />}>
          <UserDetails userId={userId} classId={classId} pageSlug={pageSlug} />
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
