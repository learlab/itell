"use client";

import { useConstructedResponse } from "@/components/provider/page-provider";
import { clearSummaryLocal } from "@/components/summary/summary-input";
import { isAdmin } from "@/lib/auth/role";
import { isProduction } from "@/lib/constants";
import { Condition } from "@/lib/control/condition";
import { getPageStatus } from "@/lib/page-status";
import { tocChapters } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";
import { cn } from "@itell/utils";

import { Elements } from "@itell/constants";
import { Button, buttonVariants } from "@itell/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@itell/ui/collapsible";

import { Page } from "contentlayer/generated";
import {
	ArrowUpIcon,
	ChevronsUpDown,
	PencilIcon,
	RotateCcwIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AdminTools } from "./admin-tools";

const AnchorLink = ({
	text,
	href,
	icon,
}: {
	text: string;
	href: string;
	icon: React.ReactNode;
}) => {
	return (
		<a
			href={href}
			className={cn(
				buttonVariants({ variant: "ghost" }),
				"flex items-center justify-start gap-2 px-1 py-2",
			)}
		>
			{icon}
			{text}
		</a>
	);
};

type Props = {
	currentPage: Page;
	userId: string | null;
	userRole: string;
	userFinished: boolean;
	userPageSlug: string | null;
	condition: string;
};

export const ChapterToc = ({
	currentPage,
	userId,
	userRole,
	userPageSlug,
	userFinished,
	condition,
}: Props) => {
	const [activePage, setActivePage] = useState(currentPage.page_slug);
	const [pending, startTransition] = useTransition();
	const router = useRouter();

	const navigatePage = (pageSlug: string) => {
		setActivePage(pageSlug);
		startTransition(async () => {
			router.push(makePageHref(pageSlug));
		});
	};

	return (
		<>
			<nav aria-label="textbook primary">
				<ol className="space-y-2 leading-relaxed tracking-tight">
					{tocChapters.map((chapter) => {
						return (
							<Collapsible
								key={chapter.page_slug}
								defaultOpen={currentPage.chapter === chapter.chapter}
							>
								<CollapsibleTrigger asChild>
									<div className="flex items-center gap-2">
										<Link
											href={makePageHref(chapter.page_slug)}
											className="flex px-1 py-2 items-center"
										>
											<p className="text-lg xl:text-xl 2xl:text-2xl text-balance">
												{chapter.title}
											</p>
										</Link>
										<Button variant={"ghost"}>
											<ChevronsUpDown className="size-4" />
											<span className="sr-only">Toggle</span>
										</Button>
									</div>
								</CollapsibleTrigger>

								<CollapsibleContent>
									<ol className="text-sm">
										{chapter.items.map((item) => {
											const { latest, unlocked } = getPageStatus({
												pageSlug: item.page_slug,
												userPageSlug,
												userFinished,
											});
											const visible = latest || unlocked;
											return (
												<li
													className={cn(
														"relative p-2 text-foreground hover:bg-accent border-l-2",
														{
															"bg-accent font-semibold":
																item.page_slug === activePage,
															"text-muted-foreground": !visible,
														},
													)}
													key={item.page_slug}
												>
													<button
														type="button"
														onClick={() => navigatePage(item.page_slug)}
														disabled={(pending || !visible) && isProduction}
														className={cn(
															"w-full text-left text-balance tracking-tight inline-flex items-end justify-between gap-1 text-base xl:text-lg 2xl:text-xl",
															{
																"animate-pulse": pending,
															},
														)}
													>
														<span>{item.title}</span>
														<span className="hidden xl:inline">
															{unlocked ? "✅" : visible ? "" : "🔒"}
														</span>
													</button>
												</li>
											);
										})}
									</ol>
								</CollapsibleContent>
							</Collapsible>
						);
					})}
				</ol>
			</nav>
			<div className="mt-12 space-y-2">
				{isAdmin(userRole) && userId && (
					<AdminTools userId={userId} condition={condition} />
				)}
				<RestartPageButton pageSlug={currentPage.page_slug} />
				{currentPage.summary && condition !== Condition.SIMPLE && (
					<AnchorLink
						icon={<PencilIcon className="size-4" />}
						text="Write a summary"
						href={`#${Elements.PAGE_ASSIGNMENTS}`}
					/>
				)}
				<AnchorLink
					icon={<ArrowUpIcon className="size-4" />}
					text="Back to top"
					href={"#page-title"}
				/>
			</div>
		</>
	);
};

const RestartPageButton = ({ pageSlug }: { pageSlug: string }) => {
	const [pending, startTransition] = useTransition();
	const resetPage = useConstructedResponse((state) => state.resetPage);
	return (
		<Button
			className="flex justify-start items-center gap-2 px-1 py-2 w-full"
			variant={"ghost"}
			onClick={() => {
				startTransition(() => {
					resetPage();
					clearSummaryLocal(pageSlug);
					window.location.reload();
				});
			}}
			pending={pending}
			disabled={pending}
		>
			<span className="inline-flex items-center justify-center gap-2">
				<RotateCcwIcon className="size-4" />
				Reset page
			</span>
		</Button>
	);
};
