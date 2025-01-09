import { getSession } from "@/lib/auth";

import "server-only";

import { findTeacher } from "@/db/teacher";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export const checkTeacher = async () => {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("/auth", {
      redirect_to: routes.dashboardTeacher(),
    });
  }

  const teacher = await findTeacher(user.id);
  if (!teacher) {
    throw new Error("teacher only");
  }

  return teacher;
};
