"use client";

import { DashboardHeader, DashboardShell } from "@dashboard/shell";

import { DashboardError } from "@/components/dashboard-error";
import { Meta } from "@/config/metadata";

export default function Page({ error }: { error: Error }) {
  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.summaries.title} text={Meta.summaries.description} />
      <DashboardError error={error} />
    </DashboardShell>
  );
}
