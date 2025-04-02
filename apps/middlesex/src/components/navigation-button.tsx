"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDebounce } from "@itell/core/hooks";
import { type Button } from "@itell/ui/button";
import { StatusButton } from "@itell/ui/status-button";
import { ArrowRightIcon } from "lucide-react";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode;
  href: string;
}

export function NavigationButton({ children, href, ...props }: Props) {
  const [pending, startTransition] = useTransition();
  const pendingDebounced = useDebounce(pending, 100);
  const router = useRouter();

  return (
    <StatusButton
      pending={pendingDebounced}
      disabled={pending}
      size="lg"
      {...props}
    >
      <Link
        className="flex items-center gap-2 px-8 py-2"
        href={href}
        onClick={() => {
          startTransition(() => {
            router.push(href);
          });
        }}
      >
        <ArrowRightIcon className="size-4 shrink-0" />
        {children}
      </Link>
    </StatusButton>
  );
}
