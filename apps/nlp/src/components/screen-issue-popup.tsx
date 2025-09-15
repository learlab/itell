"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useScreenIssue } from "@itell/core/hooks";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@itell/ui/alert-dialog";

import { isProduction } from "@/lib/constants";

// ScreenIssuePopup is a component that displays a popup when the screen size is too small
// or the device is a mobile device.
export function ScreenIssuePopup({ shouldOpen }: { shouldOpen: boolean }) {
  const screenIssue = useScreenIssue();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (screenIssue && isProduction && shouldOpen) {
      setOpen(true);
    }
  }, [screenIssue, shouldOpen]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Using iTELL on a smaller screen</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="grid gap-2">
              <div className="text-muted-foreground text-sm">
                We are working to imporve iTELL's experience on smaller screens
                and mobile devices and welcome feedback at
                lear.lab.vu@gmail.com. If you found any issues for now, we
                suggest switch to a desktop or laptop computer for the best
                experience.
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="mt-0"
            onClick={() => {
              setOpen(false);

              document.cookie = `open_small_screen_popup=false; path=/; expires=${new Date(2147483647 * 1000).toUTCString()}`;

              startTransition(() => {
                router.refresh();
              });
            }}
          >
            Continue
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
