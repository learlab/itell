"use client";

import { createStoreWithProducer } from "@xstate/store";
import { type Page } from "#content";
import { produce } from "immer";

import { type PageStatus } from "../page-status";
import type { SnapshotFromStore } from "@xstate/store";

export type Question = { answer: string; question: string };
export type SelectedQuestions = Record<string, Question>;

export type CRISnapshot = {
  currentChunk: string;
  chunkStatus: ChunkStatus;
  isAssignmentReady: boolean;
  shouldBlur: boolean;
};

// if a chunk contains a CRI
export type PageCRIStatus = Record<string, boolean>;

export type CRIStore = ReturnType<typeof createCRIStore>;
type Props = {
  pageStatus: PageStatus;
  chunks: Page["chunks"];
  status: PageCRIStatus;
};

// Validates and fixes CRI state to ensure consistency
const validateAndFixState = (
  state: CRISnapshot,
  chunks: Page["chunks"],
  status: PageCRIStatus,
  pageStatus: PageStatus
): CRISnapshot => {
  const slugs = chunks.map(({ slug }) => slug);
  const currentIndex = slugs.indexOf(state.currentChunk);

  // If currentChunk is invalid, reset to first chunk
  if (currentIndex === -1) {
    console.warn(
      "[CRI] Invalid currentChunk detected, resetting to first chunk"
    );
    return {
      ...state,
      currentChunk: slugs[0],
      chunkStatus: Object.fromEntries(
        chunks.map(({ slug, type }) => [
          slug,
          {
            hasQuestion: Boolean(status[slug]),
            status: type === "regular" ? undefined : "completed",
          },
        ])
      ),
    };
  }

  // Validate that all chunks before currentChunk are completed (except first)
  // AND that hasQuestion fields match current deterministic CRI assignment
  const fixedChunkStatus = { ...state.chunkStatus };
  let needsFix = false;

  // First, validate hasQuestion fields for all chunks against current CRI assignment
  for (const chunkSlug of slugs) {
    const currentHasQuestion = Boolean(status[chunkSlug]);
    const storedChunkStatus = fixedChunkStatus[chunkSlug];

    if (!storedChunkStatus || storedChunkStatus.hasQuestion !== currentHasQuestion) {
      console.warn(
        `[CRI] Chunk ${chunkSlug} hasQuestion mismatch (stored: ${storedChunkStatus?.hasQuestion}, current: ${currentHasQuestion}), fixing...`
      );
      fixedChunkStatus[chunkSlug] = {
        hasQuestion: currentHasQuestion,
        status: storedChunkStatus?.status || (chunks.find(c => c.slug === chunkSlug)?.type === "regular" ? undefined : "completed"),
      };
      needsFix = true;
    }
  }

  // Then, validate completion status for chunks before currentChunk
  for (let i = 0; i < currentIndex; i++) {
    const chunkSlug = slugs[i];
    const chunkData = chunks[i];

    // Skip first chunk (always visible)
    if (i === 0) continue;

    // All previous chunks should be completed unless they're non-regular
    if (
      chunkData.type === "regular" &&
      (!fixedChunkStatus[chunkSlug] || !fixedChunkStatus[chunkSlug].status)
    ) {
      console.warn(
        `[CRI] Chunk ${chunkSlug} before current should be completed, fixing...`
      );
      fixedChunkStatus[chunkSlug] = {
        ...fixedChunkStatus[chunkSlug],
        status: "completed",
      };
      needsFix = true;
    }
  }

  // Validate isAssignmentReady - only fix from false to true if conditions are met
  let validatedIsAssignmentReady = state.isAssignmentReady;

  if (!state.isAssignmentReady) {
    // Check if assignments should be ready based on current progression
    const allRequiredCRICompleted = slugs
      .slice(0, currentIndex) // Only check chunks before current
      .filter((slug) => status[slug]) // Only chunks that have CRI questions
      .every((slug) => fixedChunkStatus[slug]?.status === "completed");

    const lastIndex = slugs.length - 1;
    const isAtOrPastLastChunk = currentIndex >= lastIndex;

    if (allRequiredCRICompleted && isAtOrPastLastChunk) {
      console.warn(
        "[CRI] User has completed progression but isAssignmentReady is false, fixing..."
      );
      validatedIsAssignmentReady = true;
      needsFix = true;
    }
  }

  return needsFix
    ? {
        ...state,
        chunkStatus: fixedChunkStatus,
        isAssignmentReady: validatedIsAssignmentReady,
      }
    : state;
};

export const createCRIStore = (
  { pageStatus, chunks, status }: Props,
  snapshot?: CRISnapshot
) => {
  const lastIndex = chunks.length - 1;
  const slugs = chunks.map(({ slug }) => slug);

  const initialChunk =
    chunks.find(({ type }) => type === "regular")?.slug ??
    chunks[chunks.length - 1].slug;

  const baseInitialState: CRISnapshot = {
    currentChunk: snapshot?.currentChunk ?? initialChunk,
    chunkStatus:
      snapshot?.chunkStatus ??
      Object.fromEntries(
        chunks.map(({ slug, type }) => [
          slug,
          {
            hasQuestion: Boolean(status[slug]),
            status: type === "regular" ? undefined : "completed",
          },
        ])
      ),
    isAssignmentReady: pageStatus.unlocked ?? snapshot?.isAssignmentReady,
    shouldBlur: pageStatus.unlocked ? false : (snapshot?.shouldBlur ?? true),
  };

  // Validate and fix the state if it came from localStorage
  const initialState = snapshot
    ? validateAndFixState(baseInitialState, chunks, status, pageStatus)
    : baseInitialState;

  return createStoreWithProducer(produce, {
    context: initialState,
    on: {
      finishChunk: (
        context,
        event: { chunkSlug: string; passed?: boolean }
      ) => {
        context.chunkStatus[event.chunkSlug].status = event.passed
          ? "passed"
          : "completed";
      },
      advanceChunk: (context, event: { chunkSlug: string }) => {
        const currentIndex = slugs.indexOf(event.chunkSlug);
        if (currentIndex < lastIndex) {
          let nextIndex = currentIndex + 1;
          if (nextIndex === lastIndex) {
            context.currentChunk = slugs[lastIndex];
            return;
          }

          const nextSlug = chunks[nextIndex].slug;
          if (context.chunkStatus[nextSlug].hasQuestion) {
            context.currentChunk = nextSlug;
            return;
          }

          // otherwise, unlock following chunks till we encounter the next regular chunk
          while (
            nextIndex + 1 <= lastIndex &&
            chunks[nextIndex + 1].type !== "regular"
          ) {
            nextIndex++;
          }
          context.currentChunk = chunks[nextIndex].slug;
        }
      },
      finishPage: (context) => {
        context.isAssignmentReady = true;
        context.shouldBlur = false;
        context.currentChunk = slugs[lastIndex];
      },
      resetPage: (context) => {
        context.isAssignmentReady = false;
        context.shouldBlur = true;
        context.currentChunk = slugs[0];
        context.chunkStatus = Object.fromEntries(
          slugs.map((slug) => [
            slug,
            {
              hasQuestion: status[slug],
              status: undefined,
            },
          ])
        );
      },
    },
  });
};

export const getExcludedChunks = (store: CRIStore) => {
  const snap = store.getSnapshot();
  return Object.entries(snap.context.chunkStatus)
    .filter(([, { status }]) => status === "passed")
    .map(([slug]) => slug);
};

type ChunkStatus = Record<
  string,
  {
    hasQuestion: boolean;
    // a chunk status can be undefined (no interaction happened), completed (the page is unlocked or a question has been answered regardless of correctness), or passed (the question has been answered correctly)
    status: undefined | "completed" | "passed";
  }
>;

type Selector<T> = (_: SnapshotFromStore<CRIStore>) => T;

export const SelectChunkStatus: Selector<ChunkStatus> = (state) =>
  state.context.chunkStatus;
export const SelectShouldBlur: Selector<boolean> = (state) =>
  state.context.shouldBlur;
export const SelectCurrentChunk: Selector<string> = (state) =>
  state.context.currentChunk;
export const SelectAssignmentReady: Selector<boolean> = (state) =>
  state.context.isAssignmentReady;
