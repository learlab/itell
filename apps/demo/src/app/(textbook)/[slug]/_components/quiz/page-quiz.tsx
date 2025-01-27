import { revalidateTag } from "next/cache";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { User } from "lucia";

import { createQuizAction } from "@/actions/quiz";
import { QuizData } from "@/drizzle/schema";
import { isAdmin } from "@/lib/auth/role";
import { Tags } from "@/lib/constants";
import { QuizQuickFill } from "./page-quick-fill";
import { PageQuizSubmitButton } from "./page-quiz-submit-button";
import type { PageData } from "@/lib/pages";

export function PageQuiz({ user, page }: { user: User; page: PageData }) {
  if (!page.quiz) {
    return null;
  }
  const admin = isAdmin(user.role);
  const action = async (formData: FormData) => {
    "use server";
    const submission: QuizData = Array.from(formData.entries()).map(
      ([, value]) => String(value)
    );
    await createQuizAction({
      pageSlug: page.slug,
      data: submission,
    });

    revalidateTag(Tags.GET_QUIZ_ANSWER);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Take Quiz</CardTitle>
        <CardDescription>
          Great job finishing the chapter. Please take the quiz below to test
          your knowledge. You will only receive full credit after you finish all
          quizzes.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {admin && <QuizQuickFill />}
        <form action={action} id="page-quiz" className="grid gap-4">
          {page.quiz.map(({ question, answers }, qIndex) => (
            <div key={question} className="grid gap-3">
              <RadioGroup name={question} required className="gap-3">
                <h4 className="text-lg font-medium">{question}</h4>
                {answers.map(({ answer }, aIndex) => (
                  <div key={String(answer)} className="flex items-center gap-3">
                    <RadioGroupItem value={answer} id={`${qIndex}-${aIndex}`} />
                    <Label
                      htmlFor={`${qIndex}-${aIndex}`}
                      className="font-normal lg:text-base"
                    >
                      {answer}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}
          <footer>
            <PageQuizSubmitButton />
          </footer>
        </form>
      </CardContent>
    </Card>
  );
}
