"use client";

import { AdminButton } from "@/components/admin-button";

export function QuizQuickFill() {
  return (
    <AdminButton
      size={"lg"}
      onClick={async () => {
        const form = document.getElementById("page-quiz");
        if (form) {
          const radioGroups = form.querySelectorAll("[role='radiogroup']");
          radioGroups.forEach((rg) => {
            const btn = rg.querySelector("button");
            if (btn) {
              btn.click();
            }
          });
        }
      }}
    >
      Fill Quiz
    </AdminButton>
  );
}
