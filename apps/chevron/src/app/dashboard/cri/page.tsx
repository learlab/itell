import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@itell/ui/card";
import { CRIChart } from "@cri/cri-chart";
import { DashboardHeader, DashboardShell } from "@dashboard/shell";
import { groupBy } from "es-toolkit";
import pluralize from "pluralize";

import { Meta } from "@/config/metadata";
import { getCRIStats } from "@/db/cri";
import { incrementView } from "@/db/dashboard";
import { type CRI } from "@/drizzle/schema";
import { getSession } from "@/lib/auth";
import { allPagesSorted, getPageData } from "@/lib/pages/pages.server";
import { redirectWithSearchParams } from "@/lib/utils";
import { getScoreMeta } from "./get-label";

const questions = allPagesSorted.reduce<
  Record<string, { slug: string; question: string; answer: string }[]>
>((acc, page) => {
  if (page.cri.length > 0) {
    acc[page.slug] = page.cri;
  }

  return acc;
}, {});

export default async function Page() {
  const { user } = await getSession();
  if (!user) {
    return redirectWithSearchParams("/auth");
  }

  incrementView({ userId: user.id, pageSlug: Meta.cri.slug });

  const { records, byScore } = await getCRIStats(user.id);
  const byPage = groupBy(records, (d) => d.pageSlug);

  const pages = Object.keys(byPage)
    .map((k) => getPageData(k))
    .filter(Boolean);

  pages.sort((a, b) => a.order - b.order);

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
      <DashboardHeader heading={Meta.cri.title} text={Meta.cri.description} />
      <Card>
        <CardHeader>
          <CardDescription>
            {pluralize("question", records.length, true)} was answered in total
          </CardDescription>
        </CardHeader>
        {records.length > 0 && (
          <CardContent className="space-y-4">
            <CRIChart data={chartData} />
            <div className="grid gap-2">
              <h2 className="text-xl font-semibold">All Records</h2>
              <p className="text-sm text-muted-foreground">
                Due to randomness in question placement, you may not receive the
                same question set for a chapter
              </p>
              <div className="grid gap-4">
                {pages.map((page) => {
                  const answers = byPage[page.slug];
                  const excellentAnswers = answers.filter((a) => a.score === 2);
                  return (
                    <Card key={page.slug} className="grid gap-4">
                      <CardHeader>
                        <CardTitle>{page.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {pluralize("answer", answers.length, true)},{" "}
                          {excellentAnswers.length} excellent
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 divide-y divide-border border">
                        {questions[page.slug].map(
                          ({ slug, question, answer }) => {
                            const records = answers.filter(
                              (a) => a.chunkSlug === slug,
                            );
                            if (records.length === 0) {
                              return null;
                            }

                            return (
                              <AnswerItem
                                key={slug}
                                answers={records}
                                question={question}
                                refAnswer={answer}
                              />
                            );
                          },
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </DashboardShell>
  );
}

function AnswerItem({
  answers,
  question,
  refAnswer,
}: {
  answers: CRI[];
  question: string;
  refAnswer: string;
}) {
  return (
    <div className="space-y-2 rounded-md p-4 lg:p-6">
      <div className="space-y-1">
        <p>
          <span className="font-semibold">Question: </span>
          {question}
        </p>
        <p>
          <span className="font-semibold">Reference Answer: </span>
          {refAnswer}
        </p>
      </div>

      <div className="space-y-1">
        <p className="font-semibold">User Answers</p>
        <ul className="space-y-1 font-light leading-snug">
          {answers.map((answer) => (
            <li key={answer.id} className="ml-4 flex justify-between">
              <p>{answer.text}</p>
              <div className="flex gap-2 text-sm text-muted-foreground">
                <p>{getScoreMeta(answer.score).label}</p>
                <time>{answer.createdAt.toLocaleDateString()}</time>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
