import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { ErrorBoundary } from "react-error-boundary";

import { Meta } from "@/config/metadata";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { quizPages } from "@/lib/pages/pages.server";
import { redirectWithSearchParams } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "../_components/shell";
import { StudentQuizReport } from "./quiz-report";

export default async function QuizPage() {
  const { user } = await getSession();

  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.dashboardQuiz(),
    });
  }
  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.quiz.title} text={Meta.quiz.description} />

      {quizPages.length > 0 ? (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardDescription>
              At the end of certain milestone pages in the textbook, you will be
              asked to complete a quiz to test your understanding of the
              material. You will complete{" "}
              <span className="font-semibold">{quizPages.length} quizzes</span>{" "}
              in total. Below is a summary report of your current quiz
              performance.{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<StudentQuizReport.Skeleton />}>
              <ErrorBoundary fallback={<StudentQuizReport.ErrorFallback />}>
                <StudentQuizReport
                  userId={user.id}
                  userName={user.name || user.email || "Anonymous User"}
                />
              </ErrorBoundary>
            </Suspense>
          </CardContent>
        </Card>
      ) : (
        <p className="p-2">
          This textbook does not contain any quizzes, you are good to go.
        </p>
      )}
    </DashboardShell>
  );
}
