import type { MilestoneDef } from "../../app/data/milestones";
import type { GameFlags, Scene } from "../../app/types/game";
import { isSceneEligible } from "./conditions.ts";

interface ProgressionContext {
  currentSceneId: string;
  flags: GameFlags;
  scenes: Record<string, Scene>;
  milestones: Record<string, MilestoneDef>;
  milestoneOrder: string[];
  getMilestoneForScene: (sceneId: string) => MilestoneDef | undefined;
}

export type NextProgressionStep =
  | { type: "scene"; sceneId: string }
  | { type: "milestone"; milestoneId: string }
  | { type: "none" };

export const resolveNextProgressionStep = ({
  currentSceneId,
  flags,
  scenes,
  milestoneOrder,
  getMilestoneForScene,
}: ProgressionContext): NextProgressionStep => {
  const currentMilestone = getMilestoneForScene(currentSceneId);
  if (!currentMilestone) {
    return { type: "none" };
  }

  const currentIndex = currentMilestone.scenes.indexOf(currentSceneId);

  for (let index = currentIndex + 1; index < currentMilestone.scenes.length; index++) {
    const nextSceneId = currentMilestone.scenes[index];
    if (!nextSceneId) continue;

    const nextScene = scenes[nextSceneId];
    if (nextScene && isSceneEligible(nextScene, flags)) {
      return { type: "scene", sceneId: nextSceneId };
    }
  }

  const currentMilestoneIndex = milestoneOrder.indexOf(currentMilestone.id);
  if (
    currentMilestoneIndex !== -1 &&
    currentMilestoneIndex < milestoneOrder.length - 1
  ) {
    const milestoneId = milestoneOrder[currentMilestoneIndex + 1];
    if (milestoneId) {
      return { type: "milestone", milestoneId };
    }
  }

  return { type: "none" };
};

export const findFirstValidSceneIdInMilestone = (
  milestoneId: string,
  milestones: Record<string, MilestoneDef>,
  scenes: Record<string, Scene>,
  flags: GameFlags
): string | null => {
  const milestone = milestones[milestoneId];
  if (!milestone) {
    return null;
  }

  for (const sceneId of milestone.scenes) {
    const scene = scenes[sceneId];
    if (!scene) continue;

    if (isSceneEligible(scene, flags)) {
      return sceneId;
    }
  }

  return null;
};
