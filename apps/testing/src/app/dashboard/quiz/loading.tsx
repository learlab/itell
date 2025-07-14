import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { SummaryItemSkeleton } from "@summaries/summary-list";

import { Meta } from "@/config/metadata";

export default function Loading() {
  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.quiz.title} text={Meta.quiz.description} />
      <Card>
        <CardContent className="space-y-4">
          <Card>
            <CardHeader className="items-center pb-0">
              <CardTitle className="text-center text-lg font-semibold">
                Quiz Submission History
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-2">
              <Skeleton className="aspect-square h-[300px]" />
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
