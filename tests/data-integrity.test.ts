import { describe, expect, it } from 'vitest'

import { SCENE_IDS } from '../app/data/constants'
import { gameData } from '../app/data/game'
import { MILESTONE_ORDER, MILESTONES } from '../app/data/milestones'

describe('Game Data Integrity', () => {
  const allSceneIds = Object.keys(gameData.scenes)

  it('initialSceneId exists in scenes', () => {
    expect(allSceneIds).toContain(gameData.initialSceneId)
  })

  it('all scenes in milestones exist in gameData.scenes', () => {
    for (const milestone of Object.values(MILESTONES)) {
      milestone.scenes.forEach((sceneId) => {
        expect(
          gameData.scenes[sceneId],
          `Scene "${sceneId}" in milestone "${milestone.id}" is missing from gameData.scenes`
        ).toBeDefined()
      })
    }
  })

  it('all nextSceneId references are valid', () => {
    for (const scene of Object.values(gameData.scenes)) {
      // Check scene-level nextSceneId
      if (scene.nextSceneId) {
        expect(
          allSceneIds,
          `Scene "${scene.id}" has invalid nextSceneId: "${scene.nextSceneId}"`
        ).toContain(scene.nextSceneId)
      }

      // Check choice-level nextSceneId
      if (scene.choices) {
        scene.choices.forEach((choice) => {
          expect(
            allSceneIds,
            `Choice "${choice.id}" in scene "${scene.id}" has invalid nextSceneId: "${choice.nextSceneId}"`
          ).toContain(choice.nextSceneId)
        })
      }
    }
  })

  it('all scenes have a way forward (except terminal scenes)', () => {
    for (const scene of Object.values(gameData.scenes)) {
      if (
        scene.id === SCENE_IDS.DAY_TWO_SUNSET ||
        scene.id === SCENE_IDS.DAY_TWO_MOUNTAIN
      ) {
        continue
      }

      const hasNextScene = !!scene.nextSceneId
      const hasChoices = scene.choices && scene.choices.length > 0

      if (hasNextScene || hasChoices) continue

      // If no explicit path, check if it's followed by another scene in its milestone
      const currentMilestone = Object.values(MILESTONES).find((m) =>
        m.scenes.includes(scene.id)
      )
      if (currentMilestone) {
        const sceneIndex = currentMilestone.scenes.indexOf(scene.id)
        if (sceneIndex < currentMilestone.scenes.length - 1) {
          // Has at least one more scene in the same milestone
          continue
        }

        // If it's the last scene in the milestone, check if there's a next milestone
        const milestoneIndex = MILESTONE_ORDER.indexOf(currentMilestone.id)
        if (milestoneIndex < MILESTONE_ORDER.length - 1) {
          continue
        }
      }

      throw new Error(
        `Scene "${scene.id}" is a dead end: no nextSceneId, no choices, and no subsequent scenes/milestones.`
      )
    }
  })

  it('scenes referenced in gameData are all included in milestones', () => {
    const scenesInMilestones = new Set(
      Object.values(MILESTONES).flatMap((m) => m.scenes)
    )

    allSceneIds.forEach((sceneId) => {
      // Terminal scenes might not be in a milestone if it's a special state, but let's check
      if (
        sceneId === SCENE_IDS.DAY_TWO_SUNSET ||
        sceneId === SCENE_IDS.DAY_TWO_MOUNTAIN
      ) {
        return
      }

      expect(
        scenesInMilestones.has(sceneId),
        `Scene "${sceneId}" is defined in gameData but not included in any milestone in MILESTONES`
      ).toBe(true)
    })
  })

  it('all dialogues have required fields', () => {
    for (const scene of Object.values(gameData.scenes)) {
      scene.dialogues.forEach((dialogue, index) => {
        expect(
          dialogue.id,
          `Dialogue at index ${index} in scene "${scene.id}" missing id`
        ).toBeDefined()
        expect(
          dialogue.speaker,
          `Dialogue "${dialogue.id}" in scene "${scene.id}" missing speaker`
        ).toBeDefined()
        expect(
          dialogue.text,
          `Dialogue "${dialogue.id}" in scene "${scene.id}" missing text`
        ).toBeDefined()
      })
    }
  })
})
