import { Skeleton } from "@itell/ui/skeleton";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";

import { Meta } from "@/config/metadata";

export default function () {
  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.criTeacher.title}
        text={Meta.criTeacher.description}
      />
      <div className="space-y-6">
        <Skeleton className="h-[350px] w-full" />
      </div>
    </DashboardShell>
  );
}
