"use client";

import {
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { cn } from "@itell/utils";
import { Page } from "#content";
import {
  CheckCircle,
  CircleCheckBigIcon,
  Eye,
  EyeOff,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { PageStatus } from "@/lib/page-status";
import { makePageHref } from "@/lib/utils";
import { Part, RenderParts } from "./cloze-test-parts";
import type React from "react";

interface ClozeTestProps {
  data: NonNullable<Page["cloze_test"]>;
  nextPageSlug: string | null;
  onSubmit?: (data: ClozeSubmission) => void;
  pageStatus: PageStatus;
}

export type ClozeSubmission = {
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}[];

export function ClozeTest({
  onSubmit,
  data,
  nextPageSlug,
  pageStatus,
}: ClozeTestProps) {
  const [results, setResults] = useState<ClozeSubmission | null>(null);
  const [answers, setAnswers] = useState<string[]>(() =>
    new Array(data.gaps?.length || 0).fill("")
  );
  const [showResults, setShowResults] = useState(false);
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

    toast.success("Congrats! You finished this page.", {
      description: () =>
        nextPageSlug ? (
          <Link
            href={makePageHref(nextPageSlug)}
            className={cn(
              "flex items-center gap-1 font-semibold underline underline-offset-4"
            )}
          >
            Next Page
          </Link>
        ) : undefined,
    });
  };

  const handleReset: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnswers(new Array(data.gaps.length).fill(""));
    setResults(null);
    setShowResults(false);
    // Focus first input after state update
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 0);
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
    <Card className="shadow-lg backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-pretty text-gray-800">
          Fill in the blanks using your best guesses. If multiple words could
          work, choose your first choice and keep going.
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <p>
            After you finish this assignment, click the "Submit Answers" button
            to unlock the next page.
          </p>

          <div className="flex flex-1 items-center gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {filledCount}/{data.gaps.length} filled
            </Badge>
            {results && (
              <Badge
                variant={
                  correctCount === data.gaps.length ? "default" : "secondary"
                }
                className={cn(
                  correctCount === data.gaps.length
                    ? "bg-green-500 text-white"
                    : "bg-orange-100 text-orange-800"
                )}
              >
                {correctCount}/{data.gaps.length} correct
              </Badge>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="rounded-lg border bg-gray-50 p-6 text-lg leading-relaxed">
            <RenderParts
              parts={textParts}
              answers={answers}
              results={results}
              showResults={showResults}
              hoveredGap={hoveredGap}
              inputRefs={inputRefs}
              onInputChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </div>

          <div className="mt-6 flex gap-3">
            {!showResults ? (
              <Button type="submit" variant={"default"} size={"lg"}>
                <CircleCheckBigIcon className="mr-2 size-4" /> Submit Answers
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
        <p className="text-muted-foreground text-sm">
          Each correct word will be given one point. Provided words will need to
          match exactly for accurate scoring
        </p>
      </CardContent>
    </Card>
  );
}
