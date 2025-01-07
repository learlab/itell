import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";
import { CheckCircleIcon, CircleIcon } from "lucide-react";

import { getQuizAttemps } from "@/actions/quiz";
import { routes } from "@/lib/navigation";
import { quizPages } from "@/lib/pages/pages.server";
import { makePageHref } from "@/lib/utils";

export async function QuizPrompt() {
  const [attempts, err] = await getQuizAttemps();
  const pages = quizPages.map((p) => ({
    title: p.title,
    href: routes.textbook({ slug: p.slug, search: { quiz: true } }),
    finished: attempts?.find((a) => a.pageSlug === p.slug) !== undefined,
  }));

  if (err) {
    return (
      <Card>
        <CardContent>
          <p>
            You are close to finishing to entire textbook. We had trouble
            finding your quiz completion stauts. Please make sure you have
            finished all the quizzes to receive full credit.
          </p>
          <ul className="pl-4">
            {pages.map((page) => (
              <li key={page.href}>
                <a href={page.href}>{page.title}</a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  const allQuizFinished = pages.every((p) => p.finished);
  if (allQuizFinished) {
    return (
      <Card>
        <CardContent>
          <p>Are quizzes are finished 🎉</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          You are close to finishing the entire textbook. Please make sure you
          also complete quizzes for all the following pages to receive full
          credit.
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

QuizPrompt.Skeleton = function QuizPromptSkeleton() {
  return <Skeleton className="h-12" />;
};
