import { cookies } from "next/headers";
import { Elements } from "@itell/constants";
import { DashboardNav } from "@dashboard/dashboard-nav";
import { DashboardSidebar } from "@dashboard/dashboard-sidebar";
import { volume } from "#content";

import { SidebarLayout } from "@/components/sidebar";
import { SiteNav } from "@/components/site-nav";
import { findTeacher } from "@/db/teacher";
import { env } from "@/env.mjs";
import { getSession } from "@/lib/auth";
import {
  ClassRole,
  DASHBOARD_ROLE_COOKIE,
  SIDEBAR_STATE_COOKIE,
} from "@/lib/constants";
import { redirectWithSearchParams } from "@/lib/utils";
import { DashboardProvider } from "./_components/dashboard-context";
import type { Role } from "./_components/dashboard-context";

export const generateMetadata = () => {
  const title = "Dashboard";
  const description = `Learning statistics on the ${volume.title} intelligent textbook`;
  return {
    title,
    description,
    metadataBase: new URL(env.NEXT_PUBLIC_HOST),
    openGraph: {
      title: `${title} | ${volume.title}`,
      description,
      type: "article",
      url: `${env.NEXT_PUBLIC_HOST}/dashboard`,
      images: [
        {
          url: "/og?dashboard=true",
        },
      ],
    },
  };
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("auth");
  }

  const c = await cookies();

  // if (user?.condition === Condition.SIMPLE) {
  // 	return (
  // 		<main className="flex items-center justify-center min-h-screen">
  // 			<Card className="w-80 ">
  // 				<CardHeader>
  // 					<CardTitle>data unavailable</CardTitle>
  // 				</CardHeader>
  // 				<CardContent>
  // 					<ContinueReading
  // 						text="Back to textbook"
  // 						variant="outline"
  // 						className="w-full"
  // 					/>
  // 				</CardContent>
  // 			</Card>
  // 		</main>
  // 	);
  // }

  const teacher = await findTeacher(user.id);
  const isTeacher = Boolean(teacher);
  const sidebarState = c.get(SIDEBAR_STATE_COOKIE)?.value;

  return (
    <DashboardProvider
      defaultRole={
        (c.get(DASHBOARD_ROLE_COOKIE)?.value ??
          (isTeacher ? ClassRole.TEACHER : ClassRole.STUDENT)) as Role
      }
    >
      <SidebarLayout
        defaultOpen={sidebarState ? sidebarState === "true" : true}
        className="flex-col"
      >
        <DashboardSidebar isTeacher={isTeacher} />
        <SiteNav mainContentId={Elements.DASHBOARD_MAIN}>
          <DashboardNav />
        </SiteNav>
        <main
          id={Elements.DASHBOARD_MAIN}
          className="min-h-screen"
          suppressHydrationWarning
        >
          <section
            aria-label="dashboard main panel"
            className="flex max-w-screen-xl flex-col px-4 py-4 group-has-[[data-pending]]:animate-pulse lg:px-8"
            aria-live="polite"
            aria-atomic="true"
            tabIndex={-1}
          >
            {children}
          </section>
        </main>
      </SidebarLayout>
    </DashboardProvider>
  );
}
