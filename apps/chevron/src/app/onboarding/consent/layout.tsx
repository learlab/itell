import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TaskDone, TaskInProgress } from "../onboarding-alert";

export default async function ConsentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.consent(),
    });
  }
  const consentDone = user.consentGiven !== null;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 py-2">
      {consentDone ? <TaskDone /> : <TaskInProgress />}
      {children}
    </div>
  );
}
