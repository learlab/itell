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

// Validates localStorage snapshot to prevent corruption
const validateSnapshot = (
  snapshot: CRISnapshot | undefined,
  chunks: string[]
): CRISnapshot | undefined => {
  if (!snapshot) return undefined;

  try {
    // Check if snapshot structure is valid
    if (
      !snapshot.currentChunk ||
      !snapshot.chunkStatus ||
      typeof snapshot.shouldBlur !== "boolean"
    ) {
      return undefined;
    }

    // Check if currentChunk exists in current chunks
    if (!chunks.includes(snapshot.currentChunk)) {
      return undefined;
    }

    // Check if all expected chunks exist in chunkStatus
    const snapshotChunks = Object.keys(snapshot.chunkStatus);
    const hasAllChunks = chunks.every((chunk) =>
      snapshotChunks.includes(chunk)
    );

    if (!hasAllChunks) {
      return undefined;
    }

    return snapshot;
  } catch (error) {
    return undefined;
  }
};

export function PageProvider({
  children,
  session,
  condition,
  page,
  pageStatus,
}: Props) {
  const slugs = page.chunks.map(({ slug }) => slug);
  const [rawSnapshot, setSnapshot] = useLocalStorage<CRISnapshot | undefined>(
    `question-store-${page.slug}`,
    undefined
  );

  // Validate the snapshot before using it
  const snapshot = validateSnapshot(rawSnapshot, slugs);

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
    try {
      criStoreRef.current = createCRIStore(
        {
          chunks: page.chunks,
          pageStatus,
          status: pageCRIStatus,
        },
        snapshot
      );
    } catch (error) {
      console.error(
        "[CRI] Error creating store, falling back to clean state:",
        error
      );
      // Fallback to clean state if store creation fails
      criStoreRef.current = createCRIStore(
        {
          chunks: page.chunks,
          pageStatus,
          status: pageCRIStatus,
        },
        undefined // No snapshot, start fresh
      );
    }
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
        try {
          setSnapshot(state.context);
        } catch (error) {
          console.error("[CRI] Error saving snapshot to localStorage:", error);
          // Continue without localStorage persistence if it fails
        }
      });
    }

    if (summaryStoreRef.current) {
      summarySubscription = summaryStoreRef.current.on(
        "toggleFloatingSummary",
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
    // Use page.order for deterministic selection
    const pageIndex = page.order;

    // For each CRI, use deterministic formula to decide if it should be active
    // This targets ~1/3 probability per CRI
    page.cri.forEach((item, index) => {
      // Use a different offset for each CRI to spread distribution
      if ((pageIndex + index) % 3 === 0) {
        status[item.slug] = true;
      }
    });

    // Ensure at least one CRI per page if none were selected
    const hasAnyCRI = Object.values(status).some(Boolean);
    if (!hasAnyCRI) {
      const guaranteedCRIIndex = pageIndex % page.cri.length;
      status[page.cri[guaranteedCRIIndex].slug] = true;
    }
  }

  return status;
};
