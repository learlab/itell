"use client";

import { useOptimistic, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@itell/utils";

import { dashboardConfig } from "./config";
import { useDashboard } from "./dashboard-context";

export function DashboardLinks() {
  const { role } = useDashboard();
  const [pending, startTransition] = useTransition();
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useOptimistic(pathname);
  const router = useRouter();

  return (
    <ul className="grid" data-pending={pending ? "" : undefined}>
      {dashboardConfig.sidebarNav[role].map((item) => (
        <li key={item.title}>
          <Link
            className={cn(
              `ring-ring hover:bg-accent hover:text-accent-foreground flex h-9 items-center
              gap-2.5 overflow-hidden px-1.5 text-sm outline-hidden transition-all
              focus-visible:ring-2 lg:text-base`,
              activeRoute === item.href && "bg-accent text-accent-foreground"
            )}
            href={item.href}
            onClick={(event) => {
              event.preventDefault();
              startTransition(() => {
                setActiveRoute(item.href);
                router.push(item.href);
              });
            }}
          >
            <item.icon className="text-muted-foreground h-4 w-4 shrink-0 translate-x-0.5" />
            <div className="line-clamp-1 grow overflow-hidden pr-6 font-medium">
              {item.title}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
