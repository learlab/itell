"use client";

import React, { useRef } from "react";
import { Button } from "@itell/ui/button";
import { Errorbox } from "@itell/ui/callout";
import { Prose } from "@itell/ui/prose";
import { useActionStatus } from "use-action-status";

import { createClozeAction } from "@/actions/cloze";
import { AdminButton } from "@/components/admin-button";
import { ClozeData } from "@/drizzle/schema";
import { WordItem } from "./word-item";
import type { ShowLetter } from "./word-item";

interface Props {
  paragraphs: string[];
  isAdmin?: boolean;
  // number of revealed letters of each word,  0 = cloze test, 2 = c-test
  showLetter?: ShowLetter;
}

export const CTest = ({
  paragraphs,
  isAdmin = false,
  showLetter = 0,
}: Props) => {
  const formRef = useRef<HTMLFormElement>(null);

  const { action, isPending, error } = useActionStatus(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const form = e.currentTarget as HTMLFormElement;
      const fields = Array.from(
        form.querySelectorAll("fieldset[data-target-word]")
      ) as HTMLFieldSetElement[];

      let correctWords = 0;
      const clozeData: ClozeData = [];

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
            result.answers.push(input.value);
          } else {
            result.placeholders.push(input.value);
          }
        });

        clozeData.push(result);
        const joined = result.placeholders.join("") + result.answers.join("");
        if (joined === word) {
          correctWords++;
        }
      });

      const [, err] = await createClozeAction({
        pageSlug: "ctest",
        totalWords: fields.length,
        correctWords,
        data: clozeData,
      });
      if (err) {
        throw new Error("Failed to save answers, please try again later");
      }
    }
  );
  if (paragraphs.length < 1) return <p>not enough paragraphs</p>;

  const { firstSentence, rest: firstParagraphRest } = splitFirstSentence(
    paragraphs[0]
  );

  return (
    <div className="space-y-8">
      {isAdmin && <QuickFill />}
      {error && <Errorbox title={error.message} />}
      <form
        id="cloze-form"
        className="flex flex-col gap-4 rounded-lg p-6"
        ref={formRef}
        onSubmit={action}
      >
        <Prose className="space-y-3">
          {paragraphs.map((paragraph, pIndex) => {
            if (pIndex === 0) {
              return (
                <div key={pIndex}>
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
                </div>
              );
            }

            return (
              <div key={pIndex}>
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
              </div>
            );
          })}
        </Prose>
        <div className="flex gap-4">
          <Button disabled={isPending} pending={isPending} type="submit">
            Score
          </Button>
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
