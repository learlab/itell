"use client";

import { cn } from "@itell/utils";

import type React from "react";
import type { ClozeSubmission } from "./cloze-test";

export type Part = string | { type: "gap"; index: number; answer: string };

interface RenderPartsProps {
  parts: Part[];
  answers: string[];
  results: ClozeSubmission | null;
  showResults: boolean;
  hoveredGap: number | null;
  inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onInputChange: (index: number, value: string) => void;
  onKeyDown: (e: React.KeyboardEvent, index: number) => void;
  onMouseEnter: (index: number) => void;
  onMouseLeave: () => void;
}

export function RenderParts({
  parts,
  answers,
  results,
  showResults,
  hoveredGap,
  inputRefs,
  onInputChange,
  onKeyDown,
  onMouseEnter,
  onMouseLeave,
}: RenderPartsProps) {
  return (
    <>
      {parts.map((part, partIndex) => {
        if (typeof part === "string") {
          return (
            <span key={partIndex} className="text-gray-800">
              {part}
            </span>
          );
        }

        const { index, answer } = part;
        const userAnswer = answers[index] || "";
        const result = results?.[index];
        const isHovered = hoveredGap === index;

        if (showResults && results && result) {
          if (result.isCorrect) {
            // Correct answer - show in green
            return (
              <span
                key={partIndex}
                className="inline-flex items-center gap-1 rounded-sm bg-green-100 px-1 py-0.5 font-medium
                  text-green-800"
              >
                {result.userAnswer || result.correctAnswer}
              </span>
            );
          } else {
            // Incorrect answer - show diff style with strikethrough user answer and correct answer
            return (
              <span key={partIndex} className="inline-flex items-center gap-1">
                {result.userAnswer ? (
                  <>
                    <span
                      className="inline-flex items-center gap-1 rounded-sm bg-red-100 px-1 py-0.5 text-red-700
                        line-through"
                    >
                      {result.userAnswer}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-sm bg-green-100 px-1 py-0.5 font-medium
                        text-green-800"
                    >
                      {result.correctAnswer}
                    </span>
                  </>
                ) : (
                  // Empty answer case
                  <>
                    <span
                      className="inline-flex items-center gap-1 rounded-sm bg-red-100 px-1 py-0.5 text-red-700
                        italic"
                    >
                      (empty)
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-sm bg-green-100 px-1 py-0.5 font-medium
                        text-green-800"
                    >
                      {result.correctAnswer}
                    </span>
                  </>
                )}
              </span>
            );
          }
        }

        // Show input field during test or after reset
        return (
          <span key={partIndex} className="relative inline-block">
            <input
              // @ts-expect-error
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              required
              value={userAnswer}
              onChange={(e) => onInputChange(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={onMouseLeave}
              className={cn(
                `inline-block min-w-[80px] border-b-2 border-dashed border-gray-400
                bg-transparent px-1 py-0.5 text-center text-gray-800 transition-colors
                outline-none`,
                "focus:border-blue-500 focus:bg-blue-50",
                isHovered && "bg-gray-100",
                userAnswer && "border-solid border-blue-400 bg-blue-50"
              )}
              placeholder=""
              style={{
                width: `${Math.max(userAnswer.length * 12 + 20, 80)}px`,
              }}
            />
          </span>
        );
      })}
    </>
  );
}
