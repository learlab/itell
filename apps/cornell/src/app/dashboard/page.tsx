import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { ClassStudentCount } from "@/components/dashboard/student/class-student-count";
import { UserStatistics } from "@/components/dashboard/user-statistics";
import { UserProgress } from "@/components/dashboard/user/user-progress";
import { DashboardShell } from "@/components/page/shell";
import { Spinner } from "@/components/spinner";
import { Meta } from "@/config/metadata";
import { getCurrentUser } from "@/lib/auth";
import { getUser } from "@/lib/user";
import { redirectWithSearchParams } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = Meta.dashboard;

type Props = {
	searchParams: {
		[key: string]: string;
	};
};

export default async function ({ searchParams }: Props) {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return redirectWithSearchParams("/auth", searchParams);
	}

	const user = await getUser(currentUser.id);

	if (!user) {
		return redirectWithSearchParams("/auth", searchParams);
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.dashboard.title}
				text={Meta.dashboard.description}
			/>

			<div className="space-y-4">
				<div className="px-2">
					<UserProgress user={user} />
				</div>
				{user.classId ? (
					<p className="p-2 text-muted-foreground">
						You are enrolled in a class with{" "}
						<Suspense fallback={<Spinner className="inline" />}>
							<ClassStudentCount classId={user.classId} />
						</Suspense>{" "}
						other students
					</p>
				) : (
					<p className="p-2 text-muted-foreground">
						You are not enrolled in any class. Enter your class code in{" "}
						<Link href="/dashboard/settings#enroll" className="underline">
							Settings
						</Link>{" "}
						to enroll in a class
					</p>
				)}

				<UserStatistics user={user} searchParams={searchParams} />
			</div>
		</DashboardShell>
	);
}
