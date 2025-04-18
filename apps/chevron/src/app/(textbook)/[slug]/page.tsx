import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Elements } from "@itell/constants";
import { PageTitle } from "@itell/ui/page-title";
import { ScrollArea } from "@itell/ui/scroll-area";
import { ChatLoader } from "@textbook/chat-loader";
import { ChunkControl } from "@textbook/cri/chunk-control";
import { EventTracker } from "@textbook/event-tracker";
import { NoteLoader } from "@textbook/note/note-loader";
import { PageAssignments } from "@textbook/page-assignments";
import { PageContent } from "@textbook/page-content";
import { PageStatusModal } from "@textbook/page-status-modal";
import { Pager } from "@textbook/pager";
import { SelectionPopover } from "@textbook/selection-popover";
import { TextbookToc } from "@textbook/textbook-toc";

import { PageProvider } from "@/components/provider/page-provider";
import { ScreenIssuePopup } from "@/components/screen-issue-popup";
import { isOuttakeReady } from "@/db/offboarding";
import { getSession } from "@/lib/auth";
import { getUserCondition } from "@/lib/auth/conditions";
import {
  Condition,
  isProduction,
  PAGE_HEADER_PIN_COOKIE,
} from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getPageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { firstPage, getPage } from "@/lib/pages/pages.server";
import { PageContentWrapper } from "./page-content-wrapper";
import { PageHeader } from "./page-header";
import { TextbookWrapper } from "./textbook-wrapper";
import { ScormPageTracker } from "./_components/scorm-page-tracker";

const ResourceLoader = dynamic(() =>
  import("./resource-loader").then((mod) => mod.ResourceLoader)
);

export default async function Page(props: {
  params: Promise<unknown>;
  searchParams: Promise<unknown>;
}) {
  const params = await props.params;
  const { slug } = routes.textbook.$parseParams(params);
  const page = getPage(slug);
  if (!page) {
    return notFound();
  }

  const pageSlug = page.slug;
  const session = await getSession();
  const user = session.user;

  if (user && !user.onboardingFinished) {
    return redirect(routes.onboarding());
  }

  // NOTE: only redirect to offboarding on last page
  if (user && isLastPage(page) && isOuttakeReady(user)) {
    return redirect(routes.offboarding());
  }

  const userId = user?.id ?? null;
  const userFinished = user?.finished ?? false;
  const userPageSlug = user?.pageSlug ?? null;
  const userCondition = user
    ? getUserCondition(user, pageSlug)
    : Condition.STAIRS;
  const pageStatus = getPageStatus({
    pageSlug,
    userPageSlug,
    userFinished,
  });

  return (
    <PageProvider
      session={session}
      condition={userCondition}
      page={page}
      pageStatus={pageStatus}
    >
      <ScreenIssuePopup />
      <ResourceLoader condition={userCondition} />
      <TextbookWrapper>
        <div id={Elements.TEXTBOOK_NAV}>
          <ScrollArea className="h-full w-full px-6 py-2">
            <TextbookToc
              page={page}
              userPageSlug={userPageSlug}
              userFinished={userFinished}
            />
          </ScrollArea>
        </div>

        <PageContentWrapper>
          <PageHeader
            page={page}
            pageStatus={pageStatus}
            hide={
              (await cookies()).get(PAGE_HEADER_PIN_COOKIE)?.value === "true"
            }
          />
          <div className="col-span-1 col-start-2 mt-4 flex flex-col gap-4">
            <PageTitle>{page.title}</PageTitle>
            <PageContent title={page.title} html={page.html} />
            <SelectionPopover user={user} pageSlug={pageSlug} />
            {page.last_modified ? (
              <p className="text-muted-foreground text-right text-sm">
                <span>Last updated at </span>
                <time>{page.last_modified}</time>
              </p>
            ) : null}

            {user ? (
              <Suspense fallback={<PageAssignments.Skeleton />}>
                <PageAssignments
                  page={page}
                  pageStatus={pageStatus}
                  user={user}
                  condition={userCondition}
                />
              </Suspense>
            ) : null}
            <Pager
              pageIndex={page.order}
              userPageSlug={user?.pageSlug ?? null}
            />
          </div>
        </PageContentWrapper>
      </TextbookWrapper>

      <Suspense fallback={<ChatLoader.Skeleton />}>
        <ChatLoader user={user} pageSlug={pageSlug} />
      </Suspense>

      {user ? <NoteLoader userId={user.id} pageSlug={pageSlug} /> : null}
      <PageStatusModal
        user={user}
        pageStatus={pageStatus}
        fallbackPageSlug={firstPage?.slug ?? null}
      />

      {isProduction ? null : null}
      <ChunkControl
        userId={userId}
        pageSlug={pageSlug}
        hasAssignments={page.assignments.length > 0}
        hasQuiz={page.quiz !== null}
        condition={userCondition}
      />
      {user ? <EventTracker pageSlug={pageSlug} /> : null}

      

    </PageProvider>
  );
}
