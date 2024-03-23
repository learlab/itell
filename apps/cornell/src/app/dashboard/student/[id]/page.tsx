import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StudentProfile } from "@/components/dashboard/student/student-profile";
import { DashboardShell } from "@/components/page/shell";
import { Meta } from "@/config/metadata";
import { getCurrentUser } from "@/lib/auth";
import { getUserTeacherStatus } from "@/lib/dashboard";
import { getUser } from "@/lib/user";
import { Errorbox } from "@itell/ui/server";
import { redirect } from "next/navigation";

export const metadata = Meta.student;

interface PageProps {
	params: {
		id: string;
	};
	searchParams: {
		[key: string]: string;
	};
}

export default async function ({ params, searchParams }: PageProps) {
	const user = await getCurrentUser();

	if (!user) {
		return redirect("/auth");
	}

	const teacher = await getUserTeacherStatus(user.id);

	if (!teacher) {
		return (
			<DashboardShell>
				<DashboardHeader
					heading={Meta.student.title}
					text={Meta.student.description}
				/>
				<Errorbox>You have to be a teacher to view this page.</Errorbox>
			</DashboardShell>
		);
	}

	const student = await getUser(params.id);
	if (!student) {
		return (
			<DashboardShell>
				<DashboardHeader
					heading={Meta.student.title}
					text={Meta.student.description}
				/>
				<Errorbox>The student does not exist in your class</Errorbox>
			</DashboardShell>
		);
	}

	return (
		<DashboardShell>
			<DashboardHeader
				heading={Meta.student.title}
				text={Meta.student.description}
			/>
			<StudentProfile student={student} searchParams={searchParams} />
		</DashboardShell>
	);
}
