import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@itell/ui/alert";
import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { volume } from "#content";
import { User } from "lucia";
import { BanIcon } from "lucide-react";

import { ContinueReading } from "@/components/continue-reading";
import { getOffboardingStatus, isOuttakeReady } from "@/db/offboarding";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TasksSidebar } from "../task-sidebar";
import { OffboardingHeader } from "./offboarding-header";

export const generateMetadata = (): Metadata => {
  const title = "Offboarding";
  const description = `Share your learning experience and help us improve iTELL`;

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
      url: `${env.NEXT_PUBLIC_HOST}/offboarding`,
      images: [
        {
          url: ogUrl,
        },
      ],
    },
  };
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.offboarding(),
    });
  }
  const ready = isOuttakeReady(user);
  const status = await getOffboardingStatus(user);
  const items = [
    {
      label: "Outtake Survey",
      status: status.outtakeSurvey,
      href: routes.outtakeSurvey(),
    },
  ];
  return (
    <SidebarProvider className="group">
      <TasksSidebar
        items={items}
        header={
          <Link
            className="py-4 text-xl font-semibold tracking-tight hover:underline hover:underline-offset-2"
            href={routes.offboarding()}
          >
            Offboarindg Tasks
          </Link>
        }
        footer={
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>About Offboarding</AccordionTrigger>
              <AccordionContent className="space-y-2">
                <p>
                  You are getting close to finishing the entire textbook! 🎉
                </p>
                <p>
                  Please spend some time sharing your learning experience and
                  let us know how can we improve iTELL.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        }
      />
      <SidebarInset>
        <OffboardingHeader user={user} />
        <main className="flex-1 p-4 group-has-[[data-pending]]:animate-pulse lg:px-8">
          {ready ? children : <NotReady user={user} />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function NotReady({ user }: { user: User }) {
  return (
    <Alert variant={"warning"}>
      <BanIcon className="size-4" />
      <AlertTitle>Not applicable</AlertTitle>
      <AlertDescription>
        Offboarding will be ready after you finish all textbook pages.
      </AlertDescription>
      <div className="mt-4">
        <ContinueReading user={user} />
      </div>
    </Alert>
  );
}
