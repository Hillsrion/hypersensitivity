import type {
  Choice,
  DialogueLine,
  GameFlags,
  Milestone,
  Scene,
} from '../../types/game'
import { MILESTONES } from '../../data/milestones'
import { evaluateCondition } from './conditions.ts'

export const getCurrentScene = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): Scene | null => scenes[currentSceneId] ?? null

export const getCurrentDialogue = (
  scenes: Record<string, Scene>,
  currentSceneId: string,
  currentDialogueIndex: number
): DialogueLine | null => {
  const scene = scenes[currentSceneId]
  if (!scene || scene.dialogues.length === 0) return null
  return scene.dialogues[currentDialogueIndex] ?? null
}

export const getIsLastDialogue = (
  scenes: Record<string, Scene>,
  currentSceneId: string,
  currentDialogueIndex: number
): boolean => {
  const scene = scenes[currentSceneId]
  if (!scene) return true
  return currentDialogueIndex >= scene.dialogues.length - 1
}

export const getHasDialogues = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): boolean => {
  const scene = scenes[currentSceneId]
  return !!scene && scene.dialogues.length > 0
}

export const getHasChoices = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): boolean => {
  const scene = scenes[currentSceneId]
  return !!scene?.choices && scene.choices.length > 0
}

export const getAvailableChoices = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): Choice[] => {
  const scene = scenes[currentSceneId]
  if (!scene?.choices) return []
  return scene.choices
}

export const isChoiceDisabled = (choice: Choice, flags: GameFlags): boolean => {
  if (!choice.condition) return false
  return !evaluateCondition(choice.condition, flags)
}

export const getEnergyPercentage = (energy: number): number =>
  Math.max(0, Math.min(100, energy))

export const getCurrentDay = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): 1 | 2 => {
  const scene = scenes[currentSceneId]
  return scene?.day ?? 1
}

export const getCurrentTitle = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): string => {
  const scene = scenes[currentSceneId]
  return scene?.title ?? ''
}

export const getMilestones = (): Milestone[] => Object.values(MILESTONES)

export const getReachedMilestonesList = (
  reachedMilestones: string[]
): Milestone[] => {
  return Object.values(MILESTONES).filter((milestone) =>
    reachedMilestones.includes(milestone.id)
  )
}

export const isGameEnded = (
  currentSceneId: string,
  gameEndSceneId: string
): boolean => currentSceneId === gameEndSceneId

export const getFirstDialogueAnnotation = (
  scenes: Record<string, Scene>,
  currentSceneId: string
): string | undefined => {
  const scene = scenes[currentSceneId]
  if (!scene) return undefined
  if (scene.entryAnnotation) return scene.entryAnnotation
  return scene.dialogues[0]?.annotation
}

export const isFirstDialogueOfInitialScene = (
  currentSceneId: string,
  currentDialogueIndex: number,
  initialSceneId: string
): boolean => currentSceneId === initialSceneId && currentDialogueIndex === 0
