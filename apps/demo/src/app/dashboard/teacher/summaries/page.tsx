import { notFound } from "next/navigation";
import { Card, CardContent } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { SummaryChart } from "@summaries/summary-chart";

import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { getClassSummaryStats } from "@/db/summary";
import { routes } from "@/lib/navigation";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { SummaryListSelect } from "../../summaries/_components/summary-list-select";
import { checkTeacher } from "../check-teacher";

export default async function Page(props: { searchParams: Promise<unknown> }) {
  const searchParams = await props.searchParams;
  const teacher = await checkTeacher();
  if (!teacher) {
    return notFound();
  }

  incrementView({ userId: teacher.id, pageSlug: Meta.summariesTeacher.slug });

  const { page } =
    routes.dashboardSummariesTeacher.$parseSearchParams(searchParams);
  const { passed, failed, startDate, endDate } = await getClassSummaryStats(
    teacher.classId,
    page
  );

  const chartData = [
    {
      name: "passed",
      value: passed,
      fill: "var(--color-passed)",
    },
    {
      name: "failed",
      value: failed,
      fill: "var(--color-failed)",
    },
  ];

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.summaries.title}
        text={Meta.summaries.description}
      />
      <Card>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <SummaryChart
              chartTitle="All Summaries from Class"
              data={chartData}
              startDate={startDate}
              endDate={startDate}
              totalCount={failed + passed}
            />
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                <SummaryListSelect defaultValue={page} pages={allPagesSorted} />
                <p className="text-sm text-muted-foreground">
                  {passed} passed, {failed} failed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
