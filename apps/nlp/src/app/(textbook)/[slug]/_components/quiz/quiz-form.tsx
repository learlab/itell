"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { SendHorizontalIcon } from "lucide-react";
import { toast } from "sonner";

import { isLastPage, PageData } from "@/lib/pages";
import { makePageHref } from "@/lib/utils";

export function QuizForm({
  page,
  onSubmit,
}: {
  page: PageData;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        startTransition(async () => {
          await onSubmit(new FormData(e.currentTarget));
          if (isLastPage(page)) {
            toast.info("You have finished the entire textbook!", {
              duration: 100000,
            });
            return;
          }

          if (page.next_slug) {
            toast.success("Quiz completed, you have unlocked the next page.");
            router.push(makePageHref(page.next_slug));
          }
        });
      }}
      id="page-quiz"
      className="grid gap-4"
    >
      {page.quiz?.map(({ question, answers }, qIndex) => (
        <div key={question} className="grid gap-3">
          <RadioGroup name={question} required className="gap-3">
            <h4 className="text-lg font-medium">{question}</h4>
            {answers.map(({ answer }, aIndex) => (
              <div key={String(answer)} className="flex items-center gap-3">
                <RadioGroupItem value={answer} id={`${qIndex}-${aIndex}`} />
                <Label
                  htmlFor={`${qIndex}-${aIndex}`}
                  className="font-normal lg:text-base"
                >
                  {answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <footer>
        <Button
          pending={pending}
          disabled={pending}
          className="w-40"
          type="submit"
        >
          <span className="inline-flex items-center gap-2">
            <SendHorizontalIcon className="size-3" />
            Submit
          </span>
        </Button>
      </footer>
    </form>
  );
}
