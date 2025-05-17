import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";

import { NavigationButton } from "@/components/navigation-button";
import { getSession } from "@/lib/auth";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function Page() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams(routes.auth(), {
      redirect_to: routes.offboarding(),
    });
  }

  if (user.offboardingFinished) {
    return (
      <div className="mx-auto max-w-3xl">
        <Card className="border-info">
          <CardHeader>
            <CardTitle className="xl:text-xl">
              Offboarding finished 🎉
            </CardTitle>
            <CardDescription className="xl:text-lg">
              Thank you for finishing all onboarding tasks. Your course is now
              finished. You can still visit the textbook.
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

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="border-info">
        <CardHeader>
          <CardTitle className="xl:text-xl">
            Review your learning journey
          </CardTitle>
          <CardDescription className="xl:text-lg">
            You are close to finishing the entire textbook 🎉 ! Please spend
            some time sharing your learning experience and let us know how can
            we improve iTELL.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NavigationButton href={routes.outtakeSurvey()}>
            Start offboarding
          </NavigationButton>
        </CardContent>
      </Card>
    </div>
  );
}
