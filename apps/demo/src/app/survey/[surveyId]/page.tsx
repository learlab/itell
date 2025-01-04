import { notFound } from "next/navigation";
import { buttonVariants } from "@itell/ui/button";
import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";
import { cn } from "@itell/utils";
import { Survey } from "#content";

import { getSurveyAction } from "@/actions/survey";
import { NavigationButton } from "@/components/navigation-button";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { getSurvey } from "./[sectionId]/data";
import { SurveyHomeShell } from "./shell";
import { SurveySidebar } from "./survey-sidebar";

export default async function SurveyHomePage(props: {
  params: Promise<unknown>;
}) {
  const { user } = await getSession();
  const params = routes.surveyHome.$parseParams(await props.params);

  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.surveyHome({ surveyId: params.surveyId }),
    });
  }
  const survey = getSurvey(params.surveyId);
  if (!survey) {
    return notFound();
  }

  const [surveySession] = await getSurveyAction({ surveyId: params.surveyId });
  const targetSectionId =
    !surveySession || !surveySession.data
      ? survey.sections[0].id
      : getTargetSectionId(survey, surveySession.data);

  return (
    <SidebarProvider>
      <SurveySidebar
        variant="inset"
        surveyId={params.surveyId}
        surveySession={surveySession ?? undefined}
      />
      <SidebarInset>
        <SurveyHomeShell surveyId={params.surveyId} user={user}>
          <h1 className="text-3xl font-semibold tracking-tight">
            {survey.survey_name}
          </h1>
          <p>{survey.survey_description}</p>
          <NavigationButton
            href={routes.surveySection({
              surveyId: survey.survey_id,
              sectionId: targetSectionId,
            })}
            className={cn(buttonVariants({ size: "lg" }), "md:text-lg")}
          >
            {surveySession ? "Continue Survey" : "Start Survey"}
          </NavigationButton>
        </SurveyHomeShell>
      </SidebarInset>
    </SidebarProvider>
  );
}

const getTargetSectionId = (survey: Survey, data: Record<string, unknown>) => {
  const visitedSections = Object.keys(data);
  const lastIdx = visitedSections.reduce((acc, sectionId) => {
    const idx = survey.sections.findIndex(
      (section) => section.id === sectionId
    );
    return Math.max(acc, idx);
  }, 0);
  if (lastIdx === survey.sections.length - 1) {
    return survey.sections[lastIdx].id;
  }
  return survey.sections[lastIdx + 1].id;
};
