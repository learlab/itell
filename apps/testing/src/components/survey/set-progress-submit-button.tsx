"use client";

import { Button } from "@itell/ui/button";
import { useFormStatus } from "react-dom";

export function SetProgressSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-32" pending={pending} disabled={pending}>
      Save
    </Button>
  );
}
