import { SidebarInset, SidebarProvider } from "@itell/ui/sidebar";

import { getSurveySessions } from "@/db/survey";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";
import { SurveySidebar } from "../survey-sidebar";

export default async function SurveySectionLayout(props: {
  params: Promise<unknown>;
  children: React.ReactNode;
}) {
  const params = routes.surveySection.$parseParams(await props.params);
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.surveySection({
        surveyId: params.surveyId,
        sectionId: params.sectionId,
      }),
    });
  }
  const session = await getSurveySessions(user, params.surveyId);
  return (
    <SidebarProvider>
      <SurveySidebar
        variant="inset"
        surveyId={params.surveyId}
        sectionId={params.sectionId}
        surveySession={session ?? undefined}
      />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
