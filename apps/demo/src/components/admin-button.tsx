import React from "react";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import { cn } from "@itell/utils";

export function AdminButton({
  children,
  className,
  badgeClassName,
  ...props
}: React.ComponentProps<typeof Button> & { badgeClassName?: string }) {
  return (
    <Button className={cn("relative", className)} {...props}>
      <Badge
        variant={"outline"}
        className={cn(
          "absolute right-0 top-0 -translate-y-1/2 translate-x-1/2 bg-secondary text-secondary-foreground",
          badgeClassName
        )}
      >
        ADMIN
      </Badge>
      {children}
    </Button>
  );
}
