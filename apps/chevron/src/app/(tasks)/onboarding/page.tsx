import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { volume } from "#content";

import { ClassCodeToast } from "@/components/class-code-toast";
import { NavigationButton } from "@/components/navigation-button";
import { getOnboardingStatus } from "@/db/onboarding";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.onboarding(),
    });
  }
  const { class_code_valid } = routes.onboarding.$parseSearchParams(
    await searchParams
  );
  if (user.onboardingFinished) {
    return (
      <div className="mx-auto max-w-3xl">
        <ClassCodeToast valid={class_code_valid} />
        <Card className="border-info">
          <CardHeader>
            <CardTitle className="xl:text-xl">Onboarding finished 🎉</CardTitle>
            <CardDescription className="xl:text-lg">
              Thank you for finishing all onboarding tasks. You can now go to
              the textbook.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NavigationButton
              href={
                user.pageSlug
                  ? routes.textbook({ slug: user.pageSlug })
                  : routes.home()
              }
            >
              Textbook
            </NavigationButton>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = await getOnboardingStatus(user);
  let href: string = routes.home();
  if (status.consent !== "done") {
    href = routes.consent();
  } else if (status.intakeSurvey !== "done") {
    href = routes.intakeSurvey();
  } else if (status.cTest !== "done") {
    href = routes.cTest();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ClassCodeToast valid={class_code_valid} />
      <Card className="border-info">
        <CardHeader>
          <CardTitle className="xl:text-xl">
            Welcome to {volume.title}
          </CardTitle>
          <CardDescription className="xl:text-lg">
            Let&apos;s begin setting up your intelligent textbook. We&apos;ll
            guide you through several onboarding tasks. After you finish all
            tasks, you will be redirected to the textbook and start learning.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NavigationButton href={href}>
            {user.consentGiven === null
              ? "Start Onboarding"
              : "Continue Onboarding"}
          </NavigationButton>
        </CardContent>
      </Card>
    </div>
  );
}
