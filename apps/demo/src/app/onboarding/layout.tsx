import { Suspense } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@itell/ui/sidebar";
import { volume } from "#content";
import { User } from "lucia";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { OnboardingSidebar } from "./onboarding-sidebar";

export const generateMetadata = () => {
  const title = "Onboarding";
  const description = `Set up your intelligent textbook`;

  const ogUrl = new URL(`${env.NEXT_PUBLIC_HOST}/og`);
  ogUrl.searchParams.set("title", title);
  ogUrl.searchParams.set("description", description);
  return {
    title,
    description,
    metadataBase: new URL(env.NEXT_PUBLIC_HOST),
    openGraph: {
      title: `${title} | ${volume.title}`,
      description,
      type: "article",
      url: `${env.NEXT_PUBLIC_HOST}/onboarding`,
      images: [
        {
          url: ogUrl,
        },
      ],
    },
  };
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.onboarding(),
    });
  }

  return (
    <SidebarProvider>
      <Suspense fallback={<OnboardingSidebar.Skeleton />}>
        <OnboardingSidebar user={user} />
      </Suspense>
      <SidebarInset>
        <OnboardingHeader user={user} />
        <main className="flex-1 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function OnboardingHeader({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-50 flex h-[var(--nav-height)] items-center justify-between border-b bg-background px-6 py-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <h1 className="text-xl font-semibold tracking-tight">{volume.title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserAccountNav user={user} />
      </div>
    </header>
  );
}
