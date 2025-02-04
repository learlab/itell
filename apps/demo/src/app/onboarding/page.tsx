import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function OnboardingPage() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.onboarding(),
    });
  }

  return (
    <div className="flex h-full items-center justify-center">
      onboarding screen
    </div>
  );
}
