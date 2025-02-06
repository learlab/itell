import { getOnboardingStatus } from "@/db/onboarding";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TaskDone, TaskNotApplicable } from "../onboarding-alert";
import { DeleteCTest } from "./delete-ctest";

export default async function CTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.cTest(),
    });
  }

  const status = await getOnboardingStatus(user);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {status.cTest === "not-applicable" ? (
        <TaskNotApplicable />
      ) : status.cTest === "done" ? (
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
