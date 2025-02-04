import Link from "next/link";
import { buttonVariants } from "@itell/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@itell/ui/sidebar";
import { Skeleton } from "@itell/ui/skeleton";
import { cn } from "@itell/utils";
import { User } from "lucia";
import { BanIcon, CircleCheckIcon, CircleIcon } from "lucide-react";

import { getOnboardingStatus, TaskStatus } from "@/db/onboarding";
import { routes } from "@/lib/navigation";

export async function OnboardingSidebar({ user }: { user: User }) {
  const status = await getOnboardingStatus(user);
  return (
    <Sidebar>
      <SidebarHeader className="pt-0">
        <h2 className="py-4 text-xl font-semibold tracking-tight">
          Onboarding Tasks
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-1.5">
          <SidebarMenuItem>
            <SidebarMenuButton>
              <OnboardingLink status={status.consent} href={routes.consent()}>
                Consent Form
              </OnboardingLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <OnboardingLink
                status={status.intakeSurvey}
                href={routes.intakeSurvey()}
              >
                Intake Survey
              </OnboardingLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

OnboardingSidebar.Skeleton = function SidebarSkeleton() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-xl font-semibold tracking-tight">
          Onboarding Tasks
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </SidebarContent>
    </Sidebar>
  );
};

function OnboardingLink({
  status,
  className,
  children,
  ...props
}: { status: TaskStatus } & React.ComponentProps<typeof Link>) {
  const done = status === "done";
  const inProgress = status === "in-progress";
  const na = status === "not-applicable";
  return (
    <Link
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "flex w-full items-center justify-start gap-2 lg:text-base",
        {
          na: "pointer-events-none",
        },
        className
      )}
      aria-disabled={na}
      {...props}
    >
      {done ? (
        <CircleCheckIcon className="size-5 stroke-green-600" />
      ) : inProgress ? (
        <CircleIcon className="size-5 stroke-warning" />
      ) : (
        <BanIcon className="size-5" />
      )}
      {children}
    </Link>
  );
}
