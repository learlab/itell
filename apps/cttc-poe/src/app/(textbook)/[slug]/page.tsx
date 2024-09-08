import { ChatLoader } from "@/components/chat/chat-loader";
import { ConstructedResponseControl } from "@/components/constructed-response/constructed-response-control";
import { NoteCount } from "@/components/note/note-count";
import { NoteLoader } from "@/components/note/note-loader";
import { NoteToolbar } from "@/components/note/note-toolbar";
import { PageStatus } from "@/components/page-status/page-status";
import { PageStatusModal } from "@/components/page-status/page-status-modal";
import { PageProvider } from "@/components/provider/page-provider";
import { Spinner } from "@/components/spinner";
import { PageSummary } from "@/components/summary/page-summary";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/control/condition";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { allPagesSorted } from "@/lib/pages";
import { getRandomPageQuestions } from "@/lib/question";
import { Elements } from "@itell/constants";
import { Info } from "@itell/ui/callout";
import { ScrollArea } from "@itell/ui/scroll-area";
import { ChapterToc } from "@textbook/chapter-toc";
import { EventTracker } from "@textbook/event-tracker";
import { PageContent } from "@textbook/page-content";
import { PageTitle } from "@textbook/page-title";
import { PageToc } from "@textbook/page-toc";
import { Pager } from "@textbook/pager";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ({ params }: { params: { slug: string } }) {
	const { slug } = routes.textbook.$parseParams(params);
	const { user } = await getSession();
	const pageIndex = allPagesSorted.findIndex((page) => {
		return page.page_slug === slug;
	});

	if (pageIndex === -1) {
		return notFound();
	}

	const page = allPagesSorted[pageIndex];
	const pageSlug = page.page_slug;

	const chunks = getPageChunks(page.body.raw);

	const questions = await getRandomPageQuestions(pageSlug);
	const userRole = user?.role || "user";
	const userId = user?.id || null;
	const userFinished = user?.finished || false;
	const userPageSlug = user?.pageSlug || null;
	const userCondition = user?.condition || Condition.STAIRS;

	const pageStatus = getPageStatus({
		pageSlug,
		userPageSlug,
		userFinished,
	});

	return (
		<PageProvider
			pageSlug={pageSlug}
			pageTitle={page.title}
			chunks={chunks}
			questions={questions}
			pageStatus={pageStatus}
		>
			<main id={Elements.TEXTBOOK_MAIN_WRAPPER}>
				<div id={Elements.TEXTBOOK_NAV}>
					<ScrollArea className="h-full w-full px-6 py-6 lg:py-8">
						<ChapterToc
							userId={userId}
							currentPage={page}
							userPageSlug={userPageSlug}
							userFinished={userFinished}
							userRole={userRole}
							condition={userCondition}
						/>
					</ScrollArea>
				</div>

				<div id={Elements.TEXTBOOK_MAIN}>
					<PageTitle>{page.title}</PageTitle>
					{user?.condition === Condition.SIMPLE &&
						page._raw.sourceFileName === "index.mdx" && <ReadingStrategy />}
					<PageContent title={page.title} code={page.body.code} />
					<NoteToolbar pageSlug={pageSlug} userId={userId} />
					<Pager pageIndex={pageIndex} />
				</div>

				<aside id={Elements.PAGE_NAV} aria-label="table of contents">
					<div className="sticky top-20 -mt-10 pt-4">
						<ScrollArea className="pb-10">
							<div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] py-12 px-4">
								<PageToc headings={page.headings} />
								<div className="mt-8 flex flex-col gap-1">
									<PageStatus pageSlug={pageSlug} />
									<NoteCount />
								</div>
							</div>
						</ScrollArea>
					</div>
					<Suspense
						fallback={
							<p className="text-sm text-muted-foreground mt-8">
								<Spinner className="inline mr-2" />
								Loading notes
							</p>
						}
					>
						<NoteLoader userId={userId} pageSlug={pageSlug} />
					</Suspense>
				</aside>
			</main>

			{page.summary && user && (
				<PageSummary
					user={user}
					pageSlug={pageSlug}
					pageStatus={pageStatus}
					condition={userCondition}
				/>
			)}

			<PageStatusModal user={user} pageStatus={pageStatus} />
			<ConstructedResponseControl
				userId={userId}
				pageSlug={pageSlug}
				condition={userCondition}
			/>
			<EventTracker userId={userId} pageSlug={pageSlug} chunks={chunks} />
			<Suspense fallback={<ChatLoader.Skeleton />}>
				<ChatLoader pageSlug={pageSlug} user={user} />
			</Suspense>
		</PageProvider>
	);
}

const ReadingStrategy = () => {
	return (
		<Info className="prose prose-quoteless prose-neutral dark:prose-invert max-w-none">
			<p>
				There are a number of strategies that can be used when reading to better
				understand a text, including self-explanation. Self-explanation helps
				you monitor your reading and understanding. As you read this chapter,
				please use the following strategies to explain the text to yourself:
			</p>
			<ul>
				<li>Paraphrasing - Restating the text in your own words</li>
				<li>
					Elaboration - Comparing what is in the text to related knowledge
				</li>
				<li>Logic - Using common sense to make inferences</li>
				<li>Predicting - Thinking about what may come next in the text</li>
				<li>Bridging - Linking ideas between different parts of the text</li>
			</ul>
			<p>
				For example, after reading the sentence "In eukaryotic cells, or cells
				with a nucleus, the stages of the cell cycle are divided into two major
				phases: interphase and the mitotic (M) phase.", you could self-explain
				to yourself and make a prediction as follows "Okay, so those are the two
				phases. Now they're going to provide more details about the different
				phases."
			</p>
			<p>
				Using these strategies while reading have been shown to improve reading
				comprehension and overall learning.
			</p>
		</Info>
	);
};

const getPageChunks = (raw: string) => {
	const contentChunkRegex =
		/<section(?=\s)(?=[\s\S]*?\bclassName="content-chunk")(?=[\s\S]*?\bdata-subsection-id="([^"]+)")[\s\S]*?>/g;
	const chunks: string[] = [];

	const matches = raw.matchAll(contentChunkRegex);

	for (const match of matches) {
		if (match[1]) {
			chunks.push(match[1]);
		}
	}

	return chunks;
};
