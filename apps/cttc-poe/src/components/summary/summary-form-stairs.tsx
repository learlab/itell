"use client";

import { useSession, useSessionAction } from "@/lib/auth/context";
import { PAGE_SUMMARY_THRESHOLD } from "@/lib/constants";
import { Condition } from "@/lib/control/condition";
import { createEvent } from "@/lib/event/actions";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { getChatHistory } from "@/lib/store/chat";
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
	makePageHref,
	reportSentry,
	scrollToElement,
} from "@/lib/utils";
import { Elements } from "@itell/constants";
import {
	useDebounce,
	useKeystroke,
	usePortal,
	useTimer,
} from "@itell/core/hooks";
import { PortalContainer } from "@itell/core/portal-container";
import {
	ErrorFeedback,
	ErrorType,
	SummaryResponse,
	SummaryResponseSchema,
	validateSummary,
} from "@itell/core/summary";
import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { User } from "lucia";
import { FileQuestionIcon, SendHorizonalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Confetti from "react-dom-confetti";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useImmerReducer } from "use-immer";
import { ChatStairs } from "../chat/chat-stairs";
import { useChat, useConstructedResponse } from "../provider/page-provider";
import { NextPageButton } from "./next-page-button";
import { SummaryFeedback } from "./summary-feedback";
import {
	SummaryInput,
	getSummaryLocal,
	saveSummaryLocal,
} from "./summary-input";
import { getSurveyLink } from "./survey-link";

type Props = {
	user: User;
	page: PageData;
	pageStatus: PageStatus;
};

type StairsQuestion = {
	text: string;
	chunk: string;
	question_type: string;
};

type State = {
	prevInput: string | undefined;
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
	| { type: "stairs"; payload: StairsQuestion }
	| {
			type: "finish";
			payload: { canProceed: boolean | undefined; prevInput: string };
	  }
	| { type: "set_passed"; payload: boolean };

const driverObj = driver();

const exitQuestion = () => {
	driverObj.destroy();
	const assignments = document.getElementById(Elements.PAGE_ASSIGNMENTS);
	if (assignments) {
		setTimeout(() => {
			scrollToElement(assignments as HTMLElement);
		}, 100);
	}
};

const goToQuestion = (question: StairsQuestion) => {
	const el = getChunkElement(question.chunk);
	if (el) {
		setTimeout(() => {
			scrollToElement(el);
		}, 100);
		driverObj.highlight({
			element: el,
			popover: {
				description:
					"Please re-read the highlighted section. After re-reading, you will be asked a question to assess your understanding. When you are finished, press the 'return to summary' button",
			},
		});
	} else {
		toast.warning(
			"No question found, please revise your summary or move on to the next page",
		);
	}
};

export const SummaryFormStairs = ({ user, page, pageStatus }: Props) => {
	const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
	const initialState: State = {
		prevInput: undefined,
		error: null,
		response: null,
		stairsQuestion: null,
		isPassed: false,
		canProceed: pageStatus.unlocked,
	};
	const { updateUser } = useSessionAction();
	const session = useSession();
	const isTextbookFinished = session.user?.finished || false;

	const pageSlug = page.page_slug;
	const { addStairsQuestion, messages } = useChat((state) => {
		return {
			addStairsQuestion: state.addStairsQuestion,
			messages: state.messages,
		};
	});
	const getExcludedChunks = useConstructedResponse(
		(state) => state.getExcludedChunks,
	);
	const [state, dispatch] = useImmerReducer<State, Action>((draft, action) => {
		switch (action.type) {
			case "submit":
				draft.error = null;
				break;
			case "fail":
				draft.error = action.payload;
				draft.response = null;
				break;
			case "scored":
				draft.response = action.payload;
				break;
			case "set_passed":
				draft.isPassed = action.payload;
				break;
			case "stairs":
				draft.stairsQuestion = action.payload;
				break;
			case "finish":
				if (action.payload.canProceed !== undefined) {
					draft.canProceed = action.payload.canProceed;
				}
				draft.prevInput = action.payload.prevInput;
				break;
		}
	}, initialState);

	const { portals, addPortal, removePortal } = usePortal();
	const isSummaryReady = useConstructedResponse(
		(state) => state.isSummaryReady,
	);
	const router = useRouter();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const feedback = state.response ? getFeedback(state.response) : null;

	const requestBodyRef = useRef<string | null>(null);
	const summaryResponseRef = useRef<SummaryResponse | null>(null);
	const stairsDataRef = useRef<StairsQuestion | null>(null);
	const stairsAnsweredRef = useRef(false);

	const portalId = useRef<string | null>(null);

	useEffect(() => {
		driverObj.setConfig({
			smoothScroll: false,
			animate: false,
			allowClose: false,
			onPopoverRender: (popover) => {
				portalId.current = addPortal(
					<ChatStairs
						userId={user.id}
						userImage={user.image}
						userName={user.name}
						pageSlug={pageSlug}
						RenderFooter={() => (
							<FinishReadingButton
								onClick={(time) => {
									// only create stairs event for first attempt
									// can't use stairsAnswered here because it's always set to true before the button is shown
									if (!stairsAnsweredRef.current) {
										stairsAnsweredRef.current = true;
										createEvent({
											type: Condition.STAIRS,
											pageSlug,
											userId: user.id,
											data: {
												stairs: stairsDataRef.current,
												time,
											},
										});
									}
									exitQuestion();
									if (portalId.current) {
										removePortal(portalId.current);
									}
								}}
							/>
						)}
					/>,
					popover.wrapper,
				);
			},
		});
	}, []);

	const {
		action,
		isPending: _isPending,
		isDelayed,
		isError,
		error,
	} = useActionStatus(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();
			clearStages();

			dispatch({ type: "submit" });
			addStage("Scoring");

			const formData = new FormData(e.currentTarget);
			const input = String(formData.get("input")).replaceAll("\u0000", "");

			const userId = user.id;
			saveSummaryLocal(pageSlug, input);

			const error = validateSummary(input, state.prevInput);

			if (error) {
				dispatch({ type: "fail", payload: error });
				return;
			}

			const summaryCount = await countUserPageSummary(userId, pageSlug);
			const isEnoughSummary = summaryCount + 1 >= PAGE_SUMMARY_THRESHOLD;

			const focusTime = await findFocusTime(userId, pageSlug);
			const body = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
				focus_time: focusTime?.data,
				chat_history: getChatHistory(messages),
				excluded_chunks: getExcludedChunks(),
			});
			requestBodyRef.current = body;
			const response = await fetch("/api/itell/score/stairs", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body,
			});

			if (response.ok && response.body) {
				const reader = response.body.getReader();
				const decoder = new TextDecoder();
				let done = false;
				let chunkIndex = 0;
				let stairsChunk: string | null = null;

				while (!done) {
					const { value, done: doneReading } = await reader.read();
					done = doneReading;
					const chunk = decoder.decode(value, { stream: true });

					if (chunkIndex === 0) {
						const data = chunk
							.trim()
							.split("\n")
							.at(1)
							?.replace(/data:\s+/, "");

						console.log("summary response chunk", data);

						const parsed = SummaryResponseSchema.safeParse(
							JSON.parse(String(data)),
						);
						if (parsed.success) {
							summaryResponseRef.current = parsed.data;
							dispatch({
								type: "set_passed",
								payload: parsed.data.is_passed || isEnoughSummary,
							});
							dispatch({ type: "scored", payload: parsed.data });
							finishStage("Scoring");
						} else {
							clearStages();
							dispatch({ type: "fail", payload: ErrorType.INTERNAL });
							// summaryResponse parsing failed, return early
							reportSentry("parse summary stairs", {
								body,
								chunk: data,
							});
							return;
						}
					} else {
						if (summaryResponseRef.current?.is_passed) {
							// if the summary passed, we don't need to process later chunks
							// note that if the user pass by summary amount
							// question will still be generated but will not be asked
							// they can still see the "question" button
							break;
						}

						if (chunkIndex === 1) {
							addStage("Analyzing");
						}
						if (chunk) {
							stairsChunk = chunk;
						}
					}

					chunkIndex++;
				}

				if (stairsChunk) {
					const regex = /data: ({"request_id":.*?})\n*/;
					const match = stairsChunk.trim().match(regex);
					console.log("final stairs chunk\n", stairsChunk);
					if (match?.[1]) {
						const stairsString = match[1];
						console.log("parsed as", stairsString);
						const stairsData = JSON.parse(stairsString) as StairsQuestion;
						stairsDataRef.current = stairsData;
						finishStage("Analyzing");
						addStairsQuestion(stairsData);
					} else {
						throw new Error("invalid stairs chunk");
					}
				}
			} else {
				throw new Error("invalid response");
			}

			if (summaryResponseRef.current) {
				const scores = summaryResponseRef.current;
				addStage("Saving");
				const shouldUpdateUser = scores.is_passed || isEnoughSummary;
				const { summaryId } = await createSummary({
					text: input,
					userId: user.id,
					pageSlug,
					condition: Condition.STAIRS,
					isPassed: scores.is_passed || false,
					containmentScore: scores.containment,
					similarityScore: scores.similarity,
					languageScore: scores.language,
					contentScore: scores.content,
				});

				createEvent({
					type: "keystroke",
					pageSlug,
					userId,
					data: {
						summaryId,
						start: state.prevInput
							? state.prevInput
							: getSummaryLocal(pageSlug),
						keystrokes,
					},
				}).then(clearKeystroke);

				finishStage("Saving");

				if (shouldUpdateUser) {
					const nextSlug = await incrementUserPage(user.id, pageSlug);
					if (isLastPage(pageSlug)) {
						updateUser({ finished: true });
						toast.info(
							"You have finished the entire textbook! Redirecting to the outtake survey.",
						);

						setTimeout(() => {
							window.location.href = getSurveyLink(user);
						}, 3000);
					} else {
						updateUser({ pageSlug: nextSlug });
						// check if we can already proceed to prevent excessive toasts
						if (!state.canProceed) {
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
					}
				}

				dispatch({
					type: "finish",
					payload: {
						canProceed: shouldUpdateUser ? !isLastPage(pageSlug) : undefined,
						prevInput: input,
					},
				});

				if (stairsDataRef.current) {
					dispatch({ type: "stairs", payload: stairsDataRef.current });
					if (!shouldUpdateUser && !pageStatus.unlocked) {
						goToQuestion(stairsDataRef.current);
					}
				}
			}
		},
		{ delayTimeout: 20000 },
	);

	const isPending = useDebounce(_isPending, 100);

	useEffect(() => {
		if (isError) {
			dispatch({ type: "fail", payload: ErrorType.INTERNAL });
			clearStages();
			reportSentry("score summary stairs", {
				body: requestBodyRef.current,
				summaryResponse: summaryResponseRef.current,
				stairsData: stairsDataRef.current,
				error,
			});
		}
	}, [isError]);

	return (
		<>
			<PortalContainer portals={portals} />
			<div className="space-y-2">
				<SummaryFeedback
					className={isPending ? "opacity-70" : ""}
					feedback={feedback}
					needRevision={
						isLastPage(pageSlug) ? !isTextbookFinished : !state.canProceed
					}
				/>

				<div className="flex gap-2 items-center">
					{state.canProceed && page.nextPageSlug && (
						<NextPageButton pageSlug={page.nextPageSlug} />
					)}
					{state.stairsQuestion && (
						<Button
							variant={"outline"}
							onClick={() =>
								goToQuestion(state.stairsQuestion as StairsQuestion)
							}
						>
							<span className="inline-flex items-center justify-center gap-2">
								<FileQuestionIcon className="size-4" />
								<span>See question</span>
							</span>
						</Button>
					)}
				</div>

				<Confetti active={feedback?.isPassed || false} />

				<h2 className="sr-only" id="summarization-form-heading">
					summarization
				</h2>
				<form
					aria-labelledby="summarization-form-heading"
					className="mt-2 space-y-4"
					onSubmit={action}
				>
					<SummaryInput
						disabled={!isSummaryReady}
						pageSlug={pageSlug}
						pending={isPending}
						stages={stages}
						userRole={user.role}
						ref={ref}
					/>
					{state.error && <Warning>{ErrorFeedback[state.error]}</Warning>}
					<div className="flex justify-end">
						<StatusButton disabled={!isSummaryReady} pending={isPending}>
							<span className="inline-flex items-center justify-center gap-2">
								<SendHorizonalIcon className="size-4" />
								Submit
							</span>
						</StatusButton>
					</div>
				</form>
				{isDelayed && (
					<p className="text-sm">
						The request is taking longer than usual, if this keeps loading
						without a response, please try refreshing the page. If the problem
						persists, please report to lear.lab.vu@gmail.com.
					</p>
				)}
			</div>
		</>
	);
};

const FinishReadingButton = ({
	onClick,
}: { onClick: (val: number) => void }) => {
	const stairsAnswered = useChat((store) => store.stairsAnswered);
	const { time, clearTimer } = useTimer();

	return (
		<div className="flex justify-end mt-4">
			<Button
				size="sm"
				disabled={!stairsAnswered}
				onClick={() => {
					onClick(time);
					clearTimer();
				}}
			>
				Return to summary
			</Button>
		</div>
	);
};
