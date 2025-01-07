"use client";

import { useState } from "react";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";

import { createQuizAction } from "@/actions/quiz";
import { NavigationButton } from "@/components/navigation-button";
import { QuizData } from "@/drizzle/schema";
import { routes } from "@/lib/navigation";
import { makePageHref } from "@/lib/utils";
import type { PageData } from "@/lib/pages";

export function PageQuiz({
  page,
  afterSubmit,
}: {
  page: PageData;
  afterSubmit?: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [finished, setFinished] = useState(false);

  if (!page.quiz || page.quiz.length === 0) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const submission: QuizData = Array.from(formData.entries()).map(
      ([, value]) => String(value)
    );
    createQuizAction({
      pageSlug: page.slug,
      data: submission,
    });
    setFinished(true);
    setPending(false);
    afterSubmit?.();
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-4" id="page-quiz">
      {page.quiz.map(({ question, answers }, qIndex) => (
        <div key={question} className="grid gap-3">
          <RadioGroup name={question} required className="gap-3">
            <h4 className="mb-2 text-lg font-semibold">{question}</h4>
            {answers.map(({ answer }, aIndex) => (
              <div key={String(answer)} className="flex items-center gap-3">
                <RadioGroupItem value={answer} id={`${qIndex}-${aIndex}`} />
                <Label htmlFor={`${qIndex}-${aIndex}`}>{answer}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <footer className="flex justify-end">
        {finished ? (
          page.next_slug ? (
            <NavigationButton href={makePageHref(page.next_slug)}>
              Go to next page
            </NavigationButton>
          ) : (
            <NavigationButton href={routes.surveyHome({ surveyId: "outtake" })}>
              Take Survey
            </NavigationButton>
          )
        ) : (
          <Button pending={pending} disabled={pending}>
            Submit
          </Button>
        )}
      </footer>
    </form>
  );
}
