import { Alert, AlertTitle } from "@itell/ui/alert";
import { CircleAlert, InfoIcon } from "lucide-react";

export function TaskInProgress() {
  return (
    <Alert variant={"warning"}>
      <CircleAlert className="size-4" />
      <AlertTitle>
        Please finish this onboarding task before moving on.
      </AlertTitle>
    </Alert>
  );
}

export function TaskDone() {
  return (
    <Alert variant={"success"}>
      <InfoIcon className="size-4" />
      <AlertTitle>You have completed this onboarding task. </AlertTitle>
    </Alert>
  );
}
