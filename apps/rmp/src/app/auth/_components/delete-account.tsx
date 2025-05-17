"use client";

import { useTransition } from "react";
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
import { UserRoundX } from "lucide-react";

import { deleteUserAction } from "@/actions/user";
import { AdminButton } from "@/components/admin-button";
import { logout } from "@/lib/auth/actions";

export function DeleteAccount(props: React.ComponentProps<typeof AdminButton>) {
  const [pending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton variant="outline" className="gap-2" size={"lg"} {...props}>
          <UserRoundX className="size-4" />
          <span>Delete Account</span>
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>
          This will delete your account and all related data.
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={pending}
            pending={pending}
            onClick={() => {
              startTransition(async () => {
                localStorage.clear();
                await deleteUserAction();
                await logout();
              });
            }}
          >
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
