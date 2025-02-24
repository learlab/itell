import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { volume } from "#content";

import { getOnboardingStatus } from "@/db/onboarding";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TasksSidebar } from "../task-sidebar";
import { OnboardingHeader } from "./onboarding-header";

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
  const sidebarItems = [
    {
      label: "Consent Form",
      status: status.consent,
      href: routes.consent(),
    },
    {
      label: "Intake Survey",
      status: status.intakeSurvey,
      href: routes.intakeSurvey(),
    },
    {
      label: "C Test",
      status: status.ctest,
      href: routes.ctest(),
    },
  ];

  return (
    <SidebarProvider className="group">
      <TasksSidebar
        items={sidebarItems}
        header={
          <Link
            className="py-4 text-xl font-semibold tracking-tight hover:underline hover:underline-offset-2"
            href={routes.onboarding()}
          >
            Onboarding Tasks
          </Link>
        }
        footer={
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>About Onboarding</AccordionTrigger>
              <AccordionContent>
                Before getting start on the textbook, we ask you to complete
                several forms and a test to better set up your learning
                environment. Once you finish all the tasks, you will be
                redirected to the personalized textbook.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        }
      />
      <SidebarInset>
        <OnboardingHeader user={user} />
        <main className="flex-1 p-4 group-has-[[data-pending]]:animate-pulse lg:px-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
