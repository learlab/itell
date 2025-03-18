import { DeleteSurvey } from "@/components/survey/delete-survey";
import { getOnboardingStatus } from "@/db/onboarding";
import { getSession } from "@/lib/auth";
import { Survey } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TaskDone, TaskNotApplicable } from "../../task-alert";

export default async function IntakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.intakeSurvey(),
    });
  }

  const status = await getOnboardingStatus(user);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {status.intakeSurvey === "not-applicable" ? (
        <TaskNotApplicable />
      ) : status.intakeSurvey === "done" ? (
        <>
          <TaskDone />
          {user.isAdmin && (
            <div>
              <DeleteSurvey surveyId={Survey.INTAKE} />
            </div>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
}
