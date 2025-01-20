import { Avatar, AvatarFallback, AvatarImage } from "@itell/ui/avatar";
import { Button } from "@itell/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@itell/ui/table";

import { CreateErrorFallback } from "@/components/error-fallback";
import { getStreakLeaderboard } from "@/db/user";

type Props = {
  userId: string;
  classId: string | null;
};

export async function UserLeaderboard({ userId, classId }: Props) {
  const streakData = await getStreakLeaderboard({ classId });

  const getAdjustedRank = (index: number): number => {
    // 0 indexed rank to 1 indexed rank
    // if tied with previous user, show same rank
    if (index === 0) {
      return 1;
    }
    const previousUser = streakData[index - 1];
    const currentUser = streakData[index];
    if (
      previousUser.streak?.max_cri_streak === currentUser.streak?.max_cri_streak
    ) {
      return getAdjustedRank(index - 1);
    }
    return index + 1;
  };

  return (
    <Card className="has-[[data-pending]]:animate-pulse">
      <CardHeader>
        <CardTitle>
          <Button
            variant="link"
            size="lg"
            className="flex items-center gap-1 pl-0 text-lg xl:text-xl"
          >
            Class Leaderboard
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Classmate</TableHead>
              <TableHead>Question Streak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="gap-2">
            {streakData.map((user, index) => (
              <TableRow key={user.name}>
                <TableCell>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">
                    {getAdjustedRank(index)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="inline-flex items-center gap-2 align-middle">
                    {user.image ? (
                      <Avatar className="mr-2 h-8 w-8">
                        <AvatarImage
                          src={user.image}
                          alt="user profile photo"
                        />
                      </Avatar>
                    ) : (
                      <AvatarFallback>
                        {user.name?.[0]?.toUpperCase() ?? "User"}
                      </AvatarFallback>
                    )}
                    {user.name}
                  </div>
                </TableCell>
                <TableCell>{user.streak?.max_cri_streak}</TableCell>
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
