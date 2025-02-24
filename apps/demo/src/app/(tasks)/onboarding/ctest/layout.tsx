import { getOnboardingStatus } from "@/db/onboarding";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TaskDone, TaskNotApplicable } from "../../task-alert";
import { DeleteCTest } from "./delete-ctest";

export default async function CTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.ctest(),
    });
  }

  const status = await getOnboardingStatus(user);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {status.ctest === "not-applicable" ? (
        <TaskNotApplicable />
      ) : status.ctest === "done" ? (
        <>
          <TaskDone />
          {user.isAdmin && (
            <div>
              <DeleteCTest />
            </div>
          )}
        </>
      ) : (
        children
      )}
    </div>
  );
}
