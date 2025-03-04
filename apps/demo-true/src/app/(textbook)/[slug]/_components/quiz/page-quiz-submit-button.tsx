"use client ";

import { Button } from "@itell/ui/button";
import { useFormStatus } from "react-dom";

export function PageQuizSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button pending={pending} disabled={pending}>
      Submit
    </Button>
  );
}
