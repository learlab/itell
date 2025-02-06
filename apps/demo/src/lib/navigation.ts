import { ReadingTimeChartLevel } from "@itell/core/dashboard";
import { createNavigationConfig } from "next-safe-navigation";
import { z } from "zod";

import { Survey } from "./constants";

export enum LeaderboardMetric {
  all = "all",
  summary_streak = "summary_streak",
  cri_streak = "cri_streak",
}

const classCodeValid = z.union([
  z.boolean().optional(),
  z
    .string()
    .optional()
    .transform((val) => {
      if (val === "undefined") return undefined;
      if (val === "true") return true;
      if (val === "false") return false;

      return false;
    }),
]);

export const { routes, useSafeParams, useSafeSearchParams } =
  createNavigationConfig((defineRoute) => ({
    home: defineRoute("/", {
      search: z
        .object({
          class_code_valid: classCodeValid,
        })
        .default({ class_code_valid: undefined }),
    }),
    onboarding: defineRoute("/onboarding", {
      search: z
        .object({
          class_code_valid: classCodeValid,
        })
        .default({ class_code_valid: undefined }),
    }),
    consent: defineRoute("/onboarding/consent"),
    intakeSurvey: defineRoute("/onboarding/intake"),
    intakeSurveySection: defineRoute("/onboarding/intake/[sectionId]", {
      params: z.object({
        sectionId: z.string(),
      }),
    }),
    outtakeSurvey: defineRoute("/offboarding/outtake"),
    outtakeSurveySection: defineRoute("/offboarding/outtake/[sectionId]", {
      params: z.object({
        sectionId: z.string(),
      }),
    }),
    cTest: defineRoute("/onboarding/ctest"),
    guide: defineRoute("/guide"),
    auth: defineRoute("/auth", {
      search: z
        .object({
          error: z.string().optional(),
          join_class_code: z.string().optional(),
          redirect_to: z.string().optional(),
        })
        .default({
          error: undefined,
          join_class_code: undefined,
          redirect_to: undefined,
        }),
    }),
    textbook: defineRoute("/[slug]", {
      params: z.object({
        slug: z.string(),
      }),
      search: z
        .object({
          summary: z.string().optional(),
          quiz: z.boolean().optional(),
        })
        .default({ summary: undefined, quiz: undefined }),
    }),
    summary: defineRoute("/summary/[id]", {
      params: z.object({
        id: z.number(),
      }),
    }),
    dashboard: defineRoute("/dashboard", {
      search: z
        .object({
          join_class_code: z.string().optional(),
          reading_time_level: z.string().optional(),
          leaderboard_metric: z.string().optional(),
        })
        .default({
          reading_time_level: ReadingTimeChartLevel.week_1,
          leaderboard_metric: LeaderboardMetric.all,
          join_class_code: undefined,
        }),
    }),
    dashboardTeacher: defineRoute("/dashboard/teacher"),
    dashboardCRI: defineRoute("/dashboard/cri"),
    dashboardCRITeacher: defineRoute("/dashboard/teacher/cri"),
    dashboardForms: defineRoute("/dashboard/forms"),
    dashboardSummaries: defineRoute("/dashboard/summaries", {
      search: z
        .object({
          page: z.string().optional(),
        })
        .default({ page: undefined }),
    }),
    dashboardSummariesTeacher: defineRoute("/dashboard/teacher/summaries", {
      search: z
        .object({
          page: z.string().optional(),
        })
        .default({ page: undefined }),
    }),
    dashboardStudent: defineRoute("/dashboard/student/[id]", {
      params: z.object({
        id: z.string(),
      }),
      search: z
        .object({
          reading_time_level: z.string().default(ReadingTimeChartLevel.week_1),
        })
        .default({ reading_time_level: ReadingTimeChartLevel.week_1 }),
    }),
    dashboardSettings: defineRoute("/dashboard/settings", {
      search: z
        .object({
          join_class_code: z.string().optional(),
        })
        .default({ join_class_code: undefined }),
    }),
  }));

export const surveyHomeRoute = (surveyId: string) => {
  switch (surveyId) {
    case Survey.INTAKE:
      return routes.intakeSurvey();
    case Survey.OUTTAKE:
      return routes.outtakeSurvey();
    default:
      return routes.home();
  }
};

export const surveySectionRoute = (surveyId: string, sectionId: string) => {
  switch (surveyId) {
    case Survey.INTAKE:
      return routes.intakeSurveySection({ sectionId });
    case Survey.OUTTAKE:
      return routes.outtakeSurveySection({ sectionId });
    default:
      return routes.home();
  }
};
