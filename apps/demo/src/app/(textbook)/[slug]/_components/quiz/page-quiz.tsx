import { revalidateTag } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { User } from "lucia";

import { createQuizAction } from "@/actions/quiz";
import { incrementUserPageSlugAction } from "@/actions/user";
import { QuizData } from "@/drizzle/schema";
import { Tags } from "@/lib/constants";
import { QuizQuickFill } from "./page-quick-fill";
import { QuizForm } from "./quiz-form";
import type { PageData } from "@/lib/pages";

export function PageQuiz({ user, page }: { user: User; page: PageData }) {
  if (!page.quiz) {
    return null;
  }
  const action = async (formData: FormData) => {
    "use server";
    const submission: QuizData = Array.from(formData.entries()).map(
      ([, value]) => String(value)
    );
    await createQuizAction({
      pageSlug: page.slug,
      data: submission,
    });

    await incrementUserPageSlugAction({ currentPageSlug: page.slug });

    revalidateTag(Tags.GET_QUIZ_ANSWER);
  };

  return (
    <Card className="border-info">
      <CardHeader>
        <CardTitle>Take Quiz</CardTitle>
        <CardDescription>
          Great job finishing the chapter. Please take the quiz below to test
          your knowledge. You will only receive full credit after you finish all
          quizzes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {user.isAdmin && <QuizQuickFill />}
        <QuizForm onSubmit={action} page={page} />
      </CardContent>
    </Card>
  );
}
