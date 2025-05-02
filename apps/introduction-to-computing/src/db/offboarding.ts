import { User } from "lucia";
import { memoize } from "nextjs-better-unstable-cache";

import { getSurveySessions } from "@/db/survey";
import { Survey } from "@/lib/constants";
import { allPagesSorted } from "@/lib/pages/pages.server";
import { OffboardingStatus } from "@/lib/tasks";

export const isOuttakeReady = (user: User) => {
  return (
    user.pageSlug === allPagesSorted[allPagesSorted.length - 1].slug &&
    !user.offboardingFinished
  );
};

export const getOffboardingStatus = memoize(
  async (user: User): Promise<OffboardingStatus> => {
    const isReady = isOuttakeReady(user);
    if (!isReady) {
      return {
        outtakeSurvey: "not-applicable",
      };
    }
    const outtakeSession = await getSurveySessions(user.id, Survey.OUTTAKE);

    if (!outtakeSession?.finishedAt) {
      return {
        outtakeSurvey: outtakeSession ? "in-progress" : "ready",
      };
    }

    return {
      outtakeSurvey: "done",
    };
  },
  { persist: false }
);
