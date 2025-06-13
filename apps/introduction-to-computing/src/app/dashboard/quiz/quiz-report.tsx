import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { Page } from "#content";
import { delay, groupBy } from "es-toolkit";
import { CheckCircle2, FileText, Percent, XCircle } from "lucide-react";

import { CreateErrorFallback } from "@/components/error-fallback";
import { getUserQuizStats } from "@/db/quiz";
import { quizPages } from "@/lib/pages/pages.server";

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  Icon: React.ElementType;
};

function StatCard({ title, value, description, Icon }: StatCardProps) {
  return (
    <div className="bg-accent/70 rounded-lg border p-4">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <Icon className="size-4" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  );
}

function QuizSubmissionDetail({
  quiz,
  answers,
}: {
  quiz: Page["quiz"];
  answers: string[];
}) {
  return (
    <div className="flex flex-col gap-6">
      {quiz?.map((questionItem, qIndex) => {
        const studentAnswer = answers[qIndex];
        const correctAnswer = questionItem.answers.find(
          (a) => a.correct
        )?.answer;
        const isStudentCorrect = studentAnswer === correctAnswer;

        return (
          <div
            key={qIndex}
            className="border-l-4 pl-4 transition-colors duration-300"
            style={{ borderColor: isStudentCorrect ? "#22c55e" : "#ef4444" }}
          >
            <p className="mb-3 text-base font-semibold">
              {questionItem.question}
            </p>
            <ul className="space-y-2 text-sm">
              {questionItem.answers.map((answerItem, aIndex) => {
                const isCorrectAnswer = answerItem.correct;
                const isStudentChoice = studentAnswer === answerItem.answer;

                return (
                  <li key={aIndex} className="flex items-start gap-3">
                    <div className="mt-0.5 h-5 w-5 flex-shrink-0">
                      {isCorrectAnswer ? (
                        <CheckCircle2 className="h-full w-full text-green-500" />
                      ) : isStudentChoice ? (
                        <XCircle className="h-full w-full text-red-500" />
                      ) : (
                        <div className="h-full w-full" /> // Placeholder for alignment
                      )}
                    </div>
                    <span
                      className={` ${isStudentChoice && !isCorrectAnswer ? "font-semibold text-red-600" : ""}
                      ${isCorrectAnswer ? "font-semibold text-green-700" : ""} `}
                    >
                      {answerItem.answer}
                    </span>
                  </li>
                );
              })}
            </ul>
            {!studentAnswer && (
              <p className="mt-2 text-xs text-yellow-600 italic">
                Question not answered.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const getScoreColor = (correct: number, total: number) => {
  const percentage = total > 0 ? (correct / total) * 100 : 0;
  if (percentage >= 80) return "text-green-600";
  if (percentage >= 60) return "text-yellow-600";
  return "text-red-600";
};

export async function StudentQuizReport({
  userId,
  userName,
}: {
  userId: string;
  userName: string;
}) {
  await delay(1000);
  const submissions = await getUserQuizStats(userId);

  if (!submissions || submissions.length === 0) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tight">{userName}</h2>
        <div className="mt-4 rounded-lg border-2 border-dashed py-10 text-center">
          <p className="text-muted-foreground">No quiz is submitted yet.</p>
        </div>
      </div>
    );
  }

  const overallStats = submissions.reduce(
    (acc, cur) => {
      acc.totalCorrect += cur.correct;
      acc.totalAttempted += cur.total;
      return acc;
    },
    {
      totalCorrect: 0,
      totalAttempted: 0,
    }
  );
  const quizzesTaken = new Set(submissions.map((d) => d.pageSlug)).size;
  const leftQuizzes = quizPages.length - quizzesTaken;
  const attempts = submissions.length;

  const submissionsByPage = groupBy(submissions, (item) => item.pageSlug);
  const results: Array<{
    page: Page;
    submission: (typeof submissions)[number];
  }> = [];

  for (const page of quizPages) {
    if (submissionsByPage[page.slug]) {
      // TODO: currently only the first submission is used
      results.push({ page, submission: submissionsByPage[page.slug][0] });
    }
  }

  return (
    <Card className="space-y-8 rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-bold tracking-tight">{userName}</h1>
        </CardTitle>
        <CardDescription className="flex flex-col gap-1">
          <p className="text-muted-foreground text-lg font-medium">
            Quiz Report
          </p>
          <p className="text-muted-foreground text-sm">
            {leftQuizzes > 0 ? (
              <span>
                You have <span className="font-semibold">{leftQuizzes}</span>{" "}
                quizzes remaining, keep reading to finish all quizzes
              </span>
            ) : (
              `All quizzes are completed 🎉`
            )}
          </p>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <h2 className="sr-only text-lg font-semibold">Overall Statistics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            title="Overall Accuracy"
            value={`${((overallStats.totalCorrect / overallStats.totalAttempted) * 100).toFixed(1)}%`}
            description={`${overallStats.totalCorrect} / ${overallStats.totalAttempted} correct`}
            Icon={Percent}
          />
          <StatCard
            title="Quizzes Completed"
            value={quizzesTaken.toString()}
            description={`${attempts} total submissions`}
            Icon={FileText}
          />
        </div>

        <h2 className="text-lg font-semibold text-gray-700">
          Submission Details
        </h2>
        <div className="overflow-hidden rounded-lg border">
          {results.map((result) => (
            <div
              key={result.page.slug}
              className={"divide-border-200 divide-y"}
            >
              <details className="group">
                <summary
                  className="hover:bg-muted hover:text-muted-foreground flex cursor-pointer items-center
                    justify-between p-4"
                >
                  <span className="font-medium">{result.page.title}</span>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-semibold ${getScoreColor( result.submission.correct,
                      result.page.quiz!.length )}`}
                    >
                      {result.submission.correct} / {result.page.quiz?.length}
                    </span>
                    <svg
                      className="h-5 w-5 transform transition-transform duration-200 group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </summary>
                <div className="p-3">
                  <QuizSubmissionDetail
                    quiz={result.page.quiz}
                    answers={result.submission.data}
                  />
                </div>
              </details>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

StudentQuizReport.Skeleton = function QuizReportSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-12" />
        <Skeleton className="h-24" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[500px]" />
      </CardContent>
    </Card>
  );
};

StudentQuizReport.ErrorFallback = CreateErrorFallback(
  "Failed to get quiz statistics"
);
