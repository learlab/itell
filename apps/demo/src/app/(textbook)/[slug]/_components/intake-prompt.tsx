import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { Skeleton } from "@itell/ui/skeleton";

import { NavigationButton } from "@/components/navigation-button";
import { routes } from "@/lib/navigation";
import { IntakePromptClient } from "./intake-prompt.client";

export async function IntakePrompt() {
  return (
    <>
      <IntakePromptClient />
      <Card>
        <CardHeader>
          <CardTitle>Please Take the Intake Survey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Before starting the textbook, help us customize your learning
            experience by completing the intake survey.
          </p>
          <NavigationButton href={routes.surveyHome({ surveyId: "intake" })}>
            Intake Survey
          </NavigationButton>
        </CardContent>
      </Card>
    </>
  );
}

IntakePrompt.Skeleton = function IntakePromptSkeleton() {
  return <Skeleton className="h-12" />;
};
