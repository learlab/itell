export const StatusReread = {
  UNANSWERED: 0,
  ANSWERED: 1,
} as const;
export type StatusReread = (typeof StatusReread)[keyof typeof StatusReread];

export type QuestionScore = 0 | 1 | 2;
