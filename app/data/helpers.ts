import type { DialogueLine } from "../types/game";
import scenesTimings from "./timings/scenes.json";

// Helper pour creer des dialogues
export const d = (
  id: string,
  speaker: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => {
  const timingsData = (scenesTimings as Record<string, any[]>)[id];
  return {
    id,
    speaker,
    speakerType: "normal",
    text,
    timings: timingsData || options?.timings,
    ...options,
  };
};

export const pensees = (
  id: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => {
  const timingsData = (scenesTimings as Record<string, any[]>)[id];
  return {
    id,
    speaker: "Lucie",
    speakerType: "pensees",
    text,
    timings: timingsData || options?.timings,
    ...options,
  };
};
