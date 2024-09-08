"use client";

import { useSessionAction } from "@/lib/auth/context";
import { Condition } from "@/lib/control/condition";
import { createEvent } from "@/lib/event/actions";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { createSummary } from "@/lib/summary/actions";
import { incrementUserPage } from "@/lib/user/actions";
import {
	PageData,
	getChunkElement,
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
} from "@itell/core/summary";
import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { User } from "lucia";
import { SendHorizonalIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";
import { useConstructedResponse } from "../provider/page-provider";
import { NextPageButton } from "./next-page-button";
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

export const SummaryFormReread = ({ user, page, pageStatus }: Props) => {
	const pageSlug = page.page_slug;
	const prevInput = useRef<string | undefined>();
	const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
	const [finished, setFinished] = useState(pageStatus.unlocked);
	const { chunks } = useConstructedResponse((state) => ({
		chunks: state.chunkSlugs,
	}));

	const randomChunkSlug = useMemo(() => {
		// skip first chunk, which is typically learning objectives
		const validChunks = chunks.slice(1);
		return validChunks[Math.floor(Math.random() * validChunks.length)];
	}, []);

	const { portals, addPortal, removePortal } = usePortal();
	const { addStage, clearStages, finishStage, stages } = useSummaryStage();
	const { updateUser } = useSessionAction();
	const requestBodyRef = useRef<string>("");
	const summaryResponseRef = useRef<SummaryResponse | null>(null);
	const isSummaryReady = useConstructedResponse(
		(state) => state.isSummaryReady,
	);

	const portalId = useRef<string | null>(null);

	useEffect(() => {
		driverObj.setConfig({
			animate: false,
			smoothScroll: false,
			onPopoverRender: (popover) => {
				portalId.current = addPortal(
					<FinishReadingButton
						onClick={(time) => {
							exitQuestion();

							if (!pageStatus.unlocked) {
								createEvent({
									type: Condition.RANDOM_REREAD,
									pageSlug,
									userId: user.id,
									data: { chunkSlug: randomChunkSlug, time },
								});
							}

							if (portalId.current) {
								removePortal(portalId.current);
							}
						}}
					/>,
					popover.wrapper,
				);
			},
			onDestroyStarted: () => {
				return toast.warning("Please finish rereading before moving on");
			},
		});
	}, []);

	const {
		status,
		isError,
		isDelayed,
		isPending: _isPending,
		action,
		error,
	} = useActionStatus(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault();

			clearStages();
			addStage("Saving");

			const formData = new FormData(e.currentTarget);
			const input = String(formData.get("input")).replaceAll("\u0000", "");

			saveSummaryLocal(pageSlug, input);
			requestBodyRef.current = JSON.stringify({
				summary: input,
				page_slug: pageSlug,
			});
			console.log("requestBody", requestBodyRef.current);
			const response = await fetch("/api/itell/score/summary", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: requestBodyRef.current,
			});
			const json = await response.json();
			const parsed = SummaryResponseSchema.safeParse(json);
			if (!parsed.success) {
				throw parsed.error;
			}
			const scores = parsed.data;
			summaryResponseRef.current = scores;

			const { summaryId } = await createSummary({
				text: input,
				userId: user.id,
				pageSlug,
				condition: Condition.RANDOM_REREAD,
				isPassed: scores.is_passed || false,
				containmentScore: scores.containment,
				similarityScore: scores.similarity,
				languageScore: scores.language,
				contentScore: scores.content,
			});

			createEvent({
				type: "keystroke",
				pageSlug,
				userId: user.id,
				data: {
					summaryId,
					start: prevInput.current
						? prevInput.current
						: getSummaryLocal(pageSlug),
					keystrokes,
				},
			}).then(clearKeystroke);

			const nextSlug = await incrementUserPage(user.id, pageSlug);
			finishStage("Saving");
			setFinished(true);
			prevInput.current = input;

			if (isLastPage(pageSlug)) {
				updateUser({ finished: true });
				toast.info(
					"You have finished the entire textbook! Redirecting to the outtake survey.",
				);

				setTimeout(() => {
					window.location.href = getSurveyLink(user);
				}, 3000);
				return;
			}

			updateUser({ pageSlug: nextSlug });

			// 25% random rereading if the page is not unlocked
			if (!pageStatus.unlocked && Math.random() <= 0.25) {
				goToRandomChunk(randomChunkSlug);
			}
		},
		{ delayTimeout: 10000 },
	);

	const isPending = useDebounce(_isPending, 100);

	useEffect(() => {
		if (isError) {
			finishStage("Analyzing");
			clearStages();

			reportSentry("score summary reread", {
				body: requestBodyRef.current,
				response: summaryResponseRef.current,
				error,
			});
		}
	}, [isError]);

	return (
		<>
			<PortalContainer portals={portals} />
			<div className="space-y-2">
				{finished && page.nextPageSlug && (
					<div className="space-y-2 space-x-2">
						<p>
							You have finished this page. You can choose to refine your summary
							or move on to the next page.
						</p>
						<NextPageButton pageSlug={page.nextPageSlug} />
					</div>
				)}

				<h2 className="sr-only" id="summarization-form-heading">
					summarization
				</h2>
				<form
					aria-labelledby="summarization-form-heading"
					className="space-y-4"
					onSubmit={action}
				>
					<SummaryInput
						disabled={isPending || !isSummaryReady}
						pageSlug={pageSlug}
						pending={isPending}
						stages={stages}
						userRole={user.role}
						ref={ref}
					/>
					{isError && <Warning>{ErrorFeedback[ErrorType.INTERNAL]}</Warning>}
					{isDelayed && (
						<p className="text-sm">
							The request is taking longer than usual, if this keeps loading
							without a response, please try refreshing the page. If the problem
							persists, please report to lear.lab.vu@gmail.com.
						</p>
					)}
					<div className="flex justify-end">
						<StatusButton disabled={!isSummaryReady} pending={isPending}>
							<span className="inline-flex items-center justify-center gap-2">
								<SendHorizonalIcon className="size-4" />
								Submit
							</span>
						</StatusButton>
					</div>
				</form>
			</div>
		</>
	);
};

const FinishReadingButton = ({
	onClick,
}: { onClick: (time: number) => void }) => {
	const { time, clearTimer } = useTimer();

	return (
		<Button
			onClick={() => {
				onClick(time);
				clearTimer();
			}}
			size="sm"
			className="mt-4"
		>
			I finished rereading
		</Button>
	);
};

const driverObj = driver();

const goToRandomChunk = (chunkSlug: string) => {
	const el = getChunkElement(chunkSlug);
	if (el) {
		setTimeout(() => {
			scrollToElement(el);
		}, 100);
		driverObj.highlight({
			element: el,
			popover: {
				description:
					'Please re-read the highlighted section. when you are finished, press the "I finished rereading" button.',
				side: "right",
				align: "start",
			},
		});
	}
};

const exitQuestion = () => {
	const assignemnts = document.getElementById(Elements.PAGE_ASSIGNMENTS);
	driverObj.destroy();

	if (assignemnts) {
		setTimeout(() => {
			scrollToElement(assignemnts as HTMLDivElement);
		}, 100);
	}
};
