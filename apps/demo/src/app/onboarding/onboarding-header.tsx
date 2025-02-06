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

export function OnboardingHeader({ user }: { user: User }) {
  const segments = useSelectedLayoutSegments();
  const isConsent = segments?.[0] === "consent";
  const isIntakeHome = segments?.length === 1 && segments[0] === Survey.INTAKE;
  const isIntakeSection =
    segments?.length === 2 && segments[0] === Survey.INTAKE;
  const intakeSectionTitle = isIntakeSection
    ? getSurveySection({ surveyId: Survey.INTAKE, sectionId: segments[1] })
        ?.title
    : "";
  const isCTest = segments?.[0] === "ctest";
  return (
    <header className="sticky top-0 z-50 flex h-[var(--nav-height)] items-center justify-between border-b bg-background px-6 py-4">
      <div className="flex items-center gap-1">
        <SidebarTrigger />
        <Breadcrumb>
          <BreadcrumbList className="sm:gap-2">
            <BreadcrumbItem>
              <BreadcrumbLink href={routes.onboarding()}>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                  {volume.title}
                </h1>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {segments?.length !== 0 && (
              <BreadcrumbSeparator className="[&>svg]:h-6 [&>svg]:w-6" />
            )}
            {isConsent && (
              <BreadcrumbItem className="text-lg font-medium">
                <BreadcrumbLink href={routes.consent()}>Consent</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {isCTest && (
              <BreadcrumbItem className="text-lg font-medium">
                <BreadcrumbLink href={routes.cTest()}>C Test</BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {isIntakeHome && (
              <BreadcrumbItem className="text-lg font-medium">
                <BreadcrumbLink href={routes.intakeSurvey()}>
                  Intake Survey
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}
            {isIntakeSection && (
              <>
                <BreadcrumbItem className="text-lg font-medium">
                  <BreadcrumbLink href={routes.intakeSurvey()}>
                    Intake Survey
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem className="text-lg font-medium">
                  <BreadcrumbLink
                    href={routes.intakeSurveySection({
                      sectionId: segments?.[1],
                    })}
                  >
                    {intakeSectionTitle}
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
