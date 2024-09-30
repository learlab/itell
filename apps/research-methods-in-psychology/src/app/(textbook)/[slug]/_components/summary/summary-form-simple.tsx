"use client";
import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import {
	useQuestionStore,
	useQuizStore,
} from "@/components/provider/page-provider";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { SelectSummaryReady } from "@/lib/store/question-store";
import { PageData, reportSentry } from "@/lib/utils";
import { useDebounce } from "@itell/core/hooks";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { useSelector } from "@xstate/store/react";
import { ArrowRightIcon, CheckSquare2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

type Props = {
	pageStatus: PageStatus;
	page: PageData;
};

export const SummaryFormSimple = React.memo(({ pageStatus, page }: Props) => {
	const questionStore = useQuestionStore();
	const quizStore = useQuizStore();
	const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
	const router = useRouter();
	const [finished, setFinished] = useState(pageStatus.unlocked);

	const {
		action,
		isError,
		isPending: _isPending,
		error,
		isDelayed,
	} = useActionStatus(
		async (e: FormEvent) => {
			e.preventDefault();
			if (finished && page.next_slug) {
				router.push(page.next_slug);
				return;
			}
			const [data, err] = await incrementUserPageSlugAction({
				currentPageSlug: page.slug,
			});
			if (err) {
				throw new Error("increment user page slug action", { cause: err });
			}

			if (page.quiz && page.quiz.length > 0 && !pageStatus.unlocked) {
				quizStore.send({
					type: "toggleQuiz",
				});
				return;
			}

			if (isLastPage(page.slug)) {
				toast.info("You have finished the entire textbook!", {
					important: true,
					duration: 100000,
				});
			}

			setFinished(true);
		},
		{ delayTimeout: 3000 },
	);
	const isPending = useDebounce(_isPending, 100);

	useEffect(() => {
		if (isError) {
			reportSentry("summary simple", {
				pageSlug: page.slug,
				error: error?.cause,
			});
		}
	}, [isError]);

	if (!isSummaryReady) {
		return (
			<div className="max-w-2xl mx-auto">
				<p>Finish the entire page to move on.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-2">
			<p className="font-light text-lg mb-4" role="status">
				{finished
					? "You have completed this page, but you are still welcome to read the reference summary below to enhance understanding."
					: "Below is a reference summary for this page. Please read it carefully to better understand the information presented."}
			</p>
			<p>placeholder text</p>

			<h2 id="completion-form-heading" className="sr-only">
				completion
			</h2>
			<form
				aria-labelledby="completion-form-heading"
				className="flex justify-end gap-2"
				onSubmit={action}
			>
				<StatusButton
					pending={isPending}
					disabled={finished && !page.next_slug}
					className="w-44"
				>
					{!finished ? (
						<span className="inline-flex gap-1 items-center">
							<CheckSquare2Icon className="size-4" /> Mark as completed
						</span>
					) : page.next_slug ? (
						<span className="inline-flex gap-1 items-center">
							<ArrowRightIcon className="size-4" /> Go to next page
						</span>
					) : (
						<span>Textbook finished</span>
					)}
				</StatusButton>
			</form>
			{isError && (
				<Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
			)}
			{isDelayed && <DelayMessage />}
		</div>
	);
});
