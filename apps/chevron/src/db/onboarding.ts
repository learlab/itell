import { User } from "lucia";
import { memoize } from "nextjs-better-unstable-cache";

import { getSurveySessions } from "@/db/survey";
import { OnboardingStatus } from "@/lib/tasks";
import { getClozeSession } from "./cloze";

export const getOnboardingStatus = memoize(
  async (user: User): Promise<OnboardingStatus> => {
    if (user.consentGiven === null) {
      return {
        consent: "ready",
        intakeSurvey: "not-applicable",
        cTest: "not-applicable",
      };
    }
    const intakeSession = await getSurveySessions(user.id, "intake");

    if (!intakeSession?.finishedAt) {
      return {
        consent: "done",
        intakeSurvey: intakeSession ? "in-progress" : "ready",
        cTest: "not-applicable",
      };
    }

    const clozeSession = await getClozeSession(user.id);

    return {
      consent: "done",
      intakeSurvey: "done",
      cTest: clozeSession ? "done" : "ready",
    };
  },
  { persist: false }
);
