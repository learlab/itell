import { Suspense } from "react";
import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { ErrorBoundary } from "react-error-boundary";

import { LeaderboardMetric } from "@/lib/navigation";
import { quizPages } from "@/lib/pages/pages.server";
import { StudentQuizReport } from "../quiz/quiz-report";
import { ReadingTime } from "./reading-time";
import { UserDetails } from "./user-details";
import type { ReadingTimeChartParams } from "@itell/core/dashboard";

type Props = {
  userId: string;
  userName: string;
  classId: string | null;
  pageSlug: string | null;
  readingTimeLevel?: ReadingTimeChartLevel;
  leaderboardMetric?: LeaderboardMetric;
};
export function UserStatistics({
  userId,
  userName,
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

      {quizPages.length > 0 && (
        <Suspense fallback={<StudentQuizReport.Skeleton />}>
          <ErrorBoundary fallback={<StudentQuizReport.ErrorFallback />}>
            <StudentQuizReport userId={userId} userName={userName} />
          </ErrorBoundary>
        </Suspense>
      )}

      <Suspense fallback={<ReadingTime.Skeleton />}>
        <ErrorBoundary fallback={<ReadingTime.ErrorFallback />}>
          <ReadingTime params={readingTimeParams} userId={userId} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
