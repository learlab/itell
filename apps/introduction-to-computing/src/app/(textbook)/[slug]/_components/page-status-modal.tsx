"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@itell/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@itell/ui/dialog";
import { LoginButton } from "@auth//auth-form";
import { type User } from "lucia";
import { CommandIcon, LockIcon } from "lucide-react";

import { isProduction } from "@/lib/constants";
import { type PageStatus } from "@/lib/page-status";
import { makePageHref } from "@/lib/utils";

type Props = {
  user: User | null;
  pageStatus: PageStatus;
  fallbackPageSlug: string | null;
};

export function PageStatusModal({ user, pageStatus, fallbackPageSlug }: Props) {
  const { latest, unlocked } = pageStatus;
  if (unlocked) {
    return null;
  }

  if (user) {
    if (latest) {
      return null;
    }
    // user with locked page
    const href = makePageHref(user?.pageSlug ?? fallbackPageSlug);
    return (
      <Modal title="Page locked" icon={<LockIcon className="size-4" />}>
        <p>
          Gain access by submitting a passing summary for
          <Link href={href} className="mx-1 font-semibold underline">
            <span> this page </span>
          </Link>
          .
        </p>
        <DialogFooter>
          <Button>
            <Link href={href}>Go to page</Link>
          </Button>
        </DialogFooter>
      </Modal>
    );
  }

  // no user, and page is locked
  return (
    <Modal
      title="Log in to access the textbook"
      icon={<CommandIcon className="size-4" />}
      description="We collects anonymous data to improve learning experience."
    >
      <DialogFooter className="sm:justify-start">
        <LoginButton />
      </DialogFooter>
    </Modal>
  );
}

function Modal({
  title,
  description,
  children,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        if (!isProduction) {
          setOpen(false);
        }
      }}
    >
      <DialogContent canClose={!isProduction}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
