"use client";

import { useOptimistic, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClickOutside, useDebounce } from "@itell/core/hooks";
import { cn } from "@itell/utils";
import { volume } from "#content";
import { MenuIcon, XIcon } from "lucide-react";

import { Spinner } from "./spinner";

export type MobileNavItem = {
  title: string;
  /**
   * the destination url
   * also used to matched against usePathname to determine if the link is active
   */
  href: string;
  disabled?: boolean;
};
type MobileNavProps = {
  items: MobileNavItem[];
};
export function MobileNav({ items }: MobileNavProps) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isPending = useDebounce(pending, 100);
  const [activeRoute, setActiveRoute] = useOptimistic(
    items.find((item) => item.href === pathname)?.href
  );
  const ref = useClickOutside<HTMLDivElement>(() => {
    setShowMobileMenu(false);
  });
  return (
    <div className="block md:hidden">
      <button
        type="button"
        className="line-clamp-2 flex items-center space-x-2 font-bold"
        onClick={() => {
          setShowMobileMenu(!showMobileMenu);
        }}
      >
        {showMobileMenu ? (
          <XIcon className="shrink-0" />
        ) : (
          <MenuIcon className="shrink-0" />
        )}
        <span className="hidden sm:inline">{volume.title}</span>
        <span className="sm:hidden">Menu</span>
      </button>
      {showMobileMenu ? (
        <div
          ref={ref}
          className={cn(
            `bg-background animate-in slide-in-from-bottom-80 fixed inset-0 top-16 z-50 grid
              h-fit grid-flow-row auto-rows-max overflow-auto shadow-md md:hidden`
          )}
        >
          <div className="bg-popover text-popover-foreground relative grid gap-6 rounded-md p-4">
            <div className="border-b-2">
              <TopLink href="/" text="Home" active={pathname === "/"} />
              <TopLink
                href="/dashboard"
                text="Dashboard"
                active={pathname === "/dashboard"}
              />
            </div>
            <nav className="grid grid-flow-row auto-rows-max text-sm">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveRoute(item.href);
                    startTransition(() => {
                      router.push(item.disabled ? "#" : item.href);
                      setShowMobileMenu(false);
                    });
                  }}
                  className={cn(
                    `flex w-full items-center justify-between rounded-md p-2 text-sm font-medium
                      hover:underline`,
                    item.disabled && "cursor-not-allowed opacity-60",
                    item.href === activeRoute && "bg-accent"
                  )}
                >
                  <span>{item.title}</span>
                  {isPending && item.href === activeRoute ? <Spinner /> : null}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function TopLink({
  href,
  text,
  active,
}: {
  href: string;
  text: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex w-full items-center rounded-md p-2 text-sm font-medium",
        active && "bg-accent"
      )}
    >
      <span className="font-bold">{text}</span>
    </Link>
  );
}
