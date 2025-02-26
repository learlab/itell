"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useLocalStorage } from "@itell/core/hooks";
import { type Subscription } from "@xstate/store";
import { type Page } from "#content";

import { GetSessionData } from "@/lib/auth/actions";
import { type PageStatus } from "@/lib/page-status";
import { createChatStore } from "@/lib/store/chat-store";
import { createCRIStore } from "@/lib/store/cri-store";
import { createSummaryStore } from "@/lib/store/summary-store";
import type { ChatStore } from "@/lib/store/chat-store";
import type {
  CRISnapshot,
  CRIStore,
  PageCRIStatus,
} from "@/lib/store/cri-store";
import type { SummaryStore } from "@/lib/store/summary-store";

type Props = {
  children: React.ReactNode;
  session: GetSessionData;
  condition: string;
  page: Page;
  pageStatus: PageStatus;
};

type State = {
  session: GetSessionData;
  pageStatus: PageStatus;
  condition: string;
  chunks: string[];
  page: Page;
  criStore: CRIStore;
  chatStore: ChatStore;
  summaryStore: SummaryStore;
};
const PageContext = createContext<State>({} as State);

export function PageProvider({
  children,
  session,
  condition,
  page,
  pageStatus,
}: Props) {
  const slugs = page.chunks.map(({ slug }) => slug);
  const [snapshot, setSnapshot] = useLocalStorage<CRISnapshot | undefined>(
    `question-store-${page.slug}`,
    undefined
  );

  const [showFloatingSummary, setShowFloatingSummary] = useLocalStorage<
    boolean | undefined
  >(
    `show-floating-summary-${page.slug}`,
    pageStatus.latest ? undefined : false
  );

  const pageCRIStatus = useMemo(() => {
    return getPageCRIStatus(page);
  }, [page]);

  const criStoreRef = useRef<CRIStore>(undefined);
  if (!criStoreRef.current) {
    criStoreRef.current = createCRIStore(
      {
        chunks: page.chunks,
        pageStatus,
        status: pageCRIStatus,
      },
      snapshot
    );
  }

  const chatStoreRef = useRef<ChatStore>(undefined);
  if (!chatStoreRef.current) {
    chatStoreRef.current = createChatStore();
  }

  const summaryStoreRef = useRef<SummaryStore>(undefined);
  if (!summaryStoreRef.current) {
    summaryStoreRef.current = createSummaryStore({
      pageStatus,
      showFloatingSummary,
    });
  }

  useEffect(() => {
    let criSubscription: Subscription | undefined;
    let quizSubscription: Subscription | undefined;
    let summarySubscription: Subscription | undefined;
    if (criStoreRef.current) {
      criSubscription = criStoreRef.current.subscribe((state) => {
        setSnapshot(state.context);
      });
    }

    if (summaryStoreRef.current) {
      summarySubscription = summaryStoreRef.current.on(
        "toggleShowFloatingSummary",
        () => {
          setShowFloatingSummary((prev) => !prev);
        }
      );
    }

    return () => {
      criSubscription?.unsubscribe();
      quizSubscription?.unsubscribe();
      summarySubscription?.unsubscribe();
    };
  }, [setShowFloatingSummary, setSnapshot]);

  return (
    <PageContext.Provider
      value={{
        session,
        pageStatus,
        criStore: criStoreRef.current,
        chatStore: chatStoreRef.current,
        summaryStore: summaryStoreRef.current,
        chunks: slugs,
        page,
        condition,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}

export const usePage = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.page, [state.page]);
};

export const usePageStatus = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.pageStatus, [state.pageStatus]);
};

export const useSession = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.session, [state.session]);
};

export const useCondition = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.condition, [state.condition]);
};

export const useChunks = () => {
  const state = useContext(PageContext);
  return useMemo(() => state.chunks, [state.chunks]);
};

export const useSummaryStore = () => {
  const value = useContext(PageContext);
  return value.summaryStore;
};

export const useChatStore = () => {
  const value = useContext(PageContext);
  return value.chatStore;
};

export const useCRIStore = () => {
  const value = useContext(PageContext);
  return value.criStore;
};

const getPageCRIStatus = (page: Page): PageCRIStatus => {
  if (page.cri.length === 0) {
    return {};
  }

  const status: PageCRIStatus = Object.fromEntries(
    page.chunks.map((chunk) => [chunk, false])
  );

  if (page.chunks.length > 0) {
    let withCRI = false;
    page.cri.forEach((item) => {
      const baseProb = 1 / 3;

      // adjust the probability of cri based on the current streak
      // if (answerStreak >= 7) {
      //   baseProb = baseProb * 0.3;
      // } else if (answerStreak >= 5) {
      //   baseProb = baseProb * 0.5;
      // } else if (answerStreak >= 2) {
      //   baseProb = baseProb * 0.7;
      // }

      if (Math.random() < baseProb) {
        status[item.slug] = true;
        if (!withCRI) {
          withCRI = true;
        }
      }
    });

    // Each page will have at least one CRI
    if (!withCRI) {
      const randomCRI = page.cri[Math.floor(Math.random() * page.cri.length)];

      status[randomCRI.slug] = true;
    }
  }

  return status;
};
