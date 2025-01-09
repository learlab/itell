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
  // for each student, generate the object {page1: correctCount, page2: correctCount, ...}
  const byStudent = students.reduce<Record<string, Record<string, number>>>(
    (acc, cur) => {
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
        acc[name][entry.pageSlug] = entry.count;
      }

      return acc;
    },
    {}
  );
  const studentsArr = Object.entries(byStudent).map(([name, records]) => ({
    name,
    total: Object.keys(records).length,
    ...Object.fromEntries(
      quizPages.map((page) => [page.slug, records[page.slug] ?? -1])
    ),
  }));

  return <QuizTableClient data={studentsArr} quizPages={quizPages} />;
}

ClassQuizTable.Skeleton = function () {
  return <Skeleton className="h-80 w-full" />;
};

ClassQuizTable.ErrorFallback = CreateErrorFallback(
  "Failed to get quiz statistics"
);
