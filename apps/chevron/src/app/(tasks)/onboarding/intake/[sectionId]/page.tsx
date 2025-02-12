import { redirect } from "next/navigation";

import { SurveySection } from "@/components/survey/survey-section";
import { getSession } from "@/lib/auth";
import { Survey } from "@/lib/constants";
import { routes, surveySectionRoute } from "@/lib/navigation";

export default async function IntakeSectionPage({
  params,
}: {
  params: Promise<unknown>;
}) {
  const { sectionId } = routes.intakeSurveySection.$parseParams(await params);
  const { user } = await getSession();
  if (!user) {
    return redirect(surveySectionRoute(Survey.INTAKE, sectionId));
  }

  return (
    <SurveySection
      user={user}
      surveyId={Survey.INTAKE}
      sectionId={sectionId}
      afterFinish={async () => {
        "use server";
        redirect(routes.cTest());
      }}
    />
  );
}
