import { Alert, AlertDescription, AlertTitle } from "@itell/ui/alert";
import { BanIcon } from "lucide-react";

export const CreateErrorFallback = (
  title = "Internal error occurred",
  description = "Contact lear.lab.vu@gmail.com if the problem persists"
) => {
  return function ErrorFeedback() {
    return (
      <Alert variant={"error"}>
        <BanIcon className="size-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
    );
  };
};
