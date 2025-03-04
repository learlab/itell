"use client";

import React, { useEffect, useRef, useState } from "react";
import { redirect } from "next/navigation";
import { Alert, AlertDescription } from "@itell/ui/alert";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
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
  const getShowLetter = (word: string) => mode === "cloze" ? 0 : Math.ceil(word.length / 2);
  const formRef = useRef<HTMLFormElement>(null);
  const [uiState, setUiState] = useState<"initial" | "showingAnswers" | "showingContinue">("initial");
  const [results, setResults] = useState<{
    answers: Array<{ word: string; isCorrect: boolean }>;
    score?: number;
  } | null>(null);

  useEffect(() => {
    if (results && uiState === "initial") {
      applyVisualFeedback();
      setUiState("showingAnswers");
      
      // Add delay before showing continue button
      const timer = setTimeout(() => {
        setUiState("showingContinue");
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [results, uiState]);

  const applyVisualFeedback = () => {
    if (!formRef.current || !results) return;

    const fields = Array.from(
      formRef.current.querySelectorAll("fieldset[data-target-word]")
    ) as HTMLFieldSetElement[];

    fields.forEach((field, index) => {
      const word = field.dataset.targetWord as string;
      const inputs = Array.from(
        field.querySelectorAll("input[type=text]")
      ) as HTMLInputElement[];

      const answer = results.answers.find((a) => a.word === word);

      if (!answer) return;

      const targetInputs = inputs.filter((input) => input.dataset.isTarget === "true");

      targetInputs.forEach((input) => {
        const inputIndex = targetInputs.indexOf(input);
        const letterIndex = input.dataset.letterIndex ? parseInt(input.dataset.letterIndex) : inputIndex;
        const correctLetter = word[letterIndex];

        input.readOnly = true;

        if (answer.isCorrect) {
          input.style.backgroundColor = "#d1fae5";
          input.style.borderColor = "#10b981";
          input.style.color = "#047857";
        } else {
          input.style.backgroundColor = "#fee2e2";
          input.style.borderColor = "#ef4444";
          input.style.color = "#b91c1c";
          
          if (input.value !== correctLetter) {
            input.value = correctLetter;
          }
        }
      });
    });
  };

  const processForm = (form: HTMLFormElement) => {
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
          result.answers.push(input.value || " "); // allow empty answers
        } else {
          result.placeholders.push(input.value);
        }
      });

      clozeData.push(result);
      const joined = result.placeholders.join("") + result.answers.join("");
      const isCorrect = joined === word;
      
      if (isCorrect) {
        correctWords++;
      }
      answers.push({ word, isCorrect });
    });

    return {
      clozeData,
      answers,
      correctWords,
      totalWords: fields.length,
      score: (correctWords / fields.length) * 100
    };
  };

  const handleShowAnswers = () => {
    const form = formRef.current;
    if (!form) return;
    
    const { answers, score } = processForm(form);
    setResults({ answers, score });
    
    toast.success("Review your answers before continuing");
  };

  const { action, isPending, error } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget as HTMLFormElement;
      const { clozeData, correctWords, totalWords } = processForm(form);


      const [, err] = await createClozeAction({
        pageSlug: "ctest",
        totalWords,
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

      toast.success(
        "All onboarding tasks completed. Redirecting to the textbook ..."
      );
     
      redirect(
        user.pageSlug ? routes.textbook({ slug: user.pageSlug }) : routes.home()
      );

    }
  );

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
                  {firstSentence} 
                  {firstParagraphRest &&
                    splitWords({ text: firstParagraphRest, shouldTarget: true }).map(
                      (wordObj, wIndex) => (
                        <WordItem
                          key={`${pIndex}-${wIndex}`}
                          word={wordObj.text}
                          showLetter={getShowLetter(wordObj.text)}
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
                      showLetter={getShowLetter(wordObj.text)}
                      isTarget={wordObj.isTarget}
                    />
                  )
                )}
              </p>
            );
          })}
        </div>
        <div className="flex gap-4">
          {uiState === "initial" ? (
            <Button
              type="button"
              onClick={handleShowAnswers}
              className="w-40"
            >
              <span className="inline-flex items-center gap-2">
                <SendHorizontalIcon className="size-3" />
                Show Answers
              </span>
            </Button>
          ) : uiState === "showingContinue" && (
            <Button 
              type="submit"
              disabled={isPending}
              pending={isPending}
              className="w-40"
            >
              Continue to Textbook
            </Button>
          )}
        </div>
      </form>
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
