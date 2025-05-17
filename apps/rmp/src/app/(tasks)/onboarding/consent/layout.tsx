import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { TaskDone, TaskInProgress } from "../../task-alert";

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
    <div className="max-w-screen-xl space-y-4 px-8 py-4">
      {consentDone ? <TaskDone /> : <TaskInProgress />}
      {children}
    </div>
  );
}
