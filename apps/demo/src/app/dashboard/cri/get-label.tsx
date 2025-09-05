export const getScoreMeta = (isPassed: boolean) => {
  if (isPassed)
    return {
      label: "good",
      description: "User's answer is relevant, but may miss some key points",
    };
  return {
    label: "excellent",
    description: "User's answer captures all the key points",
  };
};
