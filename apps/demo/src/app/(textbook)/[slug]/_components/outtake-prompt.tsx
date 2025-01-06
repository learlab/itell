import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";

import { NavigationButton } from "@/components/navigation-button";
import { routes } from "@/lib/navigation";
import { OuttakePromptClient } from "./outtake-prompt.client";

export async function OuttakePrompt() {
  return (
    <>
      <OuttakePromptClient />
      <Card>
        <CardHeader>
          <CardTitle>Please Take the Outtake Survey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Great job making it close to the end of the textbook! Please help us
            learn about your learning experience by completing the outtake
            survey.
          </p>
          <NavigationButton href={routes.surveyHome({ surveyId: "outtake" })}>
            Outtake Survey
          </NavigationButton>
        </CardContent>
      </Card>
    </>
  );
}

OuttakePrompt.Skeleton = function OuttakePromptSkeleton() {
  return <Skeleton className="h-12" />;
};
