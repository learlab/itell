import { cn } from "@itell/utils";

import { routes } from "@/lib/navigation";
import { NavigationButton } from "./navigation-button";

export function TakeOnboarding({ className }: { className?: string }) {
  return (
    <NavigationButton
      href={routes.onboarding()}
      size={"lg"}
      className={cn("p-0", className)}
    >
      Start Onboarding
    </NavigationButton>
  );
}
