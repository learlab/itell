import { DeleteSurvey } from "@/components/survey/delete-survey";
import { getOffboardingStatus } from "@/db/offboarding";
import { getSession } from "@/lib/auth";
import { Survey } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TaskDone, TaskNotApplicable } from "../../task-alert";

export default async function OuttakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.outtakeSurvey(),
    });
  }

  const status = await getOffboardingStatus(user);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {status.outtakeSurvey === "not-applicable" ? (
        <TaskNotApplicable />
      ) : status.outtakeSurvey === "done" ? (
        <>
          <TaskDone />
          {user.isAdmin && (
            <div>
              <DeleteSurvey surveyId={Survey.OUTTAKE} />
            </div>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
}
