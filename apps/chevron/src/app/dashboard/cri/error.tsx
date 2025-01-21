"use client";

import { DashboardError } from "@/components/dashboard-error";
import { Meta } from "@/config/metadata";
import { DashboardHeader, DashboardShell } from "../_components/shell";

export default function Page({ error }: { error: Error }) {
  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.cri.title} text={Meta.cri.description} />
      <DashboardError error={error} />
    </DashboardShell>
  );
}
