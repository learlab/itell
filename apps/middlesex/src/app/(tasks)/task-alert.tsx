import { Alert, AlertDescription, AlertTitle } from "@itell/ui/alert";
import { CircleAlert, InfoIcon } from "lucide-react";

export function TaskInProgress() {
  return (
    <Alert variant={"warning"}>
      <CircleAlert className="size-4" />
      <AlertTitle>Please finish this task before moving on</AlertTitle>
    </Alert>
  );
}

export function TaskNotApplicable() {
  return (
    <Alert variant={"error"}>
      <CircleAlert className="size-4" />
      <AlertTitle>Task not applicable</AlertTitle>
      <AlertDescription>
        Please finish all previous tasks first.
      </AlertDescription>
    </Alert>
  );
}

export function TaskDone() {
  return (
    <Alert variant={"success"}>
      <InfoIcon className="size-4" />
      <AlertTitle>Task completed </AlertTitle>
    </Alert>
  );
}
