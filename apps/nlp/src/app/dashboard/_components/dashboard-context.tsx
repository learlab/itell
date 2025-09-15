"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { ClassRole, DASHBOARD_ROLE_COOKIE } from "@/lib/constants";
import { setCookie } from "@/lib/cookie";
import { routes } from "@/lib/navigation";

export type Role = (typeof ClassRole)[keyof typeof ClassRole];
type DashboardContextType = {
  role: Role;
  switchRole: (_: Role) => void;
};
const DashboardContext = createContext<DashboardContextType>(
  {} as DashboardContextType
);

const routeMappings: Record<Role, Record<string, string | undefined>> = {
  teacher: {
    "/dashboard": "/dashboard/teacher",
    "/dashboard/questions": "/dashboard/teacher/questions",
    "/dashboard/summaries": "/dashboard/teacher/summaries",
  },
  student: {
    "/dashboard/teacher": "/dashboard",
    "/dashboard/teacher/questions": "/dashboard/questions",
    "/dashboard/teacher/summaries": "/dashboard/summaries",
  },
};

export function DashboardProvider({
  children,
  defaultRole,
}: {
  children: React.ReactNode;
  defaultRole?: Role;
}) {
  const pathname = usePathname();
  const [role, setRole] = useState(
    pathname && pathname.startsWith("/dashboard/teacher")
      ? ClassRole.TEACHER
      : (defaultRole ?? ClassRole.STUDENT)
  );
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchRole = useCallback(
    (role: Role) => {
      setRole(role);
      setCookie(DASHBOARD_ROLE_COOKIE, role);
      if (pathname && pathname in routeMappings[role]) {
        const nextRoute = routeMappings[role][pathname];
        if (nextRoute) {
          startTransition(() => {
            router.push(nextRoute);
          });
        }
      } else {
        router.push(
          role === ClassRole.TEACHER
            ? routes.dashboardTeacher()
            : routes.dashboard()
        );
      }
    },
    [pathname, router]
  );

  return (
    <DashboardContext.Provider value={{ role, switchRole }}>
      <div
        className="group flex flex-col"
        data-pending={pending ? "" : undefined}
      >
        {children}
      </div>
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => {
  return useContext(DashboardContext);
};
