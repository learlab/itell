"use client";

import { useEffect, useState } from "react";
import { Elements } from "@itell/constants";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@itell/ui/tooltip";
import { cn } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { ArrowDownIcon, PinIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import {
  useCRIStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { SelectSummaryReady } from "@/lib/store/cri-store";
import {
  SelectInput,
  SelectResponse,
  SelectShowFloatingSummary,
} from "@/lib/store/summary-store";
import { scrollToElement } from "@/lib/utils";
import { SummaryFeedbackDetails } from "./summary-feedback";

const PAGE_ASSIGNMENTS_ID = Elements.PAGE_ASSIGNMENTS;

function useIntersectionState() {
  const [seen, setSeen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seenObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !seen) {
          setSeen(true);
        }
      },
      { threshold: 0.6 }
    );

    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        setVisible(entries[0].isIntersecting);
      },
      { threshold: 0 }
    );

    const element = document.getElementById(PAGE_ASSIGNMENTS_ID);
    if (element) {
      seenObserver.observe(element);
      visibilityObserver.observe(element);
    }

    return () => {
      seenObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, [seen]);

  return { seen, visible };
}

function useElementDimensions() {
  const [dimensions, setDimensions] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const element = document.getElementById(PAGE_ASSIGNMENTS_ID);
      if (element) {
        const rect = element.getBoundingClientRect();
        const floatingWidth = rect.width * 0.8;
        const leftOffset = rect.left + (rect.width - floatingWidth) / 2;
        setDimensions({
          left: leftOffset,
          width: floatingWidth,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return dimensions;
}

const FloatingSummaryHeader = () => {
  const summaryStore = useSummaryStore();
  return (
    <header className="flex items-center justify-end px-4 py-2">
      <div className="flex gap-2">
        <button
          aria-label="Close floating summary"
          onClick={() =>
            summaryStore.send({ type: "toggleShowFloatingSummary" })
          }
          className="px-1"
        >
          <XIcon className="size-4" />
        </button>
        <button
          aria-label="Jump to summary submission"
          onClick={() =>
            scrollToElement(document.getElementById(PAGE_ASSIGNMENTS_ID)!)
          }
          className="px-1"
        >
          <ArrowDownIcon className="size-4" />
        </button>
      </div>
    </header>
  );
};

export function ToggleShowFloatingSummary() {
  const summaryStore = useSummaryStore();
  const userShow = useSelector(summaryStore, SelectShowFloatingSummary);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label="Toggle show floating summary"
            onClick={() =>
              summaryStore.send({ type: "toggleShowFloatingSummary" })
            }
          >
            <PinIcon
              className={cn("size-4 rotate-45 transition-all", {
                "rotate-0": !userShow,
              })}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          {userShow
            ? "Hide floating summary"
            : "Show a floating summary input when you scrolls up"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function FloatingSummary() {
  const summaryStore = useSummaryStore();
  const questionStore = useCRIStore();
  const isSummaryReady = useSelector(questionStore, SelectSummaryReady);
  const input = useSelector(summaryStore, SelectInput);
  const userShow = useSelector(summaryStore, SelectShowFloatingSummary);
  const summaryResponse = useSelector(summaryStore, SelectResponse);

  const { seen: assignmentsSeen, visible: assignmentsVisible } =
    useIntersectionState();
  const dimensions = useElementDimensions();

  const floatingReady =
    isSummaryReady && !assignmentsVisible && assignmentsSeen;
  const show = floatingReady && userShow !== false;

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 z-30 rounded-lg border bg-background shadow-md"
          id="floating-summary"
          style={{
            left: dimensions.left,
            width: dimensions.width,
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          <FloatingSummaryHeader />
          {summaryResponse && (
            <div className="px-4">
              <SummaryFeedbackDetails response={summaryResponse} />
            </div>
          )}
          <form className="bg-card px-4 py-2">
            <Label className="flex flex-col gap-3">
              <span className="sr-only">Your summary</span>
              <TextArea
                value={input}
                rows={6}
                placeholder="This page is about ..."
                className="font-normal xl:text-lg"
                onChange={(e) =>
                  summaryStore.send({ type: "setInput", input: e.target.value })
                }
              />
            </Label>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
