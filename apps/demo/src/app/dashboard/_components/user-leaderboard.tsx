import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { Button } from "@itell/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@itell/ui/hover-card";
import { Skeleton } from "@itell/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itell/ui/table";
import { InfoIcon } from "lucide-react";

import { CreateErrorFallback } from "@/components/error-fallback";
import { getLeaderboard } from "@/db/user";
import { LeaderboardMetric } from "./user-leaderboard-control";

type Props = {
  userId: string;
  classId: string | null;
  metric: LeaderboardMetric;
};

export async function UserLeaderboard({ userId, classId, metric }: Props) {
  const data = await getLeaderboard({ userId, classId, metric });
  console.log(data[0].image);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button
                variant="link"
                size="lg"
                className="flex items-center gap-1 pl-0 text-lg xl:text-xl"
              >
                {classId && "Class "} Leaderboard{" "}
                <InfoIcon className="size-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="text-sm font-semibold">
                A leaderboard of students in this class. The rankings are
                decided by the longest streak of consecutive summaries passed
                and the longest streak of consecutive questions answered
                correctly.
              </p>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Classmate</TableHead>
              <TableHead>Summary Streak 🥇</TableHead>
              <TableHead>Question Streak 🥈</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="gap-2">
            {data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${user.id === userId ? "bg-green-400" : "bg-slate-200"}`}
                  >
                    {user.combined_rank}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-2 align-middle">
                    <Avatar className="mr-2 h-8 w-8">
                      <>
                        <AvatarImage src={user.image ?? ""} />
                        <AvatarFallback>
                          {user.name?.slice(0, 1)}
                        </AvatarFallback>
                      </>
                    </Avatar>
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.max_summary_streak}</TableCell>
                <TableCell>{user.max_cri_streak}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

UserLeaderboard.Skeleton = function ReadingTimeSkeleton() {
  return <Skeleton className="h-[350px] w-full" />;
};
UserLeaderboard.ErrorFallback = CreateErrorFallback(
  "Could not load user leaderboard"
);
