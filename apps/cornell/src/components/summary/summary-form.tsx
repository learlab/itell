"use client";

import { SessionUser } from "@/lib/auth";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { createEvent } from "@/lib/event/actions";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { getChatHistory, useChatStore } from "@/lib/store/chat";
import { FeedbackType } from "@/lib/store/config";
import {
	countUserPageSummary,
	createSummary,
	findFocusTime,
} from "@/lib/summary/actions";
import { getFeedback } from "@/lib/summary/feedback";
import { incrementUserPage } from "@/lib/user/actions";
import {
	PageData,
	getChunkElement,
	makeInputKey,
	makePageHref,
	scrollToElement,
} from "@/lib/utils";
import { usePortal } from "@itell/core/hooks";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
	validateSummary,
} from "@itell/core/summary";
import { Warning, buttonVariants } from "@itell/ui/server";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useImmerReducer } from "use-immer";
import { ChatStairs } from "../chat/chat-stairs";
import { Button } from "../client-components";
import { useConstructedResponse } from "../provider/page-provider";
import { SummaryFeedback } from "./summary-feedback";
import { SummaryInput, saveSummaryLocal } from "./summary-input";
import { SummarySubmitButton } from "./summary-submit-button";

type Props = {
	value?: string;
	user: NonNullable<SessionUser>;
	page: PageData;
	pageStatus: PageStatus;
	feedbackType: FeedbackType;
};

type StairsQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

type State = {
	prevInput: string;
	pending: boolean;
	isPassed: boolean;
	error: ErrorType | null;
	response: SummaryResponse | null;
	stairsQuestion: StairsQuestion | null;
	canProceed: boolean;
};

type Action =
	| { type: "submit" }
	| { type: "fail"; payload: ErrorType }
	| { type: "scored"; payload: SummaryResponse }
	| { type: "ask"; payload: StairsQuestion }
	| { type: "finish"; payload: { canProceed: boolean } }
	| { type: "set_passed"; payload: boolean }
	| { type: "set_prev_input"; payload: string };

const initialState: State = {
	prevInput: "",
	pending: false,
	error: null,
	response: null,
	stairsQuestion: null,
	isPassed: false,
	canProceed: false,
};

const driverObj = driver();

const exitQuestion = () => {
	const summaryEl = document.querySelector("#page-summary");

	driverObj.destroy();

	if (summaryEl) {
		scrollToElement(summaryEl as HTMLDivElement);
	}
};

export const SummaryForm = ({
	value,
	user,
	page,
	pageStatus,
	feedbackType,
}: Props) => {
	const pageSlug = page.page_slug;
	const mounted = useRef(false);

	const { stairsAnswered, addStairsQuestion, messages } = useChatStore(
		(state) => ({
			stairsAnswered: state.stairsAnswered,
			addStairsQuestion: state.addStairsQuestion,
			messages: state.messages,
		}),
	);
	const excludedChunks = useConstructedResponse(
		(state) => state.excludedChunks,
	);
	const [state, dispatch] = useImmerReducer<State, Action>((draft, action) => {
		switch (action.type) {
			case "set_prev_input":
				draft.prevInput = action.payload;
				break;
			case "submit":
				draft.pending = true;
				draft.error = null;
				draft.response = null;
				draft.stairsQuestion = null;
				break;
			case "fail":
				draft.pending = false;
				draft.error = action.payload;
				draft.response = null;
				break;
			case "scored":
				draft.response = action.payload;
				break;
			case "set_passed":
				draft.isPassed = action.payload;
				break;
			case "ask":
				draft.stairsQuestion = action.payload;
				draft.pending = false;
				break;
			case "finish":
				draft.pending = false;
				draft.canProceed = action.payload.canProceed;
				break;
		}
	}, initialState);
	const { nodes: portalNodes, addNode } = usePortal();
	const router = useRouter();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const feedback = state.response ? getFeedback(state.response) : null;

	const goToQuestion = (question: StairsQuestion) => {
		const el = getChunkElement(question.chunk);
		if (el) {
			scrollToElement(el);

			setTimeout(() => {
				driverObj.highlight({
					element: el,
					popover: {
						description:
							feedbackType === "stairs"
								? "Please re-read the highlighted chunk. After re-reading, you will be asked a question to assess your understanding."
								: 'Please re-read the highlighted chunk. when you are finished, press the "return to summary" button.',
						side: "left",
						align: "start",
					},
				});
			}, 1000);
		} else {
			toast.warning(
				"No question found, please revise your summary or move on to the next page",
			);
		}
	};

	useEffect(() => {
		driverObj.setConfig({
			smoothScroll: false,
			onPopoverRender: (popover) => {
				if (feedbackType === "stairs") {
					addNode(
						<ChatStairs
							user={user}
							pageSlug={pageSlug}
							onExit={exitQuestion}
						/>,
						popover.wrapper,
					);
				}

				if (feedbackType === "simple") {
					addNode(
						<Button onClick={exitQuestion} size="sm" className="mt-4">
							Return to summary
						</Button>,
						popover.wrapper,
					);
				}
			},
			onDestroyStarted: () => {
				if (!stairsAnswered) {
					return toast.warning("Please answer the question to continue");
				}

				exitQuestion();
			},
		});
	}, [feedbackType]);

	useEffect(() => {
		if (state.stairsQuestion && !state.isPassed && !state.error) {
			goToQuestion(state.stairsQuestion);
		}

		if (state.canProceed && !state.error) {
			const title = feedback?.isPassed
				? "Good job summarizing 🎉"
				: "You can now move on 👏";
			toast(title, {
				className: "toast",
				description: "Move to the next page to continue reading",
				duration: 5000,
				action: page.nextPageSlug
					? {
							label: "Proceed",
							onClick: () => {
								router.push(makePageHref(page.nextPageSlug as string));
							},
					  }
					: undefined,
			});
		}
	}, [state]);

	useEffect(() => {
		mounted.current = true;
	}, []);

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		clearStages();

		dispatch({ type: "submit" });
		addStage("Scoring");

		const formData = new FormData(e.currentTarget);
		const input = String(formData.get("input")).replaceAll("\u0000", "");
		if (input === state.prevInput) {
			dispatch({ type: "fail", payload: ErrorType.DUPLICATE });
			return;
		}

		dispatch({ type: "set_prev_input", payload: input });

		const userId = user.id;
		saveSummaryLocal(pageSlug, input);

		const error = validateSummary(input);
		if (error) {
			dispatch({ type: "fail", payload: error });
			return;
		}

		const summaryCount = await countUserPageSummary(userId, pageSlug);
		const isEnoughSummary = summaryCount + 1 >= PAGE_SUMMARY_THRESHOLD;

		let summaryResponse: SummaryResponse | null = null;
		let stairsData: StairsQuestion | null = null;

		try {
			const focusTime = await findFocusTime(userId, pageSlug);
			const requestBody = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
				focus_time: focusTime?.data,
				chat_history: getChatHistory(messages),
				excluded_chunks: excludedChunks,
			});
			const response = await fetch(
				"https://itell-api.learlab.vanderbilt.edu/score/summary/stairs",
				{
					method: "POST",
					body: requestBody,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
			console.log("request body", requestBody);

			if (response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let done = false;
				let chunkIndex = 0;
				let stairsString: string | null = null;

				while (!done) {
					const { value, done: doneReading } = await reader.read();
					done = doneReading;
					const chunk = decoder.decode(value);

					if (chunkIndex === 0) {
						const chunkString = chunk.trim().replaceAll("\u0000", "");
						console.log("chunkString", chunkString);
						const parsed = SummaryResponseSchema.safeParse(
							JSON.parse(chunkString),
						);
						if (parsed.success) {
							summaryResponse = parsed.data;
							dispatch({
								type: "set_passed",
								payload: summaryResponse.is_passed || isEnoughSummary,
							});
							dispatch({ type: "scored", payload: parsed.data });
							finishStage("Scoring");
						} else {
							console.log("SummaryResults parse error", parsed.error);
							clearStages();
							dispatch({ type: "fail", payload: ErrorType.INTERNAL });
							// summaryResponse parsing failed, return early
							return;
						}
					} else {
						if (summaryResponse?.is_passed) {
							// if the summary passed, we don't need to process later chunks
							// note that if the user pass by summary amount
							// question will still be generated but will not be asked
							// they can still see the "question" button
							break;
						}

						if (chunkIndex === 1) {
							addStage("Analyzing");
						}
						if (!done) {
							stairsString = chunk.trim().replaceAll("\u0000", "");
						} else {
							if (stairsString) {
								stairsData = JSON.parse(stairsString) as StairsQuestion;
								finishStage("Analyzing");
								addStairsQuestion(stairsData);

								createEvent({
									eventType: "stairs-question",
									pageSlug,
									data: stairsData,
								});
							}
						}
					}

					chunkIndex++;
				}
			}

			if (summaryResponse) {
				addStage("Saving");
				await createSummary({
					text: input,
					pageSlug,
					response: summaryResponse,
				});

				if (summaryResponse.is_passed || isEnoughSummary) {
					await incrementUserPage(userId, pageSlug);
					dispatch({
						type: "finish",
						payload: { canProceed: !isLastPage(pageSlug) },
					});
				}
				finishStage("Saving");

				if (stairsData) {
					dispatch({ type: "ask", payload: stairsData });
				}
			}
		} catch (err) {
			console.log("summary scoring error", err);
			clearStages();
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });
		}
	};

	const isPageFinished = useConstructedResponse(
		(state) => state.isPageFinished,
	);
	const editDisabled = pageStatus.isPageUnlocked ? false : !isPageFinished;

	return (
		<section className="space-y-2">
			{portalNodes}
			<div className="flex gap-2 items-center">
				{state.canProceed && page.nextPageSlug && (
					<Link
						href={page.nextPageSlug}
						className={buttonVariants({ variant: "outline" })}
					>
						Go to next page
					</Link>
				)}
				{state.stairsQuestion && (
					<Button
						variant={"outline"}
						onClick={() => goToQuestion(state.stairsQuestion as StairsQuestion)}
					>
						{feedbackType === "stairs" ? "See question" : "See re-read chunk"}
					</Button>
				)}
			</div>

			{feedback && <SummaryFeedback feedback={feedback} />}

			<Confetti
				active={feedback?.isPassed ? feedbackType === "stairs" : false}
			/>
			<form className="mt-2 space-y-4" onSubmit={onSubmit}>
				<SummaryInput
					value={value}
					disabled={editDisabled || state.pending}
					pageSlug={pageSlug}
					pending={state.pending}
					stages={stages}
				/>
				{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
				<div className="flex justify-end">
					<SummarySubmitButton
						disabled={!isPageFinished}
						pending={state.pending}
					/>
				</div>
			</form>
		</section>
	);
};
