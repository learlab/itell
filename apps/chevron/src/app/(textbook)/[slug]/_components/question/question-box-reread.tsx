"use client";

import { createQuestionAnswerAction } from "@/actions/question";
import { InternalError } from "@/components/interval-error";
import { useQuestion } from "@/components/provider/page-provider";
import { useSession } from "@/components/provider/session-provider";
import { Spinner } from "@/components/spinner";
import { isProduction } from "@/lib/constants";
import { Condition } from "@/lib/constants";
import { getQAScore } from "@/lib/question";
import { reportSentry } from "@/lib/utils";
import { LoginButton } from "@auth//auth-form";
import { cn } from "@itell/core/utils";
import {
	Button,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	StatusButton,
	TextArea,
} from "@itell/ui/client";
import { Card, CardContent, Warning } from "@itell/ui/server";
import { KeyRoundIcon, PencilIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { FinishQuestionButton } from "./finish-question-button";
import { QuestionScore, StatusReread } from "./types";

type Props = {
	question: string;
	answer: string;
	chunkSlug: string;
	pageSlug: string;
};

type State = {
	status: StatusReread;
	show: boolean;
	error: string | null;
};

export const QuestionBoxReread = ({
	question,
	answer,
	chunkSlug,
	pageSlug,
}: Props) => {
	const { user } = useSession();
	const { shouldBlur, finishChunk } = useQuestion((state) => ({
		shouldBlur: state.shouldBlur,
		finishChunk: state.finishChunk,
	}));

	const [state, setState] = useState<State>({
		error: null,
		status: StatusReread.UNANSWERED,
		show: shouldBlur,
	});

	const {
		action: onSubmit,
		isPending,
		isError,
		error,
	} = useActionStatus(async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setState((prevState) => ({ ...prevState, error: null }));
		const formData = new FormData(e.currentTarget);
		const input = String(formData.get("input")).trim();
		if (input.length === 0) {
			setState((state) => ({ ...state, error: "Answer cannot be empty" }));
			return;
		}

		const response = await getQAScore({
			input,
			chunk_slug: chunkSlug,
			page_slug: pageSlug,
		});

		const score = response.score as QuestionScore;
		finishChunk(chunkSlug, false);

		setState((state) => ({
			...state,
			error: null,
			status: StatusReread.ANSWERED,
		}));

		createQuestionAnswerAction({
			text: input,
			condition: Condition.RANDOM_REREAD,
			chunkSlug,
			pageSlug,
			score,
		});
	});

	const isNextButtonDisplayed =
		shouldBlur && state.status === StatusReread.ANSWERED;

	useEffect(() => {
		if (isError) {
			setState((state) => ({
				...state,
				error: "Failed to evaluate answer, please try again later",
			}));
			reportSentry("evaluate constructed response", { error });
		}
	}, [isError]);

	const isLastQuestion = chunkSlug === chunkSlug.at(-1);

	if (!user) {
		return (
			<Warning>
				<p>You need to be logged in to view this question and move forward</p>
				<LoginButton />
			</Warning>
		);
	}

	if (!state.show) {
		return (
			<Button
				variant={"outline"}
				onClick={() => setState((state) => ({ ...state, show: true }))}
			>
				Reveal optional question
			</Button>
		);
	}

	return (
		<Card
			className={cn(
				"flex justify-center items-center flex-col py-4 px-6 space-y-2 animate-in fade-in zoom-10",
				state.status === StatusReread.ANSWERED ? "border-2 border-border" : "",
			)}
		>
			<CardContent className="flex flex-col gap-4 justify-center items-center w-4/5 mx-auto">
				{question && (
					<p>
						<span className="font-bold">Question </span>
						{!shouldBlur && <span className="font-bold">(Optional)</span>}:{" "}
						{question}
					</p>
				)}
				{state.status === StatusReread.ANSWERED && (
					<p className="text-sm text-muted-foreground">
						Thanks for completing this question. You can move on to the next
						section or refine your answer.
					</p>
				)}
				<form onSubmit={onSubmit} className="w-full space-y-2">
					<TextArea
						name="input"
						rows={2}
						className="max-w-lg mx-auto rounded-md shadow-md p-4"
						onPaste={(e) => {
							if (isProduction) {
								e.preventDefault();
								toast.warning("Copy & Paste is not allowed for question");
							}
						}}
					/>
					{state.error && (
						<InternalError className="text-center">
							<p>{state.error}</p>
						</InternalError>
					)}

					<div className="flex flex-col sm:flex-row justify-center items-center gap-2">
						{state.status === StatusReread.ANSWERED && (
							<HoverCard>
								<HoverCardTrigger asChild>
									<Button variant={"outline"} type="button">
										<KeyRoundIcon className="size-4 mr-2" />
										Reveal Answer
									</Button>
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<p className="leading-relaxed">{answer}</p>
								</HoverCardContent>
							</HoverCard>
						)}

						<StatusButton
							pending={isPending}
							type="submit"
							disabled={isPending}
							variant={"outline"}
							className="w-32"
						>
							{isPending ? (
								<Spinner className="size-4" />
							) : (
								<>
									<PencilIcon className="size-4 mr-2 shrink-0" />
									<span>
										{state.status === StatusReread.ANSWERED
											? "Resubmit"
											: "Answer"}
									</span>
								</>
							)}
						</StatusButton>

						{state.status !== StatusReread.UNANSWERED &&
							isNextButtonDisplayed && (
								<FinishQuestionButton
									pageSlug={pageSlug}
									chunkSlug={chunkSlug}
									isLastQuestion={isLastQuestion}
									condition={Condition.RANDOM_REREAD}
								/>
							)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
};