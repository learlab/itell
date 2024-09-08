import { countSummaryAction, getReadingTimeAction } from "@/actions/dashboard";
import { CreateErrorFallback } from "@/components/error-fallback";
import { PrevDaysLookup, getReadingTimeChartData } from "@itell/core/dashboard";
import { ReadingTimeChartParams } from "@itell/core/dashboard";
import { Button } from "@itell/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@itell/ui/card";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@itell/ui/hover-card";
import { Skeleton } from "@itell/ui/skeleton";
import { getDatesBetween } from "@itell/utils";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import pluralize from "pluralize";
import { ReadingTimeChart } from "./reading-time-chart";
import { ReadingTimeControl } from "./reading-time-control";

type Props = {
	params: ReadingTimeChartParams;
	name?: string;
};

export const ReadingTime = async ({ params, name }: Props) => {
	const startDate = subDays(new Date(), PrevDaysLookup[params.level]);
	const intervalDates = getDatesBetween(startDate, new Date());
	const [[summaryCount, err1], [readingTimeGrouped, err2]] = await Promise.all([
		countSummaryAction({ startDate }),
		getReadingTimeAction({ startDate, intervalDates }),
	]);

	if (err1) {
		throw new Error(err1.message);
	}

	if (err2) {
		throw new Error(err2.message);
	}

	const { totalViewTime, chartData } = getReadingTimeChartData(
		readingTimeGrouped,
		intervalDates,
		params,
	);
	return (
		<Card className="has-[[data-pending]]:animate-pulse">
			<CardHeader>
				<CardTitle>
					<div className="flex items-center justify-between">
						<HoverCard>
							<HoverCardTrigger asChild>
								<Button
									variant="link"
									size="lg"
									className="pl-0 text-lg xl:text-xl flex items-center gap-1"
								>
									Total Reading Time
									<InfoIcon className="size-4" />
								</Button>
							</HoverCardTrigger>
							<HoverCardContent>
								<p className="text-sm font-semibold">
									Measures how long a user has stayed in all textbook pages, in
									minutes
								</p>
							</HoverCardContent>
						</HoverCard>
						<ReadingTimeControl />
					</div>
				</CardTitle>
				<CardDescription>
					{name ? name : "You"} spent {Math.round(totalViewTime / 60)} minutes
					reading the textbook, wrote {""}
					<Link className="font-semibold underline" href="/dashboard/summaries">
						{pluralize("summary", summaryCount, true)}
					</Link>{" "}
					during {startDate.toLocaleDateString()} -{" "}
					{new Date().toLocaleDateString()}
				</CardDescription>
			</CardHeader>
			<CardContent className="pl-2 space-y-2">
				<ReadingTimeChart data={chartData} />
			</CardContent>
		</Card>
	);
};

ReadingTime.Skeleton = () => <Skeleton className="w-full h-[350px]" />;
ReadingTime.ErrorFallback = CreateErrorFallback(
	"Failed to calculate total reading time",
);

const subDays = (date: Date, days: number) => {
	const result = new Date(date);
	result.setDate(date.getDate() - days);
	return result;
};
