import { redirect } from "next/navigation";

import { SurveySection } from "@/components/survey/survey-section";
import { updateUser } from "@/db/user";
import { getSession } from "@/lib/auth";
import { Survey } from "@/lib/constants";
import { routes, surveySectionRoute } from "@/lib/navigation";
import { makePageHref } from "@/lib/utils";

export default async function OuttakeSectionPage({
  params,
}: {
  params: Promise<unknown>;
}) {
  const { sectionId } = routes.outtakeSurveySection.$parseParams(await params);
  const { user } = await getSession();
  if (!user) {
    return redirect(surveySectionRoute(Survey.OUTTAKE, sectionId));
  }

  return (
    <SurveySection
      user={user}
      surveyId={Survey.OUTTAKE}
      sectionId={sectionId}
      afterFinish={async () => {
        "use server";
        await updateUser(user.id, { offboardingFinished: true });
        redirect(makePageHref(user.pageSlug));
      }}
    />
  );
}
