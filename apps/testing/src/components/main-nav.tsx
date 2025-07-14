import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Elements } from "@itell/constants";
import { Skeleton } from "@itell/ui/skeleton";
import { volume } from "#content";

import { getSession } from "@/lib/auth";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { CommandMenu } from "./command-menu";
import { ContinueReading } from "./continue-reading";
import { MobileNav } from "./mobile-nav";
import { UserProgressIndicator } from "./progress-indicator";
import { ScrollProgress } from "./scroll-progress";
import { SiteNav } from "./site-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserAccountNav } from "./user-account-nav";

type Props = {
  scrollProgress?: boolean;
  read?: boolean;
};

export async function MainNav({ scrollProgress, read }: Props) {
  const { user } = await getSession();

  return (
    <SiteNav mainContentId={Elements.TEXTBOOK_MAIN} className="border-b-2">
      <div
        className="grid h-[var(--nav-height)] grid-cols-[auto_1fr_auto] items-center
          justify-between gap-4 px-6 sm:space-x-0"
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-6">
            <Image
              src="/images/itell.svg"
              alt="itell logo"
              width={28}
              height={30}
              priority
            />
            <span
              className="hidden font-bold md:inline-block"
              data-testid="site-title"
            >
              {volume.title}
            </span>
          </Link>
          {read ? (
            <ContinueReading
              user={user}
              className="hidden md:flex"
              text="Read"
              variant="outline"
              size="default"
            />
          ) : null}
          <MobileNav
            items={allPagesSorted.map((page) => ({
              title: page.title,
              href: page.href,
            }))}
          />
        </div>

        {user && (
          <div className="flex justify-center">
            <Suspense fallback={<Skeleton className="w-24" />}>
              <UserProgressIndicator user={user} />
            </Suspense>
          </div>
        )}

        <div className="ml-auto flex items-center gap-2">
          <CommandMenu />
          <ThemeToggle />
          <UserAccountNav user={user} />
        </div>
      </div>

      {scrollProgress ? <ScrollProgress /> : null}
    </SiteNav>
  );
}
