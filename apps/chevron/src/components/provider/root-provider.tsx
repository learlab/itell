"use client";

import { TooltipProvider } from "@itell/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <Toaster richColors closeButton visibleToasts={1} />
      <TooltipProvider delayDuration={0}>{children}</TooltipProvider>
    </ThemeProvider>
  );
}
