import { Card, CardContent } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { UserDetails } from "@dashboard/user-details";

import { Meta } from "@/config/metadata";

export default function Loading() {
  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.home.title} text={Meta.home.description} />
      <Card>
        <CardContent className="space-y-4">
          <UserDetails.Skeleton />
          <div className="space-y-4">
            <Skeleton className="h-[350px]" />
            <Skeleton className="h-[350px]" />
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
