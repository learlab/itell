"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

import { NavigationButton } from "@/components/navigation-button";
import { routes } from "@/lib/navigation";

export function OuttakePromptClient() {
  useEffect(() => {
    toast.custom((t) => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Take Outtake Survey</span>
            <button onClick={() => toast.dismiss(t)} aria-label="Close toast">
              <XIcon className="size-3" />{" "}
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NavigationButton href={routes.surveyHome({ surveyId: "outtake" })}>
            Outtake Survey
          </NavigationButton>
        </CardContent>
      </Card>
    ));
  }, []);

  return null;
}
