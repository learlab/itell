import { notFound } from "next/navigation";
import { guides } from "#content";

import { TextbookComponents } from "@/components/content-components";
import { HtmlRenderer } from "@/components/html-renderer";
import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { getSession } from "@/lib/auth";
import { Condition } from "@/lib/constants";

export default async function GuidePage() {
  const { user } = await getSession();
  const userCondition = Condition.STAIRS;
  let guide = guides.find((g) => g.condition === userCondition);

  if (!guide) {
    guide = guides.find((g) => g.condition === Condition.STAIRS);
    if (!guide) {
      return notFound();
    }
  }

  // allow unauthenticated access
  incrementView({
    userId: user?.id ?? "",
    pageSlug: Meta.guide.slug,
    type: "guide_page_view",
    data: { condition: userCondition },
  });

  return (
    <>
      <h2
        className="mb-4 text-center text-2xl font-extrabold tracking-tight text-balance md:text-3xl
          2xl:text-4xl"
      >
        iTELL User Guide
      </h2>
      <HtmlRenderer components={TextbookComponents} html={guide.html} />
    </>
  );
}
