"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@itell/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@itell/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@itell/ui/dropdown";
import { AuthForm } from "@auth/auth-form";
import { DeleteAccount } from "@auth/delete-account";
import { type User } from "lucia";
import {
  ChevronDownIcon,
  CompassIcon,
  FileBoxIcon,
  LineChartIcon,
  LogOutIcon,
} from "lucide-react";

import { logout } from "@/lib/auth/actions";
import { Spinner } from "./spinner";
import { UserAvatar } from "./user-avatar";

const items = [
  {
    text: "Dashboard",
    href: "/api/dashboard",
    icon: <LineChartIcon className="size-4" />,
  },
  {
    text: "Forms",
    href: "/dashboard/forms",
    icon: <FileBoxIcon className="size-4" />,
  },
  {
    text: "Guide",
    href: "/guide",
    icon: <CompassIcon className="size-4" />,
  },
];

export function UserAccountNav({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [logoutPending, setLogoutPending] = useState(false);

  if (!user) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg">Sign in</Button>
        </DialogTrigger>
        <DialogContent>
          <AuthForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="ml-auto flex items-center gap-1">
      <DropdownMenu
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
        }}
      >
        <DropdownMenuTrigger
          className="flex items-center gap-1"
          aria-label="user navigation menu"
          data-test-id="user-nav-menu"
        >
          <UserAvatar user={user} className="size-8" />
          <ChevronDownIcon className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-40">
          {/* user name and email */}
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name ? (
                <p className="font-medium">
                  <span className="sr-only">username</span>
                  {user.name}
                </p>
              ) : null}
              {user.email ? (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  <span className="sr-only">user email</span>
                  {user.email}
                </p>
              ) : null}
            </div>
          </div>
          <DropdownMenuSeparator />
          {items.map((item) => (
            <DropdownMenuItem
              disabled={active === item.text && pending}
              key={item.href}
            >
              <Link
                href={item.href}
                className="flex w-full items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  setActive(item.text);
                  startTransition(() => {
                    setOpen(false);
                    router.push(item.href);
                    setActive("");
                  });
                }}
              >
                {active === item.text ? <Spinner /> : item.icon}
                {item.text}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={logoutPending}
            onSelect={(event) => {
              event.preventDefault();
              setLogoutPending(true);
              startTransition(async () => {
                await logout();
                setOpen(false);
                setLogoutPending(false);
              });
            }}
          >
            <button type="button" className="flex w-full items-center gap-2">
              {logoutPending ? <Spinner /> : <LogOutIcon className="size-4" />}
              Sign out
            </button>
          </DropdownMenuItem>

          {user.isAdmin && (
            <DropdownMenuItem
              className="mt-2"
              onSelect={(event) => {
                event.preventDefault();
              }}
            >
              <DeleteAccount badgePosition="top-center" />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
