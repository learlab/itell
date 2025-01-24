"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";

import { routes, useSafeSearchParams } from "@/lib/navigation";

export enum LeaderboardMetric {
  all = "all",
  summary_streak = "summary_streak",
  cri_streak = "cri_streak",
}

export function UserLeaderboardControl() {
  const router = useRouter();
  const { leaderboard_metric } = useSafeSearchParams("dashboard");
  const [pending, startTransition] = useTransition();

  const handleSelect = (val: string) => {
    startTransition(() => {
      router.push(
        routes.dashboard({
          search: {
            leaderboard_metric: val,
          },
        })
      );
    });
  };

  return (
    <div
      className="flex items-center gap-4"
      data-pending={pending ? "" : undefined}
    >
      <Select defaultValue={leaderboard_metric} onValueChange={handleSelect}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select a metric" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={LeaderboardMetric.summary_streak}>
            Streak of passing summaries
          </SelectItem>
          <SelectItem value={LeaderboardMetric.cri_streak}>
            Streak of correct answers
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
