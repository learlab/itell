import { SidebarTrigger } from "@itell/ui/sidebar";
import { DashboardNavMenu } from "@dashboard/nav";

import { ContinueReading } from "@/components/continue-reading";
import { getSession } from "@/lib/auth";

export async function DashboardNav() {
  const { user } = await getSession();

  return (
    <div className="flex h-[var(--nav-height)] items-center justify-between gap-4 px-6 md:gap-10">
      <SidebarTrigger />
      <div className="ml-auto flex items-center gap-4">
        <ContinueReading
          user={user}
          text="Back to textbook"
          variant="outline"
          className="hidden md:block"
        />
        {user ? <DashboardNavMenu user={user} /> : null}
      </div>
    </div>
  );
}
