import React from "react";
import { cn } from "@itell/utils";

export function InternalError({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("tex-sm leading-snug text-destructive", className)}>
      {children ? (
        children
      ) : (
        <p>An internal error occurred. Please try again later.</p>
      )}
    </div>
  );
}
