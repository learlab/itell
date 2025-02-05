import * as React from "react";
import { cn } from "@itell/utils";
import { cva } from "class-variance-authority";

import type { VariantProps } from "class-variance-authority";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        error:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-200/30 dark:bg-red-900/20 dark:text-red-200",
        warning:
          "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-200/30 dark:bg-yellow-700/20 dark:text-yellow-200",
        info: "border-blue-200 bg-blue-50 text-blue-500 dark:border-blue-200/30 dark:bg-blue-900/20 dark:text-blue-200",
        success:
          "border-green-200 bg-green-50 text-green-700 dark:border-green-200/30 dark:bg-green-900/20 dark:text-green-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    role="heading"
    aria-level={5}
    ref={ref}
    className={cn(
      "mb-1 mt-0 font-medium leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
