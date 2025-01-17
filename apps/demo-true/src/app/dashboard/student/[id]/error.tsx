"use client";

import { DashboardError } from "@/components/dashboard-error";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "../../_components/shell";

export default function Error({ error }: { error: Error }) {
  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.student.title} text={Meta.student.description} />
      <DashboardError error={error} />
    </DashboardShell>
  );
}
