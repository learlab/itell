import { DashboardNavMenu } from "@dashboard/nav";

import { ContinueReading } from "@/components/continue-reading";
import { SidebarTrigger } from "@/components/sidebar";
import { getSession } from "@/lib/auth";

export async function DashboardNav() {
  const { user } = await getSession();

  return (
    <div className="flex h-[var(--nav-height)] justify-between gap-4 px-6 md:gap-10">
      <div className="flex items-center gap-4">
        <ContinueReading
          text="Back to textbook"
          variant="outline"
          className="hidden md:block"
        />
        <SidebarTrigger />
      </div>
      {user ? <DashboardNavMenu user={user} /> : null}
    </div>
  );
}
