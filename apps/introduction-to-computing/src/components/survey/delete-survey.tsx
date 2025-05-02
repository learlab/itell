import { redirect } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";

import { deleteSurveyAction } from "@/actions/survey";
import { surveyHomeRoute } from "@/lib/navigation";
import { AdminButton } from "../admin-button";

export function DeleteSurvey({ surveyId }: { surveyId: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton variant={"outline"} size={"lg"}>
          Delete Survey Record
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete previous survey record?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete your previous survey submission and allow you to
            re-take the survey.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              "use server";
              await deleteSurveyAction({ surveyId });
              redirect(surveyHomeRoute(surveyId));
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
