"use client";

import { Button } from "@itell/ui/button";
import { SendHorizontalIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function PageQuizSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      pending={pending}
      disabled={pending}
      className="w-40"
      onClick={() => {
        toast.success(
          "Thank you for finishing the quiz. You can go to the next page."
        );
      }}
    >
      <span className="inline-flex items-center gap-2">
        <SendHorizontalIcon className="size-3" />
        Submit
      </span>
    </Button>
  );
}
