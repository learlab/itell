import { DashboardBadge } from "@itell/ui/dashboard-badge";
import { FileTextIcon, FlagIcon, PencilIcon } from "lucide-react";

import { CreateErrorFallback } from "@/components/error-fallback";
import { getOtherStats } from "@/db/dashboard";

type Props = {
  userId: string;
  otherIds: string[];
};

export async function ClassBadges({ userId, otherIds }: Props) {
  const classStats = await getOtherStats({
    userId,
    otherIds,
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <DashboardBadge title="Total Summaries" icon={<PencilIcon />}>
        <div className="text-2xl font-bold">{classStats.totalSummaries}</div>
      </DashboardBadge>
      <DashboardBadge title="Passed Summaries" icon={<FlagIcon />}>
        <div className="text-2xl font-bold">
          {classStats.totalPassedSummaries}
        </div>
      </DashboardBadge>
      <DashboardBadge title="Content Score" icon={<FileTextIcon />}>
        <div className="text-2xl font-bold">
          {classStats.contentScore ? classStats.contentScore.toFixed(2) : "NA"}
        </div>
      </DashboardBadge>
      <DashboardBadge title="CRI Answers" icon={<PencilIcon />}>
        <div className="text-2xl font-bold">{classStats.totalAnswers}</div>
      </DashboardBadge>
      <DashboardBadge title="Correct CRI Answers" icon={<FlagIcon />}>
        <div className="text-2xl font-bold">
          {classStats.totalPassedAnswers}
        </div>
      </DashboardBadge>
    </div>
  );
}

ClassBadges.Skeleton = function ClassBadgesSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardBadge.Skeletons />
    </div>
  );
};

ClassBadges.ErrorFallback = CreateErrorFallback(
  "Failed to calculate class statistics"
);
