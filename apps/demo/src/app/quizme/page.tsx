import { redirect } from "next/navigation";
import { volume } from "#content";
import { User } from "lucia";

import { getSession } from "@/lib/auth";

import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

import { allPagesSorted, getPageData } from "@/lib/pages/pages.server";

import QuizMeBox, { QuizMeObject } from "@quizme/question-box";

const questions = allPagesSorted.reduce<
  Record<string, QuizMeObject[]>
>((acc, page) => {
  if (page.cri.length > 0) {
    acc[page.slug] = page.cri.map((cri) => ({
      ...cri,
      pageSlug: page.slug,
    }));
  }

  return acc;
}, {});


export default async function QuizMe({ searchParams }: { searchParams: Promise<unknown> }) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("/auth", { redirect_to: routes.consent() });
  }

  const allQuestions: QuizMeObject[] = Object.values(questions).flat();

  return (
    <>
      <QuizMeBox
        quizmeList={allQuestions}
      />
    </>
  );
};
