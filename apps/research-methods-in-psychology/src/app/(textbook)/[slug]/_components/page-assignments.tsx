import { Condition } from "@/lib/constants";
import { PageStatus } from "@/lib/page-status";
import { getPageData } from "@/lib/utils";
import { Elements } from "@itell/constants";
import { Errorbox } from "@itell/ui/callout";
import { User } from "lucia";
import { Suspense } from "react";
import { PageQuizModal } from "./page-quiz-modal";
import { SummaryCount } from "./summary/summary-count";
import { SummaryDescription } from "./summary/summary-description";
import { SummaryFormReread } from "./summary/summary-form-reread";
import { SummaryFormSimple } from "./summary/summary-form-simple";
import { SummaryFormStairs } from "./summary/summary-form-stairs";

type Props = {
	pageSlug: string;
	pageStatus: PageStatus;
	user: User;
	condition: string;
};

export const PageAssignments = async ({
	pageSlug,
	pageStatus,
	user,
	condition,
}: Props) => {
	const page = getPageData(pageSlug);
	if (!page) {
		return <Errorbox>failed to load assignments</Errorbox>;
	}

	return (
		<section
			className="grid gird-cols-1 lg:grid-cols-3 gap-8 p-4 lg:p-8 border-t-2 mb-20 max-w-[1800px] mx-auto"
			id={Elements.PAGE_ASSIGNMENTS}
			aria-labelledby="page-assignments-heading"
		>
			<h2 className="sr-only" id="page-assignments-heading">
				assignments
			</h2>
			{condition === Condition.SIMPLE ? (
				<div className="col-span-full max-w-2xl mx-auto space-y-4">
					<SummaryFormSimple page={page} pageStatus={pageStatus} />
				</div>
			) : (
				<>
					<div className="col-span-full hidden md:block lg:col-span-1">
						<SummaryDescription condition={condition} />
						{condition !== Condition.SIMPLE && (
							<Suspense fallback={<SummaryCount.Skeleton />}>
								<div className="mt-8">
									<SummaryCount pageSlug={page.slug} />
								</div>
							</Suspense>
						)}
					</div>

					<div className="col-span-full lg:col-span-2">
						{condition === Condition.RANDOM_REREAD ? (
							<SummaryFormReread
								user={user}
								page={page}
								pageStatus={pageStatus}
							/>
						) : condition === Condition.STAIRS ? (
							<SummaryFormStairs
								user={user}
								page={page}
								pageStatus={pageStatus}
							/>
						) : null}
					</div>
				</>
			)}

			<PageQuizModal page={page} />
		</section>
	);
};
