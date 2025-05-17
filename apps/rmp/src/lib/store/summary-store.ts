"use client";

import { type ErrorType, type SummaryResponse } from "@itell/core/summary";
import { createStoreWithProducer } from "@xstate/store";
import { produce } from "immer";

import { type PageStatus } from "@/lib/page-status";
import type { SnapshotFromStore } from "@xstate/store";

export type StairsQuestion = {
  text: string;
  chunk: string;
  question_type: string;
};

export type SummaryStore = ReturnType<typeof createSummaryStore>;
export const createSummaryStore = ({
  pageStatus,
  showFloatingSummary,
}: {
  pageStatus: PageStatus;
  showFloatingSummary: boolean | undefined;
}) => {
  return createStoreWithProducer(produce, {
    context: {
      input: undefined as string | undefined,
      prevInput: undefined as string | undefined,
      error: null as ErrorType | null,
      response: null as SummaryResponse | null,
      stairsQuestion: null as StairsQuestion | null,
      showFloatingSummary,
    },
    emits: {
      toggleFloatingSummary() {},
    },
    on: {
      submit: (context) => {
        context.error = null;
      },
      fail: (context, event: { error: ErrorType }) => {
        context.error = event.error;
      },
      scored: (context, event: { response: SummaryResponse }) => {
        context.response = event.response;
      },
      stairs: (context, event: { data: StairsQuestion }) => {
        context.stairsQuestion = event.data;
      },
      setInput: (context, event: { input: string }) => {
        context.input = event.input;
      },
      toggleShowFloatingSummary: (context, _: unknown, enqueue) => {
        context.showFloatingSummary = !context.showFloatingSummary;
        enqueue.emit.toggleFloatingSummary({});
      },
      finishPage: (context, event: { input?: string }) => {
        if (event.input !== undefined) {
          context.prevInput = event.input;
        }
      },
    },
  });
};

type Selector<T> = (_: SnapshotFromStore<SummaryStore>) => T;
export const SelectInput: Selector<string | undefined> = (state) =>
  state.context.input;
export const SelectResponse: Selector<SummaryResponse | null> = (state) =>
  state.context.response;
export const SelectPrevInput: Selector<string | undefined> = (state) =>
  state.context.prevInput;
export const SelectStairs: Selector<StairsQuestion | null> = (state) =>
  state.context.stairsQuestion;
export const SelectError: Selector<ErrorType | null> = (state) =>
  state.context.error;
export const SelectShowFloatingSummary: Selector<boolean | undefined> = (
  state
) => state.context.showFloatingSummary;
