import type { MilestoneDef } from '../../data/milestones'
import type { GameFlags, Scene } from '../../types/game'
import { isSceneEligible } from './conditions.ts'

type ProgressionContext = {
  currentSceneId: string
  flags: GameFlags
  scenes: Record<string, Scene>
  milestones: Record<string, MilestoneDef>
  milestoneOrder: string[]
  getMilestoneForScene: (sceneId: string) => MilestoneDef | undefined
}

export type NextProgressionStep =
  | { type: 'scene'; sceneId: string }
  | { type: 'milestone'; milestoneId: string }
  | { type: 'none' }

export const resolveNextProgressionStep = ({
  currentSceneId,
  flags,
  scenes,
  milestones,
  milestoneOrder,
  getMilestoneForScene,
}: ProgressionContext): NextProgressionStep => {
  const currentMilestone = getMilestoneForScene(currentSceneId)
  if (!currentMilestone) {
    return { type: 'none' }
  }

  const currentIndex = currentMilestone.scenes.indexOf(currentSceneId)
  const currentScene = scenes[currentSceneId]

  // If the current scene is terminal, we don't look for more scenes in the same milestone
  if (!currentScene?.terminal) {
    for (
      let index = currentIndex + 1;
      index < currentMilestone.scenes.length;
      index++
    ) {
      const nextSceneId = currentMilestone.scenes[index]
      if (!nextSceneId) continue

      const nextScene = scenes[nextSceneId]
      if (nextScene && isSceneEligible(nextScene, flags)) {
        return { type: 'scene', sceneId: nextSceneId }
      }
    }
  }

  // 2. Try next milestones sequentially until we find one with an eligible scene
  const currentMilestoneIndex = milestoneOrder.indexOf(currentMilestone.id)
  if (currentMilestoneIndex !== -1) {
    for (let i = currentMilestoneIndex + 1; i < milestoneOrder.length; i++) {
      const milestoneId = milestoneOrder[i]
      if (!milestoneId) continue

      const firstValidSceneId = findFirstValidSceneIdInMilestone(
        milestoneId,
        milestones,
        scenes,
        flags
      )

      if (firstValidSceneId) {
        return { type: 'milestone', milestoneId }
      }
    }
  }

  return { type: 'none' }
}

export const findFirstValidSceneIdInMilestone = (
  milestoneId: string,
  milestones: Record<string, MilestoneDef>,
  scenes: Record<string, Scene>,
  flags: GameFlags
): string | null => {
  const milestone = milestones[milestoneId]
  if (!milestone) {
    return null
  }

  for (const sceneId of milestone.scenes) {
    const scene = scenes[sceneId]
    if (!scene) continue

    if (isSceneEligible(scene, flags)) {
      return sceneId
    }
  }

  return null
}
