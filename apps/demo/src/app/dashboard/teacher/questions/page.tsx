import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader } from "@itell/ui/card";
import { CRIChart } from "@cri/cri-chart";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import pluralize from "pluralize";

import { getAnswerStatsClassAction } from "@/actions/question";
import { Meta } from "@/config/metadata";
import { incrementView } from "@/db/dashboard";
import { getScoreMeta } from "../../cri/get-label";
import { checkTeacher } from "../check-teacher";

export default async function Page() {
  const teacher = await checkTeacher();
  if (!teacher) {
    return notFound();
  }

  incrementView({ userId: teacher.id, pageSlug: Meta.criTeacher.slug });
  const [data, err] = await getAnswerStatsClassAction({
    classId: teacher.classId,
  });
  if (err) {
    throw new Error("failed to get answer statistics", { cause: err });
  }
  const { byScore } = data;
  const count = byScore.reduce((acc, s) => acc + s.count, 0);

  const chartData = byScore.map((s) => {
    const { label, description } = getScoreMeta(s.score);
    return {
      name: label,
      value: s.count,
      fill: `var(--color-${label})`,
      description,
    };
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading={Meta.criTeacher.title}
        text={Meta.criTeacher.description}
      />
      <Card>
        <CardHeader>
          <CardDescription>
            {pluralize("question", count, true)} was answered in total
          </CardDescription>
        </CardHeader>
        {count > 0 && (
          <CardContent className="space-y-4">
            <CRIChart data={chartData} />
          </CardContent>
        )}
      </Card>
    </DashboardShell>
  );
}
