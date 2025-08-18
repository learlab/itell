"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { CheckCircle, Eye, EyeOff, RotateCcw, XCircle } from "lucide-react";

import { Part, RenderParts } from "./cloze-test-parts";
import type React from "react";

interface Gap {
  start: number;
  end: number;
  gapped_text: string;
  original_word: string | null;
}

interface ClozeData {
  text: string;
  original_text: string;
  gaps: Gap[];
}

interface ClozeTestProps {
  data?: ClozeData;
  onSubmit?: (data: ClozeSubmission) => void;
}

export type ClozeSubmission = {
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}[];

export function ClozeTest({ onSubmit, data = defaultData }: ClozeTestProps) {
  const [results, setResults] = useState<ClozeSubmission | null>(null);
  const [answers, setAnswers] = useState<string[]>(() =>
    new Array(data.gaps?.length || 0).fill("")
  );
  const [showResults, setShowResults] = useState(false);
  const [showHints, setShowHints] = useState(true);
  const [hoveredGap, setHoveredGap] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const textParts = useMemo(() => {
    const parts: Part[] = [];
    let lastIndex = 0;

    data.gaps.forEach((gap, index) => {
      // Add text before gap
      if (gap.start > lastIndex) {
        parts.push(data.original_text.substring(lastIndex, gap.start));
      }

      // Add gap placeholder
      parts.push({ type: "gap", index, answer: gap.gapped_text });
      lastIndex = gap.end;
    });

    // Add remaining text
    if (lastIndex < data.original_text.length) {
      parts.push(data.original_text.substring(lastIndex));
    }

    return parts;
  }, [data]);

  const correctCount = results?.filter((r) => r.isCorrect).length || 0;
  const filledCount = answers.filter((answer) => answer.trim()).length;

  const handleInputChange = useCallback((index: number, value: string) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const nextIndex = index + 1;
        if (nextIndex < data.gaps.length) {
          inputRefs.current[nextIndex]?.focus();
        }
      }
    },
    [data.gaps.length]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const results = data.gaps.map((gap, index) => {
      const userAnswer = answers[index]?.trim() || "";
      const correctAnswer = gap.gapped_text;
      const isCorrect =
        userAnswer.toLowerCase() === correctAnswer.toLowerCase();

      return { userAnswer, correctAnswer, isCorrect };
    });
    setResults(results);
    setShowResults(true);
    onSubmit?.(results);
  };

  const handleReset = () => {
    setAnswers(new Array(data.gaps.length).fill(""));
    setShowResults(false);
    inputRefs.current[0]?.focus();
  };

  const handleMouseEnter = useCallback((index: number) => {
    setHoveredGap(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredGap(null);
  }, []);

  if (!data.gaps?.length || !data.original_text) {
    return (
      <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
        <CardContent className="p-6 text-center text-gray-500">
          No cloze test data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-gray-800">
            Complete the Passage
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHints(!showHints)}
              className="text-gray-600 hover:text-gray-800"
            >
              {showHints ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
              {showHints ? "Hide" : "Show"} Hints
            </Button>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {filledCount}/{data.gaps.length} filled
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {results && (
          <div
            className="mt-6 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50
              to-indigo-50 p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">📊 Results</h3>
              <Badge
                variant={
                  correctCount === data.gaps.length ? "default" : "secondary"
                }
                className={
                  correctCount === data.gaps.length ? "bg-green-501" : ""
                }
              >
                {correctCount}/{data.gaps.length} correct
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              {results?.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded border bg-white p-2"
                >
                  {result.isCorrect ? (
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 flex-shrink-0 text-red-500" />
                  )}
                  <span className="font-semibold text-gray-600">
                    {index + 1}.
                  </span>
                  <span
                    className={
                      result.isCorrect
                        ? "font-medium text-green-700"
                        : "text-red-700"
                    }
                  >
                    {result.userAnswer || "(empty)"}
                  </span>
                  {!result.isCorrect && (
                    <>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium text-green-700">
                        {result.correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="rounded-lg border bg-gray-50 p-6 text-lg leading-relaxed">
            <RenderParts
              parts={textParts}
              answers={answers}
              results={results}
              showResults={showResults}
              showHints={showHints}
              hoveredGap={hoveredGap}
              inputRefs={inputRefs}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>

          <div className="mt-6 flex justify-center gap-3">
            {!showResults ? (
              <Button type="submit" variant={"default"} size={"lg"}>
                ✓ Check Answers
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleReset}
                variant="outline"
                className="border-blue-300 bg-transparent px-8 text-blue-700 hover:bg-blue-50"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

const defaultData = {
  text: "The sky's blue appearance is a result of Earth's atmosphere, which plays a crucial role in sustaining life. The discussion shifts to mental and physical __________, exemplified by George Hood's record-breaking _____, highlighting the role of mental toughness and _____-derived neurotrophic factor (BDNF). BDNF, a protein fostering brain health and __________, increases with exercise, especially those _________ mental effort, like planking. The narrative includes patients battling severe __________, underlining the potential of planking and its mental demands to elevate BDNF and improve ____ quality. Despite ongoing research, the link between grit, BDNF, and physical _________ remains compelling, advocating further study to harness these ________.",
  original_text:
    "The sky's blue appearance is a result of Earth's atmosphere, which plays a crucial role in sustaining life. The discussion shifts to mental and physical resilience, exemplified by George Hood's record-breaking plank, highlighting the role of mental toughness and Brain-derived neurotrophic factor (BDNF). BDNF, a protein fostering brain health and resilience, increases with exercise, especially those requiring mental effort, like planking. The narrative includes patients battling severe conditions, underlining the potential of planking and its mental demands to elevate BDNF and improve life quality. Despite ongoing research, the link between grit, BDNF, and physical exercises remains compelling, advocating further study to harness these benefits.",
  gaps: [
    {
      start: 153,
      end: 163,
      gapped_text: "resilience",
      original_word: null,
    },
    {
      start: 210,
      end: 215,
      gapped_text: "plank",
      original_word: null,
    },
    {
      start: 263,
      end: 268,
      gapped_text: "Brain",
      original_word: null,
    },
    {
      start: 348,
      end: 358,
      gapped_text: "resilience",
      original_word: null,
    },
    {
      start: 402,
      end: 411,
      gapped_text: "requiring",
      original_word: null,
    },
    {
      start: 490,
      end: 500,
      gapped_text: "conditions",
      original_word: null,
    },
    {
      start: 591,
      end: 595,
      gapped_text: "life",
      original_word: null,
    },
    {
      start: 673,
      end: 682,
      gapped_text: "exercises",
      original_word: null,
    },
    {
      start: 745,
      end: 753,
      gapped_text: "benefits",
      original_word: null,
    },
  ],
};
