"use client";

import Form from "next/form";
import { Button } from "@itell/ui/button";
import { Label } from "@itell/ui/label";
import { RadioGroup, RadioGroupItem } from "@itell/ui/radio";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export function ConsentSubmit({
  action,
  value,
}: {
  action: (val: boolean) => Promise<void>;
  value?: "yes" | "no";
}) {
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
      <RadioGroup
        name="agreement"
        required
        className="flex flex-col gap-3"
        {...(value !== undefined ? { value } : { defaultValue: "yes" })}
      >
        <Label
          className="flex flex-row-reverse items-center justify-end gap-4 has-[:checked]:underline
            has-[:checked]:decoration-2 has-[:checked]:underline-offset-4 xl:text-lg"
        >
          <span>
            I have read and understood the information above, I am 18 years or
            older, and I agree to participate in this study.{" "}
          </span>
          <RadioGroupItem className="size-5 shrink-0" value="yes" />
        </Label>
        <Label
          className="flex flex-row-reverse items-center justify-end gap-4 has-[:checked]:underline
            has-[:checked]:decoration-2 has-[:checked]:underline-offset-4 xl:text-lg"
        >
          <span>
            I am under 18 and/or I do not agree to participate in the study.
          </span>
          <RadioGroupItem className="size-5 shrink-0" value="no" />
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
