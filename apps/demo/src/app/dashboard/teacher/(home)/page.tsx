import { notFound } from "next/navigation";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { ErrorBoundary } from "react-error-boundary";

import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { checkTeacher } from "../check-teacher";
import { ClassInfo } from "./_components/class-info";

export default async function Page() {
  const teacher = await checkTeacher();
  if (!teacher) {
    return notFound();
  }

  incrementView({ userId: teacher.id, pageSlug: Meta.homeTeacher.slug });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.homeTeacher.title}
        text={Meta.homeTeacher.description}
      />
      <ErrorBoundary fallback={<ClassInfo.ErrorFallback />}>
        <ClassInfo userId={teacher.id} classId={teacher.classId} />
      </ErrorBoundary>
    </DashboardShell>
  );
}
