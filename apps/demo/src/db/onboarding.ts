import { User } from "lucia";
import { memoize } from "nextjs-better-unstable-cache";

import { getSurveySessions } from "@/db/survey";

export type TaskStatus = "in-progress" | "done" | "not-applicable";
export type OnboardingStatus = Record<"consent" | "intakeSurvey", TaskStatus>;

export const getOnboardingStatus = memoize(
  async (user: User): Promise<OnboardingStatus> => {
    const intakeSession = await getSurveySessions(user, "intake");
    const consentStatus: TaskStatus =
      user.consentGiven !== null ? "done" : "in-progress";
    const intakeStatus: TaskStatus =
      consentStatus === "done"
        ? intakeSession?.finishedAt
          ? "done"
          : "in-progress"
        : "not-applicable";
    return {
      consent: consentStatus,
      intakeSurvey: intakeStatus,
    };
  },
  { persist: false }
);
