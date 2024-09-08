import { getTeacherAction } from "@/actions/user";
import { getSession } from "@/lib/auth";
import { ClassRole, DASHBOARD_ROLE_COOKIE } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (req: Request) => {
	const { user } = await getSession();
	if (!user) {
		return redirect("/auth");
	}
	const [teacher, _] = await getTeacherAction();
	const isTeacher = !!teacher;

	if (isTeacher) {
		cookies().set(DASHBOARD_ROLE_COOKIE, ClassRole.TEACHER);
	} else {
		cookies().set(DASHBOARD_ROLE_COOKIE, ClassRole.STUDENT);
	}
	const redirectPath = isTeacher ? "/dashboard/teacher" : "/dashboard";
	return redirect(redirectPath);
};
