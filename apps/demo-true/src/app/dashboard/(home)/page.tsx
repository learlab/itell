import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { Card, CardContent } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { UserProgress } from "@dashboard/user-progress";
import { UserStatistics } from "@dashboard/user-statistics";

import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
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

  const { reading_time_level } =
    routes.dashboard.$parseSearchParams(searchParams);
  let readingTimeLevel = ReadingTimeChartLevel.week_1;
  if (
    Object.values(ReadingTimeChartLevel).includes(
      reading_time_level as ReadingTimeChartLevel
    )
  ) {
    readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
  }

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
          />
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
