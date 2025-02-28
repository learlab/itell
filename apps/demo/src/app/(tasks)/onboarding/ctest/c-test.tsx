"use client";

import React, { useRef, useState } from "react";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@itell/ui/alert";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { Input } from "@itell/ui/input";
import { cn } from "@itell/utils";
import { User } from "lucia";
import { SendHorizontalIcon } from "lucide-react";
import { toast } from "sonner";
import { useActionStatus } from "use-action-status";

import { createClozeAction } from "@/actions/cloze";
import { updateUserAction } from "@/actions/user";
import { AdminButton } from "@/components/admin-button";
import { ClozeData } from "@/drizzle/schema";
import { routes } from "@/lib/navigation";
import { WordItem } from "./word-item";

interface Props {
  paragraphs: string[];
  user: User;
  mode?: "cloze" | "ctest";
}

export const CTest = ({ paragraphs, user, mode = "cloze" }: Props) => {
  const showLetter = mode === "cloze" ? 0 : 2;
  const formRef = useRef<HTMLFormElement>(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [results, setResults] = useState<{
    answers: Array<{ word: string; isCorrect: boolean }>;
    score?: number;
  } | null>(null);

  const { action, isPending, error } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget as HTMLFormElement;
      const fields = Array.from(
        form.querySelectorAll("fieldset[data-target-word]")
      ) as HTMLFieldSetElement[];

      let correctWords = 0;
      const clozeData: ClozeData = [];
      const answers: Array<{ word: string; isCorrect: boolean }> = [];

      fields.forEach((field) => {
        const word = field.dataset.targetWord as string;
        const inputs = Array.from(
          field.querySelectorAll("input[type=text]")
        ) as HTMLInputElement[];

        const result = {
          word,
          placeholders: [] as string[],
          answers: [] as string[],
        };
        inputs.forEach((input) => {
          const isTarget = input.dataset.isTarget === "true";
          if (isTarget) {
            result.answers.push(input.value || ""); // allow empty answers
          } else {
            result.placeholders.push(input.value);
          }
        });

        clozeData.push(result);
        const joined = result.placeholders.join("") + result.answers.join("");
        if (joined === word) {
          correctWords++;
        }
        answers.push({ word, isCorrect: joined === word });
      });

      setResults({
        answers,
        score: (correctWords / fields.length) * 100,
      });

      const [, err] = await createClozeAction({
        pageSlug: "ctest",
        totalWords: fields.length,
        correctWords,
        data: clozeData,
      });
      if (err) {
        throw new Error("Failed to save answers, please try again later", {
          cause: err,
        });
      }

      const [, err1] = await updateUserAction({ onboardingFinished: true });
      if (err1) {
        throw new Error("Failed to finish onboarding, please try again later", {
          cause: err1,
        });
      }
      setShowAnswers(true);
      toast.success(
        "All onboarding tasks completed. Redirecting to the textbook ..."
      );
    }
  );

  const handleContinue = () => {
    redirect(
      user.pageSlug ? routes.textbook({ slug: user.pageSlug }) : routes.home()
    );
  };
  if (paragraphs.length < 1) return <p>not enough paragraphs</p>;

  const { firstSentence, rest: firstParagraphRest } = splitFirstSentence(
    paragraphs[0]
  );

  return (
    <div className="space-y-8">
      <Alert variant="info">
        <AlertDescription>
          This is a practice exercise to help you engage with the text. Your
          responses won't affect your progress or grade. Feel free to skip words
          you're unsure about - the goal is to understand the context, not to
          get every word right.
        </AlertDescription>
      </Alert>
      {user.isAdmin && <QuickFill />}
      {error && <Errorbox title={error.message} />}
      {/* <div className="flex items-baseline"> */}
      {/*   <span>sci</span> */}
      {/*   <div className="group relative"> */}
      {/*     <input */}
      {/*       maxLength={4} */}
      {/*       className="peer w-10 border-b-2 focus:outline-hidden focus:ring-0" */}
      {/*     /> */}
      {/*     <span */}
      {/*       className={cn( */}
      {/*         "absolute right-0 top-0 flex size-5 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border text-sm transition", */}
      {/*         "peer-focus:w-fit peer-focus:-translate-y-full peer-focus:rounded-md peer-focus:p-2" */}
      {/*       )} */}
      {/*     > */}
      {/*       4 */}
      {/*       <span className="ml-1 hidden group-has-[:focus-visible]:inline"> */}
      {/*         letters */}
      {/*       </span> */}
      {/*     </span> */}
      {/*   </div> */}
      {/* </div> */}
      <form
        id="cloze-form"
        className="flex flex-col gap-4 rounded-lg"
        ref={formRef}
        onSubmit={action}
      >
        <div className="space-y-3 leading-relaxed xl:text-lg">
          {paragraphs.map((paragraph, pIndex) => {
            if (pIndex === 0) {
              return (
                <p key={pIndex}>
                  {firstSentence &&
                    splitWords({ text: paragraph, shouldTarget: false }).map(
                      (wordObj, wIndex) => (
                        <WordItem
                          key={`${pIndex}-${wIndex}`}
                          word={wordObj.text}
                          showLetter={showLetter}
                          isTarget={wordObj.isTarget}
                        />
                      )
                    )}
                  {firstParagraphRest &&
                    splitWords({ text: paragraph, shouldTarget: true }).map(
                      (wordObj, wIndex) => (
                        <WordItem
                          key={`${pIndex}-${wIndex}`}
                          word={wordObj.text}
                          showLetter={showLetter}
                          isTarget={wordObj.isTarget}
                        />
                      )
                    )}
                </p>
              );
            }

            return (
              <p key={pIndex}>
                {splitWords({ text: paragraph, shouldTarget: true }).map(
                  (wordObj, wIndex) => (
                    <WordItem
                      key={`${pIndex}-${wIndex}`}
                      word={wordObj.text}
                      showLetter={showLetter}
                      isTarget={wordObj.isTarget}
                    />
                  )
                )}
              </p>
            );
          })}
        </div>
        <div className="flex gap-4">
          {!showAnswers ? (
            <Button
              disabled={isPending}
              pending={isPending}
              type="submit"
              className="w-40"
            >
              <span className="inline-flex items-center gap-2">
                <SendHorizontalIcon className="size-3" />
                Submit
              </span>
            </Button>
          ) : (
            <Button onClick={handleContinue} className="w-40">
              Continue to Textbook
            </Button>
          )}
        </div>
      </form>

      {results && showAnswers && (
        <div className="mt-4 space-y-2">
          <p>Click any word to see the correct answer.</p>
        </div>
      )}
    </div>
  );
};

function QuickFill() {
  return (
    <AdminButton
      size="lg"
      type="button"
      onClick={async () => {
        const form = document.getElementById("cloze-form");
        if (form) {
          const targetWords = Array.from(
            form.querySelectorAll("fieldset[data-target-word]")
          ) as HTMLFieldSetElement[];
          targetWords.forEach((field) => {
            const inputs = Array.from(
              field.querySelectorAll("input[type=text]")
            ) as HTMLInputElement[];

            inputs.forEach((input) => {
              const isTarget = input.dataset.isTarget === "true";
              if (isTarget) {
                input.value = "a";
              }
            });
          });
        }
      }}
    >
      Quick Fill
    </AdminButton>
  );
}

const splitWords = ({
  text,
  shouldTarget,
}: {
  text: string;
  shouldTarget: boolean;
}) => {
  const words: { text: string; isTarget: boolean }[] = [];
  let wordCounter = 0;

  const parts = text.split(/(\s+|[.!?,;:])/);

  parts.forEach((part) => {
    if (!part) return;
    if (/^\s+$/.test(part) || /^[.!?,;:]$/.test(part)) {
      words.push({ text: part, isTarget: false });
      return;
    }
    if (part.trim()) {
      words.push({
        text: part,
        isTarget: shouldTarget && isContentWord(part) && wordCounter % 2 === 1,
      });
      wordCounter++;
    }
  });

  return words;
};

const isContentWord = (word: string): boolean => {
  const contentWordRegex = /^[a-zA-Z]{4,}$/;
  return contentWordRegex.test(word);
};

const splitFirstSentence = (
  text: string
): { firstSentence: string; rest: string } => {
  const match = text.match(/^[^.!?]+[.!?]\s*/);
  if (!match) return { firstSentence: text, rest: "" };

  const firstSentence = match[0];
  const rest = text.slice(firstSentence.length);
  return { firstSentence, rest };
};
