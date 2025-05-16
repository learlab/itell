"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { buttonVariants } from "@itell/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@itell/ui/sidebar";
import { cn } from "@itell/utils";
import {
  BanIcon,
  CircleCheckIcon,
  CircleIcon,
  LoaderCircleIcon,
} from "lucide-react";

import { TaskStatus } from "@/lib/tasks";

type Item = {
  label: string;
  status: TaskStatus;
  href: string;
};

type Props = {
  items: Item[];
  header: React.ReactNode;
  footer: React.ReactNode;
};

export function TasksSidebar({ items, header, footer }: Props) {
  return (
    <Sidebar>
      <SidebarHeader className="pt-0">{header}</SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.label}>
              <TaskLink status={item.status} href={item.href}>
                {item.label}
              </TaskLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="px-4">{footer}</SidebarFooter>
    </Sidebar>
  );
}

function TaskLink({
  status,
  className,
  children,
  ...props
}: { status: TaskStatus; active?: boolean } & React.ComponentProps<
  typeof Link
>) {
  const segment = useSelectedLayoutSegment();
  const ready = status === "ready";
  const inProgress = status === "in-progress";
  const na = status === "not-applicable";
  const isActive = segment && (props.href as string).endsWith(segment);
  const done = status === "done";

  const [pending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <SidebarMenuButton
      className={na ? "pointer-events-none cursor-not-allowed" : ""}
      data-pending={pending ? "" : undefined}
    >
      <Link
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex w-full items-center justify-start gap-2 py-3 lg:text-base",
          isActive && "bg-accent text-accent-foreground",
          className
        )}
        aria-disabled={na}
        onClick={(e) => {
          e.preventDefault();
          startTransition(() => {
            router.push(props.href as string);
          });
        }}
        {...props}
      >
        {done ? (
          <CircleCheckIcon className="size-5 stroke-green-600" />
        ) : ready ? (
          <CircleIcon className="stroke-warning size-5" />
        ) : inProgress ? (
          <LoaderCircleIcon className="stroke-warning size-5" />
        ) : (
          <BanIcon className="size-5" />
        )}
        {children}
      </Link>
    </SidebarMenuButton>
  );
}
