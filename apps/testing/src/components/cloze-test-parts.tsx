"use client";

import { CheckCircle, XCircle } from "lucide-react";

import type React from "react";

export type Part =
  | string
  | {
      type: "gap";
      index: number;
      answer: string;
    };

interface Result {
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

interface RenderPartsProps {
  parts: Part[];
  answers: string[];
  results: Result[] | null;
  showResults: boolean;
  showHints: boolean;
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
  showHints,
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
        const result = results?.[index];
        const isCorrect = result?.isCorrect;
        const isIncorrect = showResults && !isCorrect && answers[index]?.trim();

        return (
          <span key={`gap-${index}`} className="relative inline-block">
            <input
              // @ts-expect-error
              ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)}
              type="text"
              value={answers[index] || ""}
              onChange={(e) => onInputChange(index, e.target.value)}
              onKeyDown={(e) => onKeyDown(e, index)}
              onMouseEnter={() => onMouseEnter(index)}
              onMouseLeave={onMouseLeave}
              className={`mx-1 inline-block min-w-[80px] border-b-2 bg-transparent px-2 py-1 text-center
              font-medium transition-colors duration-200 focus:outline-none ${
              isCorrect
                  ? "border-green-500 bg-green-50 text-green-700"
                  : isIncorrect
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-blue-300 hover:border-blue-500 focus:border-blue-600"
              } `}
              style={{
                width: `${Math.max(80, Math.min(200, answer.length * 12))}px`,
              }}
              required
              disabled={showResults}
            />

            {showHints && hoveredGap === index && !showResults && (
              <div
                className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 transform rounded bg-gray-800
                  px-2 py-1 text-xs whitespace-nowrap text-white"
              >
                {answer.length} letters
              </div>
            )}

            {showResults && (
              <span className="bg-background absolute top-full right-1/2 z-1 translate-x-1/2 -translate-y-1/2">
                {isCorrect ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : isIncorrect ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : null}
              </span>
            )}
          </span>
        );
      })}
    </>
  );
}
