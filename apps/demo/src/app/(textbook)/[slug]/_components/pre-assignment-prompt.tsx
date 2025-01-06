"use client";

import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { XIcon } from "lucide-react";
import { toast } from "sonner";

export function PreAssignmentPrompt({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    toast.custom((t) => (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <button onClick={() => toast.dismiss(t)} aria-label="Close toast">
              <XIcon className="size-3" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    ));
  }, [title, children]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
