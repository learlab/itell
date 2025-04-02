import QuizMeBox, { QuizMeObject } from "@quizme/question-box";

import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { redirectWithSearchParams } from "@/lib/utils";

const questions = allPagesSorted.reduce<Record<string, QuizMeObject[]>>(
  (acc, page) => {
    if (page.cri.length > 0) {
      acc[page.slug] = page.cri.map((cri) => ({
        ...cri,
        pageSlug: page.slug,
      }));
    }

    return acc;
  },
  {}
);

export default async function QuizMe() {
  const { user } = await getSession();
  if (!user || !user.finished) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.home(),
    });
  }

  const allQuestions: QuizMeObject[] = Object.values(questions).flat();
  return <QuizMeBox questions={allQuestions} />;
}
