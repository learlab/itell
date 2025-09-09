"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@itell/ui/chart";
import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@itell/ui/chart";

const chartConfig = {
  value: {
    label: "Count",
  },
  one: {
    label: "Level 1",
    color: "var(--chart-2)",
  },
  two: {
    label: "Level 2",
    color: "var(--chart-2)",
  },
  three: {
    label: "Level 3",
    color: "var(--chart-3)",
  },
  four: {
    label: "Level 4",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

type Props = {
  data: { name: string; value: number; fill: string }[];
};

export function CRIChart({ data }: Props) {
  return (
    <>
      <p className="sr-only" id="question-chart-title">
        A bar chart of user&apos;s answers,{" "}
        {data.find((d) => d.name === "one")?.value ?? 0} level 1,{" "}
        {data.find((d) => d.name === "two")?.value ?? 0} level 2,{" "}
        {data.find((d) => d.name === "one")?.value ?? 0} level 3,{" "}
        {data.find((d) => d.name === "one")?.value ?? 0} level 4,{" "}
      </p>
      <ChartContainer
        config={chartConfig}
        className="min-h-[100px] max-w-[600px]"
        aria-labelledby="question-chart-title"
      >
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            right: 32,
          }}
        >
          <XAxis
            dataKey="name"
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            hide
          />
          <YAxis dataKey="value" type="number" hide />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator="line"
                descriptionKey="description"
              />
            }
          />
          <Bar dataKey="value" radius={5}>
            <LabelList
              dataKey="name"
              offset={8}
              className="fill-[--color-label] text-base font-light xl:text-lg"
              fontSize={12}
              formatter={(value: string) => {
                return value;
              }}
            />
            <LabelList
              dataKey="value"
              position="top"
              className="fill-foreground text-base xl:text-lg"
              offset={8}
              fontSize={12}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </>
  );
}
