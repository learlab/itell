"use client";

import { DashboardError } from "@/components/dashboard-error";
import { NavigationButton } from "@/components/navigation-button";
import { routes } from "@/lib/navigation";

export default function Page({ error }: { error: Error }) {
  return (
    <DashboardError error={error}>
      <p className="mb-2">Failed to retrieve your summary at this point, please try again later</p>
      <NavigationButton href={routes.home()}>Back to home</NavigationButton>
    </DashboardError>
  );
}
