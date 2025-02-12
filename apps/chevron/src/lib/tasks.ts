export type TaskStatus = "ready" | "in-progress" | "done" | "not-applicable";
export type OffboardingStatus = Record<"outtakeSurvey", TaskStatus>;
export type OnboardingStatus = Record<
  "consent" | "intakeSurvey" | "cTest",
  TaskStatus
>;
