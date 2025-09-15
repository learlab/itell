import { Page } from "#content";
import { User } from "lucia";

import { createClozeAction } from "@/actions/cloze";
import { incrementUserPageSlugAction } from "@/actions/user";
import { ClozeSubmission, ClozeTest } from "@/components/cloze-test";
import { PageStatus } from "@/lib/page-status";

export function PageCloze({
  user,
  page,
  pageStatus,
}: {
  user: User;
  page: Page;
  pageStatus: PageStatus;
}) {
  if (!page.cloze_test) {
    return null;
  }
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
  return (
    <div className="flex flex-col gap-2">
      <ClozeTest
        data={page.cloze_test}
        pageStatus={pageStatus}
        nextPageSlug={page.next_slug}
        onSubmit={action}
      />
    </div>
  );
}
