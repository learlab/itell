"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@itell/ui/select";

import { routes, useSafeSearchParams } from "@/lib/navigation";

export function ReadingTimeControl() {
  const router = useRouter();
  const { reading_time_level } = useSafeSearchParams("dashboard");
  const [pending, startTransition] = useTransition();

  const handleSelect = (val: string) => {
    startTransition(() => {
      router.push(
        routes.dashboard({
          search: {
            reading_time_level: val,
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
      <Select defaultValue={reading_time_level} onValueChange={handleSelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a time span" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ReadingTimeChartLevel.week_1}>
            Last week
          </SelectItem>
          <SelectItem value={ReadingTimeChartLevel.week_2}>
            Last two weeks
          </SelectItem>
          <SelectItem value={ReadingTimeChartLevel.month_1}>
            Last month
          </SelectItem>
          <SelectItem value={ReadingTimeChartLevel.month_2}>
            Last two months
          </SelectItem>
          <SelectItem value={ReadingTimeChartLevel.month_3}>
            Last three months
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
