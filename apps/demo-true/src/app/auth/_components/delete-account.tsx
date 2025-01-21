"use client";

import { useTransition } from "react";
import { redirect, useRouter } from "next/navigation";
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
import { Button } from "@itell/ui/button";
import { UserRoundX } from "lucide-react";

import { deleteUserAction } from "@/actions/user";
import { AdminButton } from "@/components/admin-button";
import { logout } from "@/lib/auth/actions";
import { routes } from "@/lib/navigation";

export function DeleteAccount() {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <AdminButton variant="outline" className="gap-2" size={"lg"}>
          <UserRoundX className="size-4" />
          <span>Delete Account</span>
        </AdminButton>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Account?</AlertDialogTitle>
          This will delete your account and all related data. This is for admin
          testing only.
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

                router.push(routes.auth());
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
