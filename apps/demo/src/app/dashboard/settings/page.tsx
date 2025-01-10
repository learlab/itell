import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@itell/ui/card";
import { Separator } from "@itell/ui/separator";
import { JoinClassModal } from "@dashboard/join-class-modal";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { JoinClassForm } from "@settings/join-class";
import { Profile } from "@settings/profile";
import { QuitClass } from "@settings/quit-class";

import { updateUserAction } from "@/actions/user";
import { SettingsForm } from "@/app/dashboard/settings/_components/settings-form";
import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { findTeacherByClass } from "@/db/teacher";
import { getSession } from "@/lib/auth";
import { isProduction } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { redirectWithSearchParams } from "@/lib/utils";

export default async function Page(props: {
  searchParams: Promise<Record<string, string> | undefined>;
}) {
  const searchParams = await props.searchParams;
  const { user } = await getSession();
  const join_class_code = routes.dashboardSettings.$parseSearchParams(searchParams).join_class_code;

  if (!user) {
    return redirectWithSearchParams("/auth", searchParams);
  }

  incrementView({
    userId: user.id,
    pageSlug: Meta.settings.slug,
    data: searchParams,
  });

  let teacherName: string | null = null;
  let userClassId: string | null = user.classId;

  if (user.classId) {
    const teacher = await findTeacherByClass(user.classId);
    if (teacher) {
      teacherName = teacher.name;
    } else {
      const [, err] = await updateUserAction({ id: user.id, classId: null });
      if (err) {
        throw new Error("failed to update user class id", { cause: err });
      }
      userClassId = null;
    }
  } else if (join_class_code) {
    const teacher = await findTeacherByClass(join_class_code);
    if (teacher) {
      teacherName = teacher.name;
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading={Meta.settings.title} text={Meta.settings.description} />
      <Card>
        <CardHeader>
          <CardTitle>Edit your settings</CardTitle>
          <CardDescription>configure the textbook to your need</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Profile user={user} />
          <Separator />
          <SettingsForm user={user} />
          <Separator />
          {teacherName ? (
            <div className="grid items-start justify-items-start gap-2">
              <h3 className="text-lg font-medium">Class Information</h3>
              <p className="max-w-lg text-sm text-muted-foreground">
                You are enrolled in a class taught by {teacherName}.
              </p>
              {!isProduction && <QuitClass />}
            </div>
          ) : (
            <div className="space-y-4" id="enroll">
              <h3 className="mb-4 text-lg font-medium">Class Registration</h3>
              <JoinClassForm user={user} />
            </div>
          )}
        </CardContent>
      </Card>
      {join_class_code && !userClassId ? (
        <JoinClassModal
          userClassId={user.classId}
          teacherName={teacherName}
          classId={join_class_code}
        />
      ) : null}
    </DashboardShell>
  );
}
