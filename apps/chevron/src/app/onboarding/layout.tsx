import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { volume } from "#content";

import { getOnboardingStatus } from "@/db/onboarding";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { OnboardingHeader } from "./onboarding-header";
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
  const status = await getOnboardingStatus(user);

  return (
    <SidebarProvider>
      <OnboardingSidebar status={status} />
      <SidebarInset>
        <OnboardingHeader user={user} />
        <main className="flex-1 py-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
