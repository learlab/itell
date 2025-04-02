import Form from "next/form";
import { notFound, redirect } from "next/navigation";
import { Alert, AlertDescription } from "@itell/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Survey as SurveyType } from "#content";
import { User } from "lucia";
import { CircleHelp } from "lucide-react";

import { upsertSurveyAction } from "@/actions/survey";
import { getSurveySessions } from "@/db/survey";
import { SurveySession } from "@/drizzle/schema";
import { surveySectionRoute } from "@/lib/navigation";
import {
  getNextSectionId,
  getSurvey,
  SurveySubmission,
} from "@/lib/survey-question";
import { ScrollToTop } from "./scroll-to-top";
import { SurveyQuestionRenderer } from "./survey-question-renderer";
import { SurveySubmitButton } from "./survey-submit-button";

type Props = {
  user: User;
  surveyId: string;
  sectionId: string;
  afterFinish: () => Promise<void>;
};

export async function SurveySection({
  user,
  surveyId,
  sectionId,
  afterFinish,
}: Props) {
  const survey = getSurvey(surveyId);
  const section = survey?.sections.find((s) => s.id === sectionId);
  if (!section || !survey) {
    return notFound();
  }
  const session = await getSurveySessions(user.id, surveyId);
  const sectionData = session?.data?.[section.id];

  const unfinishedSections = getUnfinishedSections({
    survey,
    session,
    sectionId: section.id,
  });

  const requiredUnifinishedSections = unfinishedSections.filter(
    (s) => !s.display_rules
  );

  // will user finish survey after submitting this page
  const isLastPage =
    requiredUnifinishedSections.length === 0 ||
    (requiredUnifinishedSections.length === 1 &&
      requiredUnifinishedSections[0].id === sectionId);

  return (
    <>
      <ScrollToTop />
      <div className="w-full flex-1 space-y-4 rounded-md">
        {section.display_rules && (
          <p>
            Please answer the follow-up questions based on your previous
            answers.
          </p>
        )}
        {section.description && (
          <Alert variant={"info"}>
            <AlertDescription className="xl:text-lg">
              {section.description}
            </AlertDescription>
          </Alert>
        )}
        <Form
          className="flex flex-col gap-8"
          action={async (formData: FormData) => {
            "use server";
            const submission = await formDataToSubmission(section, formData);
            const nextSectionId = getNextSectionId({
              sections: unfinishedSections,
              submission,
            });
            // finished when there is no applicable section left
            const isFinished = nextSectionId === null;
            await upsertSurveyAction({
              surveyId,
              sectionId: section.id,
              isFinished,
              data: submission,
            });

            if (isFinished) {
              await afterFinish();
            } else {
              redirect(surveySectionRoute(surveyId, nextSectionId));
            }
          }}
        >
          {section.questions.map((question) => (
            <Card key={question.id} id={question.id} className="pt-0">
              {question.text && (
                <CardHeader className="bg-muted py-4">
                  <CardTitle className="flex items-start gap-2">
                    <CircleHelp className="stroke-muted-foreground size-6 flex-shrink-0" />
                    <legend className="text-lg font-medium tracking-tight xl:text-xl">
                      {question.text}
                    </legend>
                  </CardTitle>
                </CardHeader>
              )}
              <CardContent>
                <SurveyQuestionRenderer
                  key={question.id}
                  question={question}
                  sessionData={sectionData?.[question.id]}
                  isAdmin={user.isAdmin}
                />
              </CardContent>
            </Card>
          ))}

          <footer className="flex items-center justify-between">
            <div className="ml-auto">
              <SurveySubmitButton isLastPage={isLastPage} />
            </div>
          </footer>
        </Form>
      </div>
    </>
  );
}

// the diff set of all sections and sections with a record
function getUnfinishedSections({
  survey,
  session,
  sectionId,
}: {
  survey: SurveyType;
  session: SurveySession | null;
  sectionId: string;
}) {
  const finishedSections = new Set(
    [sectionId].concat(session?.data ? Object.keys(session.data) : [])
  );
  // NOTE: this may contain conditional sections that is not applicable
  // and will be checked in getNextSectionId
  return survey.sections.filter((x) => !finishedSections.has(x.id));
}

async function formDataToSubmission(
  section: SurveyType["sections"][number],
  formData: FormData
) {
  if (!section) {
    return {};
  }
  const submission: SurveySubmission = {};
  const entries = Array.from(formData.entries());
  section.questions.forEach((question) => {
    switch (question.type) {
      case "single_select":
      case "number_input":
      case "text_input":
      case "single_choice":
        submission[question.id] = String(formData.get(question.id));
        break;
      case "multiple_select":
        submission[question.id] = JSON.parse(
          String(formData.get(question.id))
        ) as Array<{ value: string; label: string }>;
        break;
      case "lextale":
        {
          const result: Record<string, boolean> = {};
          entries.forEach(([key, value]) => {
            if (!key.startsWith(`${question.id}--`)) {
              return;
            }
            const word = key.split("--")[1] as string;
            const val = value === "yes" ? true : false;
            result[word] = val;
          });
          submission[question.id] = result;
        }
        break;
      case "multiple_choice":
        {
          const result = [] as string[];
          entries.forEach(([key, value]) => {
            if (!key.startsWith(`${question.id}--`)) {
              return;
            }
            result.push(String(value));
          });

          submission[question.id] = result;
        }
        break;
      case "grid":
        {
          const result = {} as Record<string, string>;
          entries.forEach(([key, value]) => {
            if (!key.startsWith(`${question.id}--`)) {
              return;
            }

            const group = key.split("--")[1] as string;
            result[group] = String(value);
          });

          submission[question.id] = result;
        }
        break;
    }
  });

  return submission;
}
