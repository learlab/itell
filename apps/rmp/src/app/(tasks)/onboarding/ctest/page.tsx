import { volume } from "#content";

import { getSession } from "@/lib/auth";
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

  const paragraphs = splitParagraphs(volume.summary || "placeholder summary");
  return <CTest paragraphs={paragraphs} user={user} mode="ctest" />;
}

const splitParagraphs = (text: string): string[] => {
  return text.split(/\n\s*\n/).filter(Boolean);
};
