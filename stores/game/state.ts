import type { GameFlags, GameState } from "../../app/types/game";
import { gameData } from "../../app/data/game";

export const STORAGE_KEY = "hypersensitivity-game-state";
export const DEFAULT_REACHED_MILESTONES = ["reveil"] as const;

export const createInitialFlags = (): GameFlags => ({
  ...gameData.initialFlags,
});

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

export const createInitialGameState = (): GameState => ({
  currentSceneId: gameData.initialSceneId,
  currentDialogueIndex: 0,
  flags: createInitialFlags(),
  reachedMilestones: [...DEFAULT_REACHED_MILESTONES],
  isTransitioning: false,
  showChoices: false,
  menuStatus: "closed",
  introPlayed: false,
  introAnimationPhase: "hidden",
  introBlurAmount: 8,
  isAutoScrolling: false,
  selectedChoice: null,
  showQuestionnaire: false,
  forceShowUI: false,
  isDayTransitioning: false,
  _annotationTimerId: null,
});
