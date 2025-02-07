import { Skeleton } from "@itell/ui/skeleton";

import { CreateErrorFallback } from "@/components/error-fallback";
import { analyzeClassQuiz } from "@/db/quiz";
import { quizPages } from "@/lib/pages/pages.server";
import { QuizTableClient } from "./quiz-table-client";

export type QuizColumns = {
  name: string;
  total: number;
  [key: string]: string | number;
};

type Props = {
  classId: string;
  students: { name: string; id: string }[];
};

export async function ClassQuizTable({ students, classId }: Props) {
  const data = await analyzeClassQuiz(
    students.map((s) => s.id),
    classId
  );

  // loop through students instead of data to show all students in the table
  // for each student, get {page1: correctCount, page2: correctCount, ...}
  const byStudent = students.reduce<
    Record<string, Record<string, { correctCount: number; data: string[] }>>
  >((acc, cur) => {
    const entries = data.filter((d) => d.userId === cur.id);
    if (entries.length === 0) {
      acc[cur.name] = {};
      return acc;
    }
    const name = entries[0].name;

    if (!acc[name]) {
      acc[name] = {};
    }
    for (const entry of entries) {
      acc[name][entry.pageSlug] = {
        correctCount: entry.count,
        data: entry.data,
      };
    }

    return acc;
  }, {});
  const tableData = Object.entries(byStudent).map(([name, records]) => ({
    name,
    total: Object.keys(records).length,
    ...Object.fromEntries(
      quizPages.map((page) => [
        page.slug,
        {
          correctCount: records[page.slug]?.correctCount ?? -1,
          data: records[page.slug]?.data ?? null,
        },
      ])
    ),
  }));

  return <QuizTableClient data={tableData} quizPages={quizPages} />;
}

ClassQuizTable.Skeleton = function TableSkeleton() {
  return <Skeleton className="h-80 w-full" />;
};

ClassQuizTable.ErrorFallback = CreateErrorFallback(
  "Failed to get quiz statistics"
);
