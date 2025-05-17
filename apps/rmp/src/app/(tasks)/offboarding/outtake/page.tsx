import { SurveyHome } from "@/components/survey/survey-home";
import { getSession } from "@/lib/auth";
import { Survey } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function OuttakePage() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.outtakeSurvey(),
    });
  }
  return <SurveyHome user={user} surveyId={Survey.OUTTAKE} />;
}
