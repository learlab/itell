"use client";

import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { Button } from "@itell/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Page } from "#content";
import { User } from "lucia";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { incrementUserPageSlugAction } from "@/actions/user";
import { DelayMessage } from "@/components/delay-message";
import { InternalError } from "@/components/internal-error";
import { isLastPage } from "@/lib/pages";
import { reportSentry } from "@/lib/utils";
import { sendScormUpdate } from "@/lib/scorm/scorm-communication";
import { allPagesSorted } from "tests/utils";

export function MarkCompletedForm({ page }: { page: Page; user: User }) {
  const router = useRouter();
  const {
    action,
    isPending: _isPending,
    error,
    isDelayed,
  } = useActionStatus(
    async (e: FormEvent) => {
      e.preventDefault();

      const [, err] = await incrementUserPageSlugAction({
        currentPageSlug: page.slug,
        withStreakSkip: true,
      });
      if (err) {
        throw new Error("increment user page slug action", { cause: err });
      }

      
      if (isLastPage(page)) {
        toast.info("You have finished the entire textbook!", {
          duration: 100000,
        });
       
      sendScormUpdate({
        progress: "completed",
        completion: true,
        lessonStatus: "completed",
        score: 100,
      });
        return;
      }

      const totalPages = allPagesSorted.length;
      const currentPageIndex = page.order;
      const progressPercentage = Math.round(((currentPageIndex + 1) / totalPages) * 100);
      
      // Send SCORM updates
      sendScormUpdate({
        score: progressPercentage,
        progress: page.title,
        lessonStatus: isLastPage(page) ? "completed" : "incomplete",
        completion: isLastPage(page)
      });
      
      if (page.next_slug) {
        router.push(page.next_slug);
        return;
      }
      
    },
    { delayTimeout: 3000 }
  );
  const isPending = useDebounce(_isPending, 100);

  useEffect(() => {
    if (error) {
      reportSentry("mark as completed", {
        pageSlug: page.slug,
        error: error?.cause,
      });
    }
  }, [error, page]);
  return (
    <Card className="border-info">
      <CardHeader>
        <CardTitle>No assignments for this page</CardTitle>
        <CardDescription>
          Click the button below to move forward.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={action}>
          <Button pending={isPending} disabled={isPending} typeof="submit">
            <span className="flex items-center gap-2">
              <CheckIcon className="size-4" />
              <span>Mark as Completed</span>
            </span>
          </Button>
        </form>
        {error && <InternalError />}
        {isDelayed && <DelayMessage />}
      </CardContent>
    </Card>
  );
}
