"use client";

import { useEffect, useState } from "react";
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
export function ScreenIssuePopup() {
  const screenIssue = useScreenIssue();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (screenIssue && isProduction) {
      setOpen(true);
    }
  }, [screenIssue]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {screenIssue == "mobile"
              ? "Mobile Device Detected"
              : "Resize Window"}
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="grid gap-2">
              <div className="text-sm text-muted-foreground">
                {screenIssue == "mobile" ? (
                  <>
                    This textbook is not optimized for mobile devices. Please
                    use a desktop or laptop to access the full functionality of
                    the textbook.
                  </>
                ) : (
                  <>
                    This textbook is not optimized for small screens. Please
                    resize your window to access the full functionality of the
                    textbook.
                  </>
                )}
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
