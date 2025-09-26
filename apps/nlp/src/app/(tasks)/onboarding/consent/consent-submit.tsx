"use client";

import Form from "next/form";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { AlertCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { useScrollThreshold } from "@/lib/hooks/use-scroll-threshold";

export function ConsentSubmit({
  action,
  value,
}: {
  action: (val: boolean) => Promise<void>;
  value?: "yes" | "no";
}) {
  const hasScrolledEnough = useScrollThreshold("consent-form", 0.95);

  return (
    <Form
      action={async (formData) => {
        const given = formData.get("agreement") === "yes";
        toast.success(
          given
            ? "Consent given. Navigating to next onboarding task ..."
            : "Consent refused. Navigating to next onboarding task ..."
        );
        action(given);
      }}
      className="flex flex-col gap-4"
    >
      <p>
        If you are over 18 years old and agree to have your data used for this
        study, please indicate your agreement by clicking &quot;I am over 18
        years of age and I agree to having my data used in this study&quot;
      </p>
      {!value && !hasScrolledEnough && (
        <div
          className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-amber-700
            dark:bg-amber-950 dark:text-amber-300"
        >
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">
            Please scroll through the entire consent document before making a
            choice.
          </p>
        </div>
      )}
      <RadioGroup
        name="agreement"
        required
        className="flex flex-col gap-3"
        {...(value !== undefined ? { value } : { defaultValue: undefined })}
      >
        <Label
          className="flex flex-row-reverse items-center justify-end gap-4 has-[:checked]:underline
            has-[:checked]:decoration-2 has-[:checked]:underline-offset-4 xl:text-lg"
        >
          <span>
            I have read and understood the information above, I am 18 years or
            older, and I agree to having my data used in the study.{" "}
          </span>
          <RadioGroupItem
            className="size-5 shrink-0"
            value="yes"
            disabled={!hasScrolledEnough || value !== undefined}
          />
        </Label>
        <Label
          className="flex flex-row-reverse items-center justify-end gap-4 has-[:checked]:underline
            has-[:checked]:decoration-2 has-[:checked]:underline-offset-4 xl:text-lg"
        >
          <span>
            I am under 18 and/or I do not agree to having my data used in the study.
          </span>
          <RadioGroupItem
            className="size-5 shrink-0"
            value="no"
            disabled={!hasScrolledEnough || value !== undefined}
          />
        </Label>
      </RadioGroup>
      <Submit disabled={value !== undefined} />
    </Form>
  );
}

function Submit({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" pending={pending} disabled={disabled || pending}>
      Submit
    </Button>
  );
}
