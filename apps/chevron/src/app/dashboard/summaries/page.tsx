import { PageLink } from "@/components/page-link";
import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { allPagesSorted, firstPage } from "@/lib/pages";
import { getUserSummaries } from "@/lib/summary";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { groupby } from "@itell/core/utils";
import { Card, CardContent } from "@itell/ui/server";
import { SummaryChart } from "@summaries/summary-chart";
import { SummaryList } from "@summaries/summary-list";
import { redirect } from "next/navigation";

export default async function () {
	const { user } = await getSession();
	if (!user) {
		return redirect("/auth");
	}

	incrementView(user.id, "summaries");

	const userSummaries = await getUserSummaries(user.id);

	if (userSummaries.length === 0) {
		return (
			<DashboardShell>
				<DashboardHeader heading="Summary" text="Manage summaries." />
				<Card>
					<CardContent>
						You have not made any summary yet. Start with{" "}
						<PageLink
							pageSlug={firstPage.page_slug}
							className="underline font-medium"
						>
							{firstPage.title}
						</PageLink>
						!
					</CardContent>
				</Card>
			</DashboardShell>
		);
	}

	const summaries = userSummaries
		.map((s) => {
			const page = allPagesSorted.find((page) => page.page_slug === s.pageSlug);

			if (!page) {
				return undefined;
			}

			return {
				...s,
				chapter: page.chapter,
				pageTitle: page.title,
			};
		})
		.filter((s) => s !== undefined);

	const summariesByChapter = groupby(summaries, (summary) => summary.chapter);

	const summariesByPassing = summaries.reduce(
		(acc, summary) => {
			if (summary.isPassed) {
				acc.passed += 1;
			} else {
				acc.failed += 1;
			}

			if (summary.updatedAt < acc.startDate) {
				acc.startDate = summary.createdAt;
			}

			if (summary.updatedAt > acc.endDate) {
				acc.endDate = summary.createdAt;
			}

			return acc;
		},
		{ passed: 0, failed: 0, startDate: new Date(), endDate: new Date() },
	);
	const chartData = [
		{
			name: "passed",
			value: summariesByPassing.passed,
			fill: "var(--color-passed)",
		},
		{
			name: "failed",
			value: summariesByPassing.failed,
			fill: "var(--color-failed)",
		},
	];

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.summaries.title}
				text={Meta.summaries.description}
			/>
			<Card className="w-full">
				<CardContent className="space-y-4">
					<SummaryChart
						data={chartData}
						startDate={summariesByPassing.startDate.toLocaleDateString()}
						endDate={summariesByPassing.endDate.toLocaleDateString()}
						totalCount={summaries.length}
					/>
					<SummaryList
						summariesByChapter={summariesByChapter}
						userTimeZone={user.timeZone}
					/>
				</CardContent>
			</Card>
		</DashboardShell>
	);
}
