export const DEFAULT_REACHED_MILESTONES = ["reveil"] as const;

export const ensureInitialMilestone = (
  reachedMilestones?: string[] | null
): string[] => {
  const milestones = Array.isArray(reachedMilestones)
    ? reachedMilestones.filter(
        (milestoneId): milestoneId is string => typeof milestoneId === "string"
      )
    : [];

  if (!milestones.includes(DEFAULT_REACHED_MILESTONES[0])) {
    milestones.unshift(DEFAULT_REACHED_MILESTONES[0]);
  }

  return milestones;
};
