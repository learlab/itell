"use client";

import { ClassRole, DASHBOARD_ROLE_COOKIE } from "@/lib/constants";
import { setCookie } from "@/lib/cookie";
import { usePathname, useRouter } from "next/navigation";
import {
	createContext,
	useCallback,
	useContext,
	useState,
	useTransition,
} from "react";

export type Role = (typeof ClassRole)[keyof typeof ClassRole];
type DashboardContext = {
	role: Role;
	onRoleChange: (role: Role) => void;
};
const DashboardContext = createContext<DashboardContext>(
	{} as DashboardContext,
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

export const DashboardProvider = ({
	children,
	defaultRole,
}: {
	children: React.ReactNode;
	defaultRole?: Role;
}) => {
	const [role, setRole] = useState(defaultRole ?? ClassRole.STUDENT);
	const pathname = usePathname();
	const router = useRouter();
	const [pending, startTransition] = useTransition();

	const onRoleChange = useCallback(
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
			}
		},
		[pathname, role],
	);

	return (
		<DashboardContext.Provider value={{ role, onRoleChange }}>
			<div
				className="group flex flex-col"
				data-pending={pending ? "" : undefined}
			>
				{children}
			</div>
		</DashboardContext.Provider>
	);
};

export const useDashboard = () => {
	return useContext(DashboardContext);
};
