import React from "react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@itell/ui/accordion";
import { Card, CardDescription, CardHeader, CardTitle } from "@itell/ui/card";
import { User } from "lucia";
import { FileTextIcon } from "lucide-react";

import { Meta } from "@/config/metadata";
import { getSurveySessions, isOuttakeReady } from "@/db/survey";
import { getSession } from "@/lib/auth";
import { Survey } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { DashboardHeader, DashboardShell } from "../_components/shell";

type FormEntry = {
  title: string;
  description: string;
  href: string;
  status: "pending" | "completed" | "in-progress" | "not-applicable";
};

async function getSurveyStatus(user: User) {
  const sessions = await getSurveySessions(user, [
    Survey.INTAKE,
    Survey.OUTTAKE,
  ]);
  let intakeStatus: FormEntry["status"] = "pending";
  let outtakeStatus: FormEntry["status"] = "not-applicable";

  const intake = sessions.find((session) => session.surveyId === Survey.INTAKE);
  if (intake) {
    intakeStatus = intake.finishedAt ? "completed" : "in-progress";
  }

  if (isOuttakeReady(user)) {
    const outtake = sessions.find(
      (session) => session.surveyId === Survey.OUTTAKE
    );
    if (outtake) {
      outtakeStatus = outtake.finishedAt ? "completed" : "in-progress";
    }
  }

  return { intake: intakeStatus, outtake: outtakeStatus };
}

export default async function FormsPage() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.dashboardForms(),
    });
  }

  const consentStatus = user.consentGiven !== null ? "completed" : "pending";
  const { intake: intakeStatus, outtake: outtakeStatus } =
    await getSurveyStatus(user);

  const forms: FormEntry[] = [
    {
      title: "Consent",
      description: "Learn about the study and give your consent.",
      href: "/consent",
      status: consentStatus,
    },
    {
      title: "Intake Survey",
      description: "Tell us about yourself and customize your experience",
      href: "/survey/intake",
      status: intakeStatus,
    },
    {
      title: "Outake Survey",
      description: "Share your learning experience and help us improve iTELL",
      href: "/survey/outtake",
      status: outtakeStatus,
    },
  ];

  const items = forms.reduce(
    (acc, item) => {
      if (item.status === "pending" || item.status === "in-progress") {
        acc["pending"].push(item);
      } else if (item.status === "completed") {
        acc["completed"].push(item);
      } else {
        acc["not-applicable"].push(item);
      }
      return acc;
    },
    {
      pending: [] as FormEntry[],
      "not-applicable": [] as FormEntry[],
      completed: [] as FormEntry[],
    } as Record<"pending" | "not-applicable" | "completed", FormEntry[]>
  );

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.forms.title}
        text={Meta.forms.description}
      />
      <Accordion
        type="multiple"
        defaultValue={["pending"]}
        className="flex flex-col gap-6"
      >
        <AccordionItem value="pending">
          <AccordionTrigger className="justify-start gap-2">
            <FileTextIcon className="size-6" />
            <span>Pending</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 xl:text-base">
            {items.pending.length === 0 ? (
              <p>No forms are required currently.</p>
            ) : (
              <p>
                Please finish the following forms at your earliest convenience.
              </p>
            )}
            <FormCards items={items.pending} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="completed">
          <AccordionTrigger className="justify-start gap-2">
            <FileTextIcon className="size-6" />
            <span>Completed</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 xl:text-base">
            <p>Thank you for completing the following forms.</p>
            <FormCards items={items.completed} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="not-applicable">
          <AccordionTrigger className="justify-start gap-2">
            <FileTextIcon className="size-6" />
            <span>Not Applicable</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-2 xl:text-base">
            <p>These forms are not relevant currently.</p>
            <FormCards items={items["not-applicable"]} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </DashboardShell>
  );
}

function FormCards({ items }: { items: FormEntry[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <FormCard key={item.title} item={item} />
      ))}
    </div>
  );
}

function FormCard({ item }: { item: FormEntry }) {
  return (
    <Link href={item.href} target="_blank">
      <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
