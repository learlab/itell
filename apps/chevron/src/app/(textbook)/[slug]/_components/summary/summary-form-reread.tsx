"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Elements } from "@itell/constants";
import {
  useDebounce,
  useKeystroke,
  useScreenIssue,
  useTimer,
} from "@itell/core/hooks";
import { PortalContainer } from "@itell/core/portal-container";
import {
  ErrorFeedback,
  ErrorType,
  SummaryResponseSchema,
} from "@itell/core/summary";
import { driver } from "@itell/driver.js";
import { Button } from "@itell/ui/button";
import { Warning } from "@itell/ui/callout";
import { getChunkElement } from "@itell/utils";
import { useSelector } from "@xstate/store/react";
import { Page } from "#content";
import { type User } from "lucia";
import { SendHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createSummaryAction } from "@/actions/summary";
import { DelayMessage } from "@/components/delay-message";
import { useCRIStore } from "@/components/provider/page-provider";
import { apiClient } from "@/lib/api-client";
import { Condition } from "@/lib/constants";
import { useSummaryStage } from "@/lib/hooks/use-summary-stage";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage } from "@/lib/pages";
import { SelectSummaryReady } from "@/lib/store/cri-store";
import { reportSentry, scrollToElement } from "@/lib/utils";
import {
  getSummaryLocal,
  saveSummaryLocal,
  SummaryInput,
} from "./summary-input";
import { NextPageButton } from "./summary-next-page-button";
import useDriver from "./use-driver";
import type { SummaryResponse } from "@itell/core/summary";

type Props = {
  user: User;
  page: Page;
  pageStatus: PageStatus;
};

const driverObj = driver();

export function SummaryFormReread({ user, page, pageStatus }: Props) {
  const pageSlug = page.slug;
  const prevInput = useRef<string | undefined>(undefined);
  const { ref, data: keystrokes, clear: clearKeystroke } = useKeystroke();
  const [finished, setFinished] = useState(pageStatus.unlocked);
  const criStore = useCRIStore();
  const isSummaryReady = useSelector(criStore, SelectSummaryReady);
  const screenIssue = useScreenIssue();

  const randomChunkSlug = useMemo(() => {
    const validChunks = page.chunks.filter((chunk) => chunk.type === "regular");
    return validChunks[Math.floor(Math.random() * validChunks.length)].slug;
  }, [page]);

  const { addStage, clearStages, finishStage, stages } = useSummaryStage();
  const requestBodyRef = useRef<string>("");
  const summaryResponseRef = useRef<SummaryResponse | null>(null);

  const {
    isError,
    isDelayed,
    isPending: _isPending,
    action,
    error,
  } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      clearStages();
      addStage("Saving");

      const formData = new FormData(e.currentTarget);
      const input = String(formData.get("input")).replaceAll("\u0000", "");

      saveSummaryLocal(pageSlug, input);
      requestBodyRef.current = JSON.stringify({
        summary: input,
        page_slug: pageSlug,
      });
      const apiResponse = await apiClient.api.summary.$post({
        json: {
          summary: input,
          page_slug: pageSlug,
        },
      });
      const json = await apiResponse.json();
      const parsed = SummaryResponseSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("summary response in wrong shape", {
          cause: parsed.error,
        });
      }
      const response = parsed.data;
      summaryResponseRef.current = response;

      const [, err] = await createSummaryAction({
        summary: {
          text: input,
          pageSlug,
          condition: Condition.RANDOM_REREAD,
          isPassed: response.is_passed ?? false,
          containmentScore: response.metrics.containment?.score ?? -1,
          similarityScore: response.metrics.similarity?.score ?? -1,
          contentScore: response.metrics.content?.score,
          contentThreshold: response.metrics.content?.threshold,
        },
        keystroke: {
          start: prevInput.current ?? getSummaryLocal(pageSlug) ?? "",
          data: keystrokes,
          isMobile: screenIssue ? false : screenIssue === "mobile",
        },
      });
      if (err) {
        throw new Error("create summary action", { cause: err });
      }

      clearKeystroke();
      finishStage("Saving");
      setFinished(true);
      prevInput.current = input;

      if (isLastPage(page)) {
        toast.info("You have finished the entire textbook!");
        return;
      }

      // 25% random rereading if the page is not unlocked
      if (!pageStatus.unlocked && Math.random() <= 0.25) {
        goToRandomChunk(randomChunkSlug);
      }
    },
    { delayTimeout: 10000 },
  );
  const isPending = useDebounce(_isPending, 100);

  const { portals } = useDriver(driverObj, {
    pageSlug,
    condition: Condition.RANDOM_REREAD,
    randomChunkSlug,
    exitButton: FinishReadingButton,
  });

  useEffect(() => {
    if (error) {
      finishStage("Analyzing");
      clearStages();

      reportSentry("score summary reread", {
        body: requestBodyRef.current,
        response: summaryResponseRef.current,
        error: error?.cause,
      });
    }
  }, [clearStages, error, finishStage]);

  return (
    <>
      <PortalContainer portals={portals} />
      <div className="flex flex-col gap-2" id={Elements.SUMMARY_FORM}>
        <div role="status">
          {finished && page.next_slug ? (
            <div className="flex flex-col gap-2">
              <p>
                You have finished this page and can move on. You are still
                welcome to improve the summary.
              </p>
              <div className="flex items-center gap-2">
                <NextPageButton pageSlug={page.next_slug} />
              </div>
            </div>
          ) : null}
        </div>

        <h2 id="summary-form-heading" className="sr-only">
          submit summary
        </h2>
        <form
          className="space-y-4"
          onSubmit={action}
          aria-labelledby="summary-form-heading"
        >
          <SummaryInput
            disabled={!isSummaryReady}
            pageSlug={pageSlug}
            pending={isPending}
            stages={stages}
            userRole={user.role}
            ref={ref}
          />
          {isError ? (
            <Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
          ) : null}
          {isDelayed ? <DelayMessage /> : null}
          <div className="flex justify-end">
            <Button
              disabled={!isSummaryReady || isPending}
              pending={isPending}
              type="submit"
            >
              <span className="flex items-center gap-2">
                <SendHorizontalIcon className="size-3" />
                Submit
              </span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

function FinishReadingButton({ onClick }: { onClick: (_: number) => void }) {
  const { time, clearTimer } = useTimer();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div
      ref={ref}
      className="space-y-2"
      id={Elements.STAIRS_CONTAINER}
      tabIndex={-1}
    >
      <p className="p-2 leading-tight tracking-tight">
        Please re-read the highlighted section. when you are finished, press the
        &quot;I finished rereading&quot; button.
      </p>

      <a className="sr-only" href={`#${Elements.STAIRS_HIGHLIGHTED_CHUNK}`}>
        go to the relevant section
      </a>
      <Button
        onClick={() => {
          onClick(time);
          clearTimer();
        }}
        size="sm"
        id={Elements.STAIRS_RETURN_BUTTON}
      >
        I finished rereading
      </Button>
    </div>
  );
}

const goToRandomChunk = (chunkSlug: string) => {
  const el = getChunkElement(chunkSlug, "data-chunk-slug");
  if (el) {
    setTimeout(() => {
      scrollToElement(el);
    }, 100);
    driverObj.highlight({
      element: el,
      popover: {
        description: "",
        side: "right",
        align: "start",
      },
    });
  }
};
