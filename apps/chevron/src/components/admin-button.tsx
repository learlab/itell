import React from "react";
import { Badge } from "@itell/ui/badge";
import { Button } from "@itell/ui/button";
import { cn } from "@itell/utils";

export function AdminButton({
  children,
  className,
  badgeClassName,
  badgePosition = "top-right",
  ...props
}: React.ComponentProps<typeof Button> & {
  badgeClassName?: string;
  badgePosition?: "top-right" | "right" | "top-center";
}) {
  return (
    <Button className={cn("relative", className)} {...props}>
      <Badge
        variant={"outline"}
        className={cn(
          "absolute hidden bg-secondary text-secondary-foreground sm:block",
          badgePosition === "top-right" &&
            "right-0 top-0 -translate-y-1/2 translate-x-1/2",
          badgePosition === "right" &&
            "right-0 top-1/2 -translate-x-full -translate-y-1/2",
          badgePosition === "top-center" &&
            "right-1/2 top-0 -translate-y-1/2 translate-x-1/2",
          badgeClassName
        )}
      >
        ADMIN
      </Badge>
      {children}
    </Button>
  );
}
