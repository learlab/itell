"use client";

import { useEffect, useState } from "react";
import { Elements } from "@itell/constants";
import { Badge } from "@itell/ui/badge";
import { Label } from "@itell/ui/label";
import { TextArea } from "@itell/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@itell/ui/tooltip";
import { cn, numOfWords } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { ArrowDownIcon, PinIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";

import {
  useCRIStore,
  useSummaryStore,
} from "@/components/provider/page-provider";
import { isProduction } from "@/lib/constants";
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

export function ToggleShowFloatingSummary() {
  const summaryStore = useSummaryStore();
  const userShow = useSelector(summaryStore, SelectShowFloatingSummary);

  return (
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
              // same shape for true and undefined
              "rotate-0": userShow === false,
            })}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        {userShow === false
          ? "Show a floating window of summary input when you scrolls up"
          : "Hide floating summary window"}
      </TooltipContent>
    </Tooltip>
  );
}

export function FloatingSummary({ isAdmin }: { isAdmin: boolean }) {
  const summaryStore = useSummaryStore();
  const criStore = useCRIStore();
  const isSummaryReady = useSelector(criStore, SelectSummaryReady);
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

  const numWords = numOfWords(input || "");

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 z-30 rounded-lg border-2 bg-accent shadow-md"
          id="floating-summary"
          style={{
            left: dimensions.left,
            width: dimensions.width,
          }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
        >
          <div className="relative pt-2">
            <header className="absolute top-0 z-40 flex w-full items-center justify-between px-4">
              <Badge variant={"secondary"} className="-translate-y-1/2">
                {numWords} words
              </Badge>
              <div className="ml-auto flex items-center gap-2">
                <button
                  aria-label="Close floating summary"
                  onClick={() =>
                    summaryStore.send({ type: "toggleShowFloatingSummary" })
                  }
                  type="button"
                  className="flex -translate-y-1/2 items-center justify-center rounded-full border border-accent-foreground bg-background p-1"
                >
                  <XIcon className="size-4" />
                </button>
                <button
                  aria-label="Jump to summary submission"
                  onClick={() => scrollToElement(Elements.PAGE_ASSIGNMENTS)}
                  type="button"
                  className="flex -translate-y-1/2 items-center justify-center rounded-full border border-accent-foreground bg-background p-1"
                >
                  <ArrowDownIcon className="size-4" />
                </button>
              </div>
            </header>
            {summaryResponse && (
              <SummaryFeedbackDetails
                response={summaryResponse}
                className="border-none pt-2"
              />
            )}
            <form>
              <Label className="flex flex-col gap-3">
                <span className="sr-only">Your summary</span>
                <TextArea
                  value={input}
                  rows={6}
                  placeholder="This page is about ..."
                  className="border-none font-normal md:text-base xl:text-lg"
                  onPaste={(e) => {
                    if (isProduction && isAdmin) {
                      e.preventDefault();
                      toast.warning("Copy & Paste is not allowed");
                    }
                  }}
                  onChange={(e) =>
                    summaryStore.send({
                      type: "setInput",
                      input: e.target.value,
                    })
                  }
                />
              </Label>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
