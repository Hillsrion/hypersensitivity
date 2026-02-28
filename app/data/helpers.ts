import type { DialogueLine } from '../types/game'
import scenesTimings from './timings/scenes.json'

type SceneTimings = NonNullable<DialogueLine['timings']>
type SceneTimingsMap = Record<string, SceneTimings>
const typedScenesTimings = scenesTimings as SceneTimingsMap

// Helper to create dialogues
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

export const thoughts = (
  id: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => {
  const timingsData = typedScenesTimings[id]
  return {
    id,
    speaker: 'Lucie',
    speakerType: 'thoughts',
    text,
    timings: timingsData || options?.timings,
    ...options,
  }
}
