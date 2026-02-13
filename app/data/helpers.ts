import type { DialogueLine } from "../types/game";

// Helper pour creer des dialogues
export const d = (
  id: string,
  speaker: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => ({
  id,
  speaker,
  speakerType: "normal",
  text,
  ...options,
});

export const pensees = (
  id: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => ({
  id,
  speaker: "Lucie",
  speakerType: "pensees",
  text,
  ...options,
});
