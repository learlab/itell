import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@itell/ui/alert";

export function InternalError({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Alert variant={"error"} className={className}>
      <AlertTitle>Operation failed</AlertTitle>
      {children && <AlertDescription>{children}</AlertDescription>}
    </Alert>
  );
}
