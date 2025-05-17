"use client";

import React from "react";
import { useSelectedLayoutSegments } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@itell/ui/breadcrumb";
import { SidebarTrigger } from "@itell/ui/sidebar";
import { volume } from "#content";
import { User } from "lucia";

import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { Survey } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { getSurveySection } from "@/lib/survey-question";

export function OffboardingHeader({ user }: { user: User }) {
  const segments = useSelectedLayoutSegments();
  const isOuttakeHome =
    segments?.length === 1 && segments[0] === Survey.OUTTAKE;
  const isOuttakeSection =
    segments?.length === 2 && segments[0] === Survey.OUTTAKE;
  const outtakeSectionTitle = isOuttakeSection
    ? getSurveySection({ surveyId: Survey.OUTTAKE, sectionId: segments[1] })
        ?.title
    : "";
  return (
    <header className="sticky top-0 z-50 flex h-[var(--nav-height)] items-center justify-between border-b bg-background px-6 py-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink href={routes.offboarding()}>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  {volume.title}
                </h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments?.length !== 0 && (
              <BreadcrumbSeparator className="[&>svg]:h-6 [&>svg]:w-6" />
            )}
            {isOuttakeHome && (
              <BreadcrumbItem className="text-lg font-medium">
                <BreadcrumbLink href={routes.outtakeSurvey()}>
                  Outtake Survey
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {isOuttakeSection && (
              <>
                <BreadcrumbItem className="text-lg font-medium">
                  <BreadcrumbLink href={routes.outtakeSurvey()}>
                    Outtake Survey
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-lg font-medium">
                  <BreadcrumbLink
                    href={routes.outtakeSurveySection({
                      sectionId: segments?.[1],
                    })}
                  >
                    {outtakeSectionTitle}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <UserAccountNav user={user} />
      </div>
    </header>
  );
}
