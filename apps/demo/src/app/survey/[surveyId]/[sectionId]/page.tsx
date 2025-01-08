import Form from "next/form";
import { notFound, redirect } from "next/navigation";
import { Errorbox } from "@itell/ui/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Prose } from "@itell/ui/prose";
import { Survey } from "#content";

import { upsertSurveyAction } from "@/actions/survey";
import { getSurveySessions } from "@/db/survey";
import { SurveySession } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { isAdmin } from "@/lib/auth/role";
import { routes } from "@/lib/navigation";
import { firstPage } from "@/lib/pages/pages.server";
import ScrollToTop from "../scroll-to-top";
import { getNextSectionId, getSurvey, getSurveySection } from "./data";
import { SurveyHeader } from "./survey-header";
import {
  SurveyQuestionRenderer,
  SurveySubmission,
} from "./survey-question-renderer";
import { SurveySubmitButton } from "./survey-submit-button";

export default async function SurveyQuestionPage(props: {
  params: Promise<unknown>;
}) {
  const { user } = await getSession();
  const params = routes.surveySection.$parseParams(await props.params);
  if (!user) {
    return redirect(
      routes.surveySection({
        surveyId: params.surveyId,
        sectionId: params.sectionId,
      })
    );
  }

  const survey = getSurvey(params.surveyId);
  const section = getSurveySection(params);
  if (!section || !survey) {
    return notFound();
  }
  const session = await getSurveySessions(user, params.surveyId);
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
      requiredUnifinishedSections[0].id === params.sectionId);

  return (
    <div className="flex min-h-[100vh] flex-col">
      <ScrollToTop />
      <SurveyHeader
        surveyId={params.surveyId}
        surveyTitle={survey.survey_name}
        sectionTitle={section.title}
        finished={!!sectionData}
      />
      <div className="w-full flex-1 space-y-4 bg-muted p-6">
        {section.display_rules && (
          <p>
            Please answer the follow-up questions based on your previous
            answers.
          </p>
        )}
        <Prose>{section.description}</Prose>
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
              surveyId: params.surveyId,
              sectionId: section.id,
              isFinished,
              data: submission,
            });

            if (isFinished) {
              return redirect(
                routes.textbook({ slug: user.pageSlug || firstPage.slug })
              );
            } else {
              redirect(
                routes.surveySection({
                  surveyId: params.surveyId,
                  sectionId: nextSectionId,
                })
              );
            }
          }}
        >
          {section.questions.map((question) => (
            <Card key={question.id}>
              {question.text && (
                <CardHeader>
                  <CardTitle>
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
                  isAdmin={isAdmin(user.role)}
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
    </div>
  );
}

// the diff set of all sections and sections with a record
function getUnfinishedSections({
  survey,
  session,
  sectionId,
}: {
  survey: Survey;
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
  section: ReturnType<typeof getSurveySection>,
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
