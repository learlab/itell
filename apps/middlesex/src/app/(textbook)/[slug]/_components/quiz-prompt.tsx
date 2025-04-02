import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { CheckCircleIcon, CircleIcon } from "lucide-react";

import { CreateErrorFallback } from "@/components/error-fallback";
import { getUserQuizzes } from "@/db/quiz";
import { routes } from "@/lib/navigation";
import { quizPages } from "@/lib/pages/pages.server";

export async function QuizPrompt({ userId }: { userId: string }) {
  const quizzes = await getUserQuizzes(userId);
  const pages = quizPages.map((p) => ({
    title: p.title,
    href: routes.textbook({ slug: p.slug, search: { quiz: true } }),
    finished: quizzes?.find((a) => a.pageSlug === p.slug) !== undefined,
  }));

  const allQuizFinished = pages.every((p) => p.finished);
  if (allQuizFinished) {
    return (
      <Card>
        <CardContent>
          <p>You have finished all quizzes. 🎉</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          You are close to finishing the entire textbook. Please make sure you also complete quizzes
          for all the following pages to receive full credit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {pages.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="flex items-center gap-2">
                {item.finished ? (
                  <CheckCircleIcon className="size-4 text-green-500" />
                ) : (
                  <CircleIcon className="size-4 text-muted-foreground" />
                )}
                <span>{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

QuizPrompt.ErrorFallback = CreateErrorFallback("Failed to retrieve previous quiz submissions");

QuizPrompt.Skeleton = function QuizPromptSkeleton() {
  return <Skeleton className="h-12" />;
};
