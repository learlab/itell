export const StatusStairs = {
  UNANSWERED: 0,
  NOT_PASSED: 1,
  PASSED: 2,
} as const;

export type StatusStairs = (typeof StatusStairs)[keyof typeof StatusStairs];

export const StatusReread = {
  UNANSWERED: 0,
  ANSWERED: 1,
} as const;
export type StatusReread = (typeof StatusReread)[keyof typeof StatusReread];

export type QuestionScore = 0 | 1 | 2;

export const borderColors: Record<string, string> = {
  [StatusStairs.UNANSWERED]: "border-blue-400",
  [StatusStairs.NOT_PASSED]: "border-red-400",
  [StatusStairs.PASSED]: "border-zinc-500",
} as const;
