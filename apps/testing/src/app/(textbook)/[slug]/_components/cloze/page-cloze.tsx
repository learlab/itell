import { User } from "lucia";

import { createClozeAction } from "@/actions/cloze";
import { incrementUserPageSlugAction } from "@/actions/user";
import { ClozeSubmission, ClozeTest } from "@/components/cloze-test";
import { PageData } from "@/lib/pages";

export function PageCloze({ user, page }: { user: User; page: PageData }) {
  const action = async (submission: ClozeSubmission) => {
    "use server";

    await createClozeAction({
      pageSlug: page.slug,
      data: submission.map((item) => ({
        word: item.correctAnswer,
        answer: item.userAnswer,
      })),
      totalWords: submission.length,
      correctWords: submission.filter(
        (item) => item.correctAnswer === item.userAnswer
      ).length,
    });
    await incrementUserPageSlugAction({ currentPageSlug: page.slug });
  };
  return <ClozeTest onSubmit={action} />;
}
