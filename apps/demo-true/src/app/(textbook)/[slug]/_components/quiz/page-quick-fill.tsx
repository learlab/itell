"use client";

import { AdminButton } from "@/components/admin-button";

export function QuizQuickFill() {
  return (
    <AdminButton
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
      Quiz Fill
    </AdminButton>
  );
}
