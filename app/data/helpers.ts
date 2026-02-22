import type { DialogueLine } from '../types/game'
import scenesTimings from './timings/scenes.json'

type SceneTimings = NonNullable<DialogueLine['timings']>
type SceneTimingsMap = Record<string, SceneTimings>
const typedScenesTimings = scenesTimings as SceneTimingsMap

// Helper pour creer des dialogues
export const d = (
  id: string,
  speaker: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => {
  const timingsData = typedScenesTimings[id]
  return {
    id,
    speaker,
    speakerType: 'normal',
    text,
    timings: timingsData || options?.timings,
    ...options,
  }
}

export const pensees = (
  id: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => {
  const timingsData = typedScenesTimings[id]
  return {
    id,
    speaker: 'Lucie',
    speakerType: 'pensees',
    text,
    timings: timingsData || options?.timings,
    ...options,
  }
}
