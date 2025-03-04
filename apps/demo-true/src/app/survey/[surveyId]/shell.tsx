import React from "react";
import { Skeleton } from "@itell/ui/skeleton";
import { User } from "lucia";
import { ChevronLeft } from "lucide-react";

import { ContinueReading } from "@/components/continue-reading";
import { SidebarTrigger } from "@/components/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAccountNav } from "@/components/user-account-nav";
import { Survey } from "@/lib/constants";

export function SurveyHomeShell({
  children,
  surveyId,
  user,
}: {
  children: React.ReactNode;
  surveyId: string;
  user?: User;
}) {
  return (
    <div className="flex h-[100vh] flex-col">
      <header className="flex h-[var(--nav-height)] items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-1">
          <SidebarTrigger />
          <ThemeToggle />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              {surveyId !== Survey.INTAKE && (
                <ContinueReading
                  user={user}
                  text="Back to textbook"
                  variant="ghost"
                >
                  <span>Back to Textbook</span>
                </ContinueReading>
              )}
              <UserAccountNav user={user} />
            </>
          ) : (
            <Skeleton className="h-8 w-32 rounded-full" />
          )}
        </div>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        {children}
      </div>
    </div>
  );
}
