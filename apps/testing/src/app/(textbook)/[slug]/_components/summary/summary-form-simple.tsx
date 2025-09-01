"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { ErrorFeedback, ErrorType } from "@itell/core/summary";
import { Warning } from "@itell/ui/callout";
import { StatusButton } from "@itell/ui/status-button";
import { useSelector } from "@xstate/store/react";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import { useCRIStore } from "@/components/provider/page-provider";
import { type PageStatus } from "@/lib/page-status";
import { isLastPage, PageData } from "@/lib/pages";
import { SelectAssignmentReady } from "@/lib/store/cri-store";
import { reportSentry } from "@/lib/utils";
import type { FormEvent } from "react";

type Props = {
  pageStatus: PageStatus;
  page: PageData;
};

export function SummaryFormSimple({ pageStatus, page }: Props) {
  const criStore = useCRIStore();
  const isAssignmentReady = useSelector(criStore, SelectAssignmentReady);
  const router = useRouter();

  const {
    action,
    isError,
    isPending: _isPending,
    error,
    isDelayed,
  } = useActionStatus(
    async (e: FormEvent) => {
      e.preventDefault();

      const [, err] = await incrementUserPageSlugAction({
        currentPageSlug: page.slug,
      });

      if (err) {
        throw new Error("increment user page slug action", { cause: err });
      }

      if (page.next_slug) {
        router.push(page.next_slug);
        return;
      }

      if (isLastPage(page)) {
        return toast.info("You have finished the entire textbook!", {
          duration: 100000,
        });
      }
    },
    { delayTimeout: 3000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (error) {
      reportSentry("summary simple", {
        pageSlug: page.slug,
        error: error?.cause,
      });
    }
  }, [error, page]);

  if (!isAssignmentReady) {
    return (
      <div className="mx-auto max-w-2xl">
        <p>Finish the entire page to move on.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="mb-4 text-lg font-light" role="status">
        Below is a reference summary for this page. Please read it carefully to
        better understand the information presented.
      </p>
      <p>placeholder text</p>

      <h2 id="completion-form-heading" className="sr-only">
        Page Completion Form
      </h2>
      <form
        aria-labelledby="completion-form-heading"
        className="flex gap-2"
        onSubmit={action}
      >
        {pageStatus.latest && (
          <StatusButton
            pending={isPending}
            disabled={isPending}
            className="w-44"
          >
            <span className="inline-flex items-center gap-1">
              <CheckIcon className="size-4" /> Mark as completed
            </span>
          </StatusButton>
        )}
      </form>
      {isError ? (
        <Warning role="alert">{ErrorFeedback[ErrorType.INTERNAL]}</Warning>
      ) : null}
      {isDelayed ? <DelayMessage /> : null}
    </div>
  );
}
