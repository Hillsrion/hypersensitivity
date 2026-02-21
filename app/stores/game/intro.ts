import type { IntroAnimationPhase } from "../../types/game";

export const getEntryAnnotationPhase = (
  introPlayed: boolean
): IntroAnimationPhase => (introPlayed ? "milestoneAnnotation" : "annotation");

export const shouldAutoCompleteAnnotation = (
  phase: IntroAnimationPhase
): boolean => phase === "annotation" || phase === "milestoneAnnotation";

export const computeAnnotationDelayMs = (
  firstWordStartSeconds: number | undefined,
  marginSeconds = 0.5
): number => {
  const firstWordStart = firstWordStartSeconds ?? 3;
  return Math.max(1, firstWordStart - marginSeconds) * 1000;
};

export const clearScheduledTimer = (
  timerId: ReturnType<typeof setTimeout> | null
): null => {
  if (timerId) {
    clearTimeout(timerId);
  }
  return null;
};

export const scheduleTimer = (
  callback: () => void,
  delayMs: number
): ReturnType<typeof setTimeout> => setTimeout(callback, delayMs);
