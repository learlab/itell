import { summaries } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { incrementView } from "@/lib/dashboard/actions";
import { db, first } from "@/lib/db";
import { allPagesSorted } from "@/lib/pages";
import { Badge } from "@itell/ui/badge";
import { SummaryBackButton } from "@summary/summary-back-button";
import { SummaryOperations } from "@summary/summary-operations";
import { SummaryReviseButton } from "@summary/summary-revise-button";
import { TextbookPageModal } from "@summary/textbook-page-modal";
import { and, eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

async function getSummaryForUser(summaryId: number, userId: string) {
	return first(
		await db
			.select()
			.from(summaries)
			.where(and(eq(summaries.id, summaryId), eq(summaries.userId, userId))),
	);
}

interface PageProps {
	params: {
		id: string;
	};
}

export default async function ({ params }: PageProps) {
	const { user } = await getSession();
	if (!user) {
		return redirect("/auth");
	}
	const summary = await getSummaryForUser(Number(params.id), user.id);

	if (!summary) {
		return notFound();
	}

	const page = allPagesSorted.find(
		(page) => page.page_slug === summary.pageSlug,
	);
	if (!page) {
		return notFound();
	}

	incrementView(user.id, "summary", { summaryId: summary.id });

	return (
		<div className="px-32 py-4">
			<div className="flex w-full items-center justify-between">
				<div className="flex items-center space-x-10">
					<SummaryBackButton />
				</div>
				<SummaryOperations pageUrl={page.url} />
			</div>
			<div className="grid gap-12 md:grid-cols-[200px_1fr] mt-4">
				<aside className="w-[200px] space-y-4">
					<div className="flex items-center justify-center">
						<Badge variant={summary.isPassed ? "default" : "destructive"}>
							{summary.isPassed ? "Passed" : "Failed"}
						</Badge>
					</div>
					<p className="tracking-tight text-sm text-muted-foreground">
						Click on the title to review this page's content.
					</p>
				</aside>
				<div className="space-y-2">
					<div className="text-center">
						<TextbookPageModal page={page} />
					</div>

					<time
						className="text-sm text-muted-foreground text-center"
						aria-label="created at"
					>
						{summary.createdAt.toLocaleDateString()}
					</time>
					<div className="max-w-2xl mx-auto space-y-2">
						<p>{summary.text}</p>
						<div className="flex justify-end">
							<SummaryReviseButton
								pageSlug={summary.pageSlug}
								text={summary.text}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
