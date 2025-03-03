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
  isSummaryReady: boolean;
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

export const createCRIStore = (
  { pageStatus, chunks, status }: Props,
  snapshot?: CRISnapshot
) => {
  const lastIndex = chunks.length - 1;
  const slugs = chunks.map(({ slug }) => slug);

  const initialChunk =
    chunks.find(({ type }) => type === "regular")?.slug ??
    chunks[chunks.length - 1].slug;

  const initialState: CRISnapshot = {
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
    isSummaryReady: snapshot?.isSummaryReady ?? pageStatus.unlocked,
    shouldBlur: snapshot?.shouldBlur ?? !pageStatus.unlocked,
  };

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
      finishPage: (context, event: unknown) => {
        context.isSummaryReady = true;
        context.shouldBlur = false;
        context.currentChunk = slugs[lastIndex];
      },
      resetPage: (context, event: unknown) => {
        context.isSummaryReady = false;
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
export const SelectSummaryReady: Selector<boolean> = (state) =>
  state.context.isSummaryReady;
