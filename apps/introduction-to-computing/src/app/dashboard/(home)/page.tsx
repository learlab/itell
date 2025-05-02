import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { Card, CardContent } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { UserProgress } from "@dashboard/user-progress";
import { UserStatistics } from "@dashboard/user-statistics";

import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { getSession } from "@/lib/auth";
import { LeaderboardMetric, routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

type Props = {
  searchParams?: Promise<Record<string, string> | undefined>;
};

export default async function Page(props: Props) {
  const searchParams = await props.searchParams;
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("auth", searchParams);
  }

  const { readingTimeLevel, leaderboardMetric } =
    parseSearchParams(searchParams);

  incrementView({
    userId: user.id,
    pageSlug: Meta.home.slug,
    data: searchParams,
  });

  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.home.title} text={Meta.home.description} />
      <Card>
        <CardContent className="space-y-4">
          <UserProgress pageSlug={user.pageSlug} finished={user.finished} />
          <UserStatistics
            userId={user.id}
            classId={user.classId}
            pageSlug={user.pageSlug}
            readingTimeLevel={readingTimeLevel}
            leaderboardMetric={leaderboardMetric}
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}

const parseSearchParams = (searchParams: unknown) => {
  const { reading_time_level, leaderboard_metric } =
    routes.dashboard.$parseSearchParams(searchParams);
  let readingTimeLevel = ReadingTimeChartLevel.week_1;
  if (
    Object.values(ReadingTimeChartLevel).includes(
      reading_time_level as ReadingTimeChartLevel
    )
  ) {
    readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
  }

  let leaderboardMetric = LeaderboardMetric.all;
  if (
    Object.values(LeaderboardMetric).includes(
      leaderboard_metric as LeaderboardMetric
    )
  ) {
    leaderboardMetric = leaderboard_metric as LeaderboardMetric;
  }

  return { readingTimeLevel, leaderboardMetric };
};
