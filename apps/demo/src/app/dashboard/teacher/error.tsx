"use client";

import { TeacherOnly } from "@/components/teacher-only";

import { DashboardHeader, DashboardShell } from "../_components/shell";

export default function Error() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Class Information" />
      <TeacherOnly />
    </DashboardShell>
  );
}
