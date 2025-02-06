import { Suspense } from "react";
import Link from "next/link";
import { Alert, AlertTitle } from "@itell/ui/alert";
import { Card, CardContent, CardFooter } from "@itell/ui/card";
import { DashboardBadge } from "@itell/ui/dashboard-badge";
import { Skeleton } from "@itell/ui/skeleton";
import { cn, median } from "@itell/utils";
import { BanIcon, FileTextIcon, FlagIcon, PencilIcon } from "lucide-react";
import pluralize from "pluralize";

import { CreateErrorFallback } from "@/components/error-fallback";
import { Spinner } from "@/components/spinner";
import { getOtherStats, getUserStats } from "@/db/dashboard";
import { countStudents } from "@/db/teacher";
import { getOtherUsers } from "@/db/user";
import { getPageData } from "@/lib/pages/pages.server";
import { TrendChart } from "./trend-chart";
import { UserLeaderboard } from "./user-leaderboard";
import { UserRadarChart } from "./user-radar-chart";
import { LeaderboardMetric } from "@/lib/navigation";

type Props = {
  userId: string;
  classId: string | null;
  pageSlug: string | null;
  leaderboardMetric?: LeaderboardMetric;
};

export async function UserDetails({
  userId,
  classId,
  pageSlug,
  leaderboardMetric = LeaderboardMetric.all,
}: Props) {
  const otherUsers = await getOtherUsers({ userId, classId });
  if (otherUsers.length === 0) {
    return (
      <Alert>
        <BanIcon className="size-4" />
        <AlertTitle>Statistics currently unavailable</AlertTitle>
      </Alert>
    );
  }

  const [userStats, otherStats] = await Promise.all([
    getUserStats(userId),
    getOtherStats({ otherIds: otherUsers.map((user) => user.id), userId }),
  ]);

  const pageIndex = getPageData(pageSlug)?.order;
  const userProgress = pageIndex !== undefined ? pageIndex + 1 : 0;
  const otherProgressArr = otherUsers.map((user) => {
    const pageIndex = getPageData(user.pageSlug)?.order;
    return pageIndex !== undefined ? pageIndex + 1 : 0;
  });
  const otherProgress = median(otherProgressArr) ?? 0;

  const diffs = {
    totalSummaries: userStats.totalSummaries - otherStats.totalSummaries,
    totalPassedSummaries:
      userStats.totalPassedSummaries - otherStats.totalPassedSummaries,
    totalAnswers: userStats.totalAnswers - otherStats.totalAnswers,
    totalPassedAnswers:
      userStats.totalPassedAnswers - otherStats.totalPassedAnswers,
    contentScore:
      userStats.contentScore && otherStats.contentScore
        ? userStats.contentScore - otherStats.contentScore
        : null,
  };

  const radarChartData = {
    progress: {
      label: "Progress",
      user: userProgress,
      other: otherProgress,
      userScaled: scale(userProgress, otherProgress),
      otherScaled: 1,
      description: "Number of pages unlocked",
    },
    totalSummaries: {
      label: "Total Summaries",
      user: userStats.totalSummaries,
      other: otherStats.totalSummaries,
      userScaled: scale(userStats.totalSummaries, otherStats.totalSummaries),
      otherScaled: 1,
      description: "Total number of summaries submitted",
    },
    passedSummaries: {
      label: "Passed Summaries",
      user: userStats.totalPassedSummaries,
      other: otherStats.totalPassedSummaries,
      userScaled: scale(
        userStats.totalPassedSummaries,
        otherStats.totalPassedSummaries,
      ),
      otherScaled: 1,
      description:
        "Total number of summaries that scored well in content score",
    },
    contentScore: {
      label: "Content Score",
      user: userStats.contentScore,
      other: otherStats.contentScore,
      userScaled:
        userStats.contentScore && otherStats.contentScore
          ? scale(userStats.contentScore, otherStats.contentScore)
          : 0,
      otherScaled: 1,
      description:
        "Measures the semantic similarity between the summary and the original text. The higher the score, the better the summary describes the main points of the text.",
    },
    correctCriAnswers: {
      label: "Correct Answers",
      user: userStats.totalPassedAnswers,
      other: otherStats.totalPassedAnswers,
      userScaled: scale(
        userStats.totalPassedAnswers,
        otherStats.totalPassedAnswers,
      ),
      otherScaled: 1,
      description: "Number of correct answers to contructed response items",
    },
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="col-span-1 grid grid-cols-3 gap-4 lg:col-span-2">
        <DashboardBadge
          title="Total Summaries"
          icon={<PencilIcon className="size-4" />}
          className={cn({
            "border-green-500": diffs.totalSummaries > 0,
            "border-destructive": diffs.totalSummaries < 0,
          })}
        >
          <div className="mb-2 flex h-6 items-baseline gap-2">
            <div className="text-2xl font-bold">{userStats.totalSummaries}</div>
            <TrendChart
              prev={userStats.totalSummariesLastWeek}
              current={userStats.totalSummaries}
              label="Total Summaries"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {diffs.totalSummaries > 0 ? "+" : ""}
            {Math.round(diffs.totalSummaries)} compared to others
          </p>
        </DashboardBadge>
        <DashboardBadge
          title="Passed Summaries"
          icon={<FlagIcon className="size-4" />}
          className={cn({
            "border-green-500": diffs.totalPassedSummaries > 0,
            "border-destructive": diffs.totalPassedSummaries < 0,
          })}
        >
          <div className="mb-2 flex h-6 items-baseline gap-2">
            <div className="text-2xl font-bold">
              {userStats.totalPassedSummaries}
            </div>
            <TrendChart
              prev={userStats.totalPassedSummariesLastWeek}
              current={userStats.totalPassedSummaries}
              label="Passed Summaries"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {diffs.totalPassedSummaries > 0 ? "+" : ""}
            {Math.round(diffs.totalPassedSummaries)} compared to others
          </p>
        </DashboardBadge>
        <DashboardBadge
          title="Median Content Score"
          icon={<FileTextIcon className="size-4" />}
          className={cn({
            "border-green-500": diffs.contentScore && diffs.contentScore > 0,
            "border-destructive": diffs.contentScore && diffs.contentScore < 0,
          })}
        >
          <div className="mb-2 flex h-6 items-baseline gap-2">
            <div className="text-2xl font-bold">
              {userStats.contentScore
                ? userStats.contentScore.toFixed(2)
                : "NA"}
            </div>
            {userStats.contentScoreLastWeek ? (
              <TrendChart
                prev={userStats.contentScoreLastWeek}
                current={userStats.contentScore}
                label="Content Score"
              />
            ) : null}
          </div>
          <p className="text-xs text-muted-foreground">
            {diffs.contentScore
              ? `
					${diffs.contentScore > 0 ? "+" : ""}${diffs.contentScore.toFixed(
            2,
          )} compared to others`
              : "class stats unavailable"}
          </p>
        </DashboardBadge>
      </div>

      <Card className="col-span-full lg:col-span-1">
        <CardContent>
          <UserRadarChart data={radarChartData} />
        </CardContent>
        <CardFooter className="text-muted-foreground">
          <p>
            Percentages are relative to the median,{" "}
            {classId ? (
              <span>
                Comparing with{" "}
                <Suspense fallback={<Spinner className="inline" />}>
                  <StudentCount classId={classId} />
                </Suspense>{" "}
                from the same class
              </span>
            ) : (
              <span>
                enter your class code in{" "}
                <Link href="/dashboard/settings#enroll" className="underline">
                  Settings
                </Link>{" "}
                to join a class.
              </span>
            )}
          </p>
        </CardFooter>
      </Card>
      <UserLeaderboard
        userId={userId}
        classId={classId}
        metric={leaderboardMetric}
      />
    </div>
  );
}

UserDetails.ErrorFallback = CreateErrorFallback(
  "Failed to calculate learning statistics",
);

UserDetails.Skeleton = function UserDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="col-span-1 grid grid-cols-3 gap-4 lg:col-span-2">
        <DashboardBadge.Skeletons />
      </div>

      <Card className="col-span-full lg:col-span-1">
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-6 w-full" />
        </CardFooter>
      </Card>
      <Card className="col-span-full lg:col-span-1">
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-6 w-full" />
        </CardFooter>
      </Card>
    </div>
  );
};

async function StudentCount({ classId }: { classId: string }) {
  const count = await countStudents(classId);
  return <span>{pluralize("student", count, true)}</span>;
}

// function to scale the user's value relative to that of the others, which is treated as 1
const scale = (a: number, b: number) => {
  if (Math.abs(b) < Number.EPSILON) {
    return a === 0 ? 0 : 2;
  }

  return a / Math.abs(b);
};
