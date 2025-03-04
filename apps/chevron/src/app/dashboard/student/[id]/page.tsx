import Link from "next/link";
import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { buttonVariants } from "@itell/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@itell/ui/card";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { UserProgress } from "@dashboard/user-progress";
import { UserStatistics } from "@dashboard/user-statistics";

import { Meta } from "@/config/metadata";
import { findUser } from "@/db/user";
import { type User } from "@/drizzle/schema";
import { Errors } from "@/lib/constants";
import { routes } from "@/lib/navigation";
import { firstPage, getPageData } from "@/lib/pages/pages.server";
import { checkTeacher } from "../../teacher/check-teacher";

interface PageProps {
  params: Promise<unknown>;
  searchParams?: Promise<unknown>;
}

export default async function Page(props: PageProps) {
  const teacher = await checkTeacher();
  const searchParams = await props.searchParams;
  const { id } = routes.dashboardStudent.$parseParams(await props.params);

  const student = await findUser(id);
  if (!student || student.classId !== teacher.classId) {
    throw new Error(Errors.STUDENT_NOT_EXISTS);
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

function StudentProfile({
  student,
  searchParams,
}: {
  student: User;
  searchParams: unknown;
}) {
  const page = getPageData(student.pageSlug);
  const { reading_time_level } =
    routes.dashboardStudent.$parseSearchParams(searchParams);
  let readingTimeLevel = ReadingTimeChartLevel.week_1;
  if (
    Object.values(ReadingTimeChartLevel).includes(
      reading_time_level as ReadingTimeChartLevel
    )
  ) {
    readingTimeLevel = reading_time_level as ReadingTimeChartLevel;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center justify-between">
            <p>{student.name}</p>
            <p className="text-sm font-semibold text-muted-foreground">
              {page?.title || firstPage?.title}
            </p>
          </div>
        </CardTitle>
        <div className="space-y-4 text-muted-foreground">
          <div className="flex items-center justify-between">
            <p>{student.email}</p>
            <p>joined at {student.createdAt.toLocaleString("en-us")}</p>
          </div>
          <div className="text-center">
            <UserProgress
              pageSlug={student.pageSlug}
              finished={student.finished}
            />
          </div>

          <div className="flex justify-between">
            <p className="text-sm font-semibold text-muted-foreground">
              You are viewing a student in your class
            </p>
            <Link className={buttonVariants()} href="/dashboard/teacher">
              Back to all students
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <UserStatistics
          userId={student.id}
          classId={student.classId}
          pageSlug={student.pageSlug}
          readingTimeLevel={readingTimeLevel}
        />
      </CardContent>
    </Card>
  );
}
