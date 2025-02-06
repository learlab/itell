import { SurveyHome } from "@/components/survey/survey-home";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function IntakePage() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.intakeSurvey(),
    });
  }
  return <SurveyHome user={user} surveyId="intake" />;
}
