"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { buttonVariants } from "@itell/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@itell/ui/sidebar";
import { cn } from "@itell/utils";
import {
  BanIcon,
  CircleCheckIcon,
  CircleIcon,
  LoaderCircleIcon,
} from "lucide-react";

import { OnboardingStatus, TaskStatus } from "@/db/onboarding";
import { routes } from "@/lib/navigation";

export function OnboardingSidebar({ status }: { status: OnboardingStatus }) {
  const items = [
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
      status: status.cTest,
      href: routes.cTest(),
    },
  ];
  return (
    <Sidebar>
      <SidebarHeader className="pt-0">
        <Link
          className="py-4 text-xl font-semibold tracking-tight hover:underline hover:underline-offset-2"
          href={routes.onboarding()}
        >
          Onboarding Tasks
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <OnboardingLink status={item.status} href={item.href}>
                {item.label}
              </OnboardingLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>About Onboarding</AccordionTrigger>
            <AccordionContent>
              Before getting start on the textbook, we ask you to complete
              several forms and a test to better set up your learning
              environment. Once you finish all the tasks, you will be redirected
              to the personalized textbook.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SidebarFooter>
    </Sidebar>
  );
}

function OnboardingLink({
  status,
  className,
  children,
  ...props
}: { status: TaskStatus; active?: boolean } & React.ComponentProps<
  typeof Link
>) {
  const segment = useSelectedLayoutSegment();
  const done = status === "done";
  const ready = status === "ready";
  const inProgress = status === "in-progress";
  const na = status === "not-applicable";
  const isActive = segment && (props.href as string).endsWith(segment);
  return (
    <SidebarMenuButton
      className={na ? "pointer-events-none cursor-not-allowed" : ""}
    >
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex w-full items-center justify-start gap-2 py-3 lg:text-base",
          isActive && "bg-accent text-accent-foreground",
          className
        )}
        aria-disabled={na}
        {...props}
      >
        {done ? (
          <CircleCheckIcon className="size-5 stroke-green-600" />
        ) : ready ? (
          <CircleIcon className="size-5 stroke-warning" />
        ) : inProgress ? (
          <LoaderCircleIcon className="size-5 stroke-warning" />
        ) : (
          <BanIcon className="size-5" />
        )}
        {children}
      </Link>
    </SidebarMenuButton>
  );
}
