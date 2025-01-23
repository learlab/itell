import { volume } from "#content";

import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { CTest } from "./c-test";

export default async function Page() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.ctest(),
    });
  }
  const paragraphs = splitParagraphs(volume.summary);
  const admin = isAdmin(user.role);
  return (
    <div className="mx-auto max-w-4xl p-6">
      <CTest paragraphs={paragraphs} isAdmin={admin} showLetter={2} />
    </div>
  );
}

const splitParagraphs = (text: string): string[] => {
  return text.split(/\n\s*\n/).filter(Boolean);
};
