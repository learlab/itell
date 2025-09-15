export const StatusStairs = {
  PASSTHROUGH: -1,
  UNANSWERED: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
};

export function getCRIStatus(score: number) {
  if (score < 1.5) {
    return StatusStairs.ONE;
  }

  if (score < 2.5) {
    return StatusStairs.TWO;
  }

  if (score < 3.5) {
    return StatusStairs.THREE;
  }

  return StatusStairs.FOUR;
}

export type StatusStairs = (typeof StatusStairs)[keyof typeof StatusStairs];

export const borderColors: Record<string, string> = {
  [StatusStairs.UNANSWERED]: "border-zinc-400",
  [StatusStairs.PASSTHROUGH]: "border-zinc-400",
  [StatusStairs.ONE]: "border-red-400",
  [StatusStairs.TWO]: "border-red-400",
  [StatusStairs.THREE]: "border-blue-500",
  [StatusStairs.FOUR]: "border-blue-500",
} as const;
