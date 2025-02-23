"use client";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@itell/ui/alert-dialog";
import { Button } from "@itell/ui/button";
import { useServerAction } from "zsa-react";

import { updateUserAction } from "@/actions/user";
import { InternalError } from "@/components/internal-error";

export function QuitClass() {
  const router = useRouter();
  const { execute, isPending, isError } = useServerAction(updateUserAction);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Quit Class</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to leave the class?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-sm text-muted-foreground">
              <p>Your data will no longer be shared with the teacher</p>
              {isError ? <InternalError /> : null}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            pending={isPending}
            onClick={async () => {
              const [_, err] = await execute({ classId: null });
              if (!err) {
                router.refresh();
              }
            }}
          >
            Confirm
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
