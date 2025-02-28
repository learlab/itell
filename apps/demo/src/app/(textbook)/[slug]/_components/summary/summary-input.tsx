"use client";

import { useEffect } from "react";
import { Elements } from "@itell/constants";
import { useDebounce } from "@itell/core/hooks";
import { levenshteinDistance } from "@itell/core/summary";
import { Label } from "@itell/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { numOfWords } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { InfoIcon } from "lucide-react";
import pluralize from "pluralize";
import { toast } from "sonner";

import { useSummaryStore } from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
import { type StageItem } from "@/lib/hooks/use-summary-stage";
import { useSafeSearchParams } from "@/lib/navigation";
import { SelectInput } from "@/lib/store/summary-store";
import { makeInputKey } from "@/lib/utils";
import { SummaryProgress } from "./summary-progress";
import type { RefObject } from "react";

export const saveSummaryLocal = (pageSlug: string, text: string) => {
  localStorage.setItem(makeInputKey(pageSlug), text);
};

export const getSummaryLocal = (pageSlug: string) => {
  return localStorage.getItem(makeInputKey(pageSlug));
};

export const clearSummaryLocal = (pageSlug: string) => {
  localStorage.removeItem(makeInputKey(pageSlug));
};

type Props = {
  pageSlug: string;
  stages: StageItem[];
  pending: boolean;
  isAdmin: boolean;
  prevInput?: string;
  enableSimilarity?: boolean;
  value?: string;
  disabled?: boolean;
  ref: RefObject<HTMLElement | null>;
};

export const SummaryInput = ({
  pageSlug,
  stages,
  disabled = true,
  value = "",
  pending,
  isAdmin,
  enableSimilarity = false,
  prevInput,
  ref,
}: Props) => {
  const { summary } = useSafeSearchParams("textbook");
  const summaryStore = useSummaryStore();
  const input = useSelector(summaryStore, SelectInput);

  useEffect(() => {
    // initialize summary text
    // 1. from searchParams, base64 encoded
    // 2. from localStorage
    // 3. from value prop
    const savedSummary = getSummaryLocal(pageSlug);
    summaryStore.trigger.setInput({
      input: summary
        ? Buffer.from(summary, "base64").toString("ascii")
        : savedSummary
          ? savedSummary
          : value,
    });
  }, [pageSlug, summary, summaryStore, value]);

  const debouncedInput = useDebounce(input, 500);

  const distance =
    enableSimilarity && prevInput
      ? levenshteinDistance(debouncedInput || "", prevInput)
      : undefined;

  return (
    <div className="relative">
      {distance !== undefined ? <Distance distance={distance} /> : null}
      <p
        aria-hidden="true"
        className="absolute right-2 bottom-2 z-1 text-sm font-light opacity-70"
      >
        {pluralize("word", numOfWords(input ?? ""), true)}
      </p>

      <Label>
        <span className="sr-only">your summary</span>
        <textarea
          spellCheck
          id={Elements.SUMMARY_INPUT}
          name="input"
          ref={ref as RefObject<HTMLTextAreaElement>}
          value={input}
          disabled={disabled}
          placeholder="This page is about ..."
          onChange={(e) => {
            summaryStore.trigger.setInput({
              input: e.currentTarget.value,
            });
          }}
          rows={10}
          onPaste={(e) => {
            if (isProduction && !isAdmin) {
              e.preventDefault();
              toast.warning("Copy & Paste is not allowed");
            }
          }}
          className={`border-input ring-offset-background placeholder:text-muted-foreground
            focus-visible:ring-ring flex min-h-[80px] w-full resize-none rounded-md border
            bg-transparent p-4 px-3 py-2 text-sm font-normal shadow-md focus-visible:ring-2
            focus-visible:ring-offset-2 focus-visible:outline-hidden
            disabled:cursor-not-allowed disabled:opacity-50 md:text-base xl:text-lg`}
        />
      </Label>

      {pending ? (
        <div
          className="bg-background/80 animate-in animate-out absolute top-0 right-0 bottom-0 left-0
            z-10 cursor-not-allowed gap-2 backdrop-blur-sm transition-all duration-100"
        >
          <SummaryProgress items={stages} />
        </div>
      ) : (
        disabled && (
          <div
            className="bg-background/80 animate-in animate-out absolute top-0 right-0 bottom-0 left-0
              z-10 flex cursor-not-allowed items-center justify-center gap-2 backdrop-blur-sm
              transition-all duration-100"
          >
            Please finish the entire page first
          </div>
        )
      )}
    </div>
  );
};
const distanceThreshold = 60;

function Distance({ distance }: { distance: number }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <div className="bg-accent relative h-8 flex-1 overflow-hidden rounded-full">
        <div
          className={`absolute top-0 left-0 h-full transition-all duration-300 ease-out ${
            distance >= distanceThreshold ? "bg-info" : "bg-warning" }`}
          style={{ width: `${String(distance)}%` }}
        />
        <div
          className="bg-info absolute top-0 bottom-0 w-[4px]"
          style={{ left: `${String(distanceThreshold)}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-between px-3">
          <span className="z-10 text-sm font-medium">Uniqueness</span>
          <span className="z-10 text-sm font-medium">
            {Math.min(distance, 100).toFixed(1)}%
          </span>
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger>
          <InfoIcon className="size-6 flex-shrink-0" />
        </TooltipTrigger>
        <TooltipContent className="w-64">
          Revise your summary to make it more unique to your previous summary
          (pass the threshold indicated by the blue bar).
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
