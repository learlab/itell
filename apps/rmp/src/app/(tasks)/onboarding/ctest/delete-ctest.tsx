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

import { deleteClozeAction } from "@/actions/cloze";
import { AdminButton } from "@/components/admin-button";
import { routes } from "@/lib/navigation";

export function DeleteCTest() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton variant={"outline"} size={"lg"}>
          Delete C Test Record
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete previous C Test record?</AlertDialogTitle>
          <AlertDialogDescription>
            This will delete your previous C Test submission and allow you to
            re-take the test.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              "use server";
              await deleteClozeAction({ pageSlug: "ctest" });
              redirect(routes.ctest());
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
