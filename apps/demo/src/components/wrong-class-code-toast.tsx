"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WrongClassCodeToast() {
  useEffect(() => {
    toast.error(
      "The class code you used is invalid. Please contact your instructor for the correct url to join the class.",
      {
        duration: 10000,
      }
    );
  }, []);

  return null;
}
