import { User } from "lucia";

import { SKIP_SUMMARY_STREAK_THRESHOLD } from "@/lib/constants";
import type { PersonalizationData } from "@/drizzle/schema";

export function updatePersonalizationStreak(
  user: User,
  {
    summary,
    cri,
  }: {
    summary?: { isPassed: boolean; isExcellent: boolean };
    cri?: { isCorrect: boolean };
  }
): PersonalizationData {
  const personalization = { ...user.personalization };
  if (summary) {
    // increment streak count by one if summary is a passing one
    const newSummaryStreak = summary.isPassed
      ? (user.personalization.summary_streak || 0) + 1
      : 0;
    personalization.summary_streak = newSummaryStreak;

    // update max streak count
    if (newSummaryStreak > (user.personalization.max_summary_streak || 0)) {
      personalization.max_summary_streak = newSummaryStreak;
    }

    // every new passing summary after a streak allows user to skip one summary
    if (summary.isPassed && newSummaryStreak >= SKIP_SUMMARY_STREAK_THRESHOLD) {
      personalization.available_summary_skips = 1;
    } else {
      personalization.available_summary_skips = 0;
    }

    // if summary is excellent, increment summary skip count
    if (summary.isExcellent) {
      personalization.available_summary_skips =
        (personalization.available_summary_skips || 0) + 1;
    }
  }
  if (cri) {
    // increment streak count by one if answer is correct
    const newQuestionStreak = cri.isCorrect
      ? (user.personalization.cri_streak || 0) + 1
      : 0;
    personalization.cri_streak = newQuestionStreak;

    // update max streak count
    if (newQuestionStreak > (user.personalization.max_cri_streak || 0)) {
      personalization.max_cri_streak = newQuestionStreak;
    }
  }
  return personalization;
}
