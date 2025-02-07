import { Elements } from "@itell/constants";
import { cn } from "@itell/utils";
import { home } from "#content";

import { BrandIcon } from "@/components/brand-icon";
import { ClassCodeToast } from "@/components/class-code-toast";
import { ContinueReading } from "@/components/continue-reading";
import { HtmlRenderer } from "@/components/html-renderer";
import { MainNav } from "@/components/main-nav";
import { ScreenIssuePopup } from "@/components/screen-issue-popup";
import { TakeOnboarding } from "@/components/take-onboarding";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const { class_code_valid } = routes.home.$parseSearchParams(
    await searchParams
  );
  return (
    <>
      <MainNav read />
      <ClassCodeToast valid={class_code_valid} />
      <main
        className="mx-auto max-w-3xl flex-1 space-y-6 px-6 py-8 md:px-10 lg:px-16"
        id={Elements.TEXTBOOK_MAIN}
        tabIndex={-1}
      >
        <HtmlRenderer html={home.html} className="underline-offset-2" />
        <ScreenIssuePopup />
        <div className="flex items-center justify-center">
          <ActionButton />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function ActionButton() {
  const { user } = await getSession();
  if (user && !user.onboardingFinished) {
    return <TakeOnboarding />;
  }

  return <ContinueReading user={user} className="w-52" />;
}

function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      id={Elements.SITE_FOOTER}
      className={cn(
        "flex flex-row items-center justify-between border-t-2 border-border px-16 py-8 lg:px-32",
        className
      )}
    >
      <p className="text-center text-sm leading-loose md:text-left">
        A project by the Language and Educational Analytics Research (Lear)Lab
      </p>
      <a href="https://github.com/learlab/itell">
        <BrandIcon name="github/_/eee" />
        <span className="sr-only">github repository</span>
      </a>
    </footer>
  );
}
