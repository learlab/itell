"use client";

import { useEffect } from "react";
import { toast } from "sonner";

const opts = {
  duration: 10000,
};

export function ClassCodeToast({ valid }: { valid: boolean | undefined }) {
  useEffect(() => {
    if (valid === true) {
      toast.success("Joined class successfully.");
    } else if (valid === false) {
      toast.error(
        "The class code you used is invalid. Please contact your instructor for the correct url to join the class.",
        opts
      );
    }
  }, [valid]);

  return null;
}
