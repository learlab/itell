import { StatusStairs } from "@/lib/cri";

export const getScoreMeta = (status: StatusStairs) => {
  if (status === StatusStairs.ONE) {
    return {
      label: "Level 1",
      color: "one",
      description:
        "response is missing many relevant details from the passage.",
    };
  }

  if (status === StatusStairs.TWO) {
    return {
      label: "Level 2",
      color: "two",
      description:
        "response seems to be missing some relevant details from the passage.",
    };
  }

  if (status === StatusStairs.THREE) {
    return {
      label: "Level 3",
      color: "three",
      description: "response included some relevant details from the passage",
    };
  }

  if (status === StatusStairs.FOUR) {
    return {
      label: "Level 4",
      color: "four",
      description:
        "response demonstrates deep, thoughtful reading and strong comprehension ",
    };
  }

  return {
    label: "unknown",
    color: "one",
    description: "unknown",
  };
};
