import type { DialogueLine } from "../../types/game";
import { useAudioStore } from "~/stores/audio";
import { useGameStore } from "~/stores/game";

export function useDialogueAudio(dialogue: Ref<DialogueLine | null>) {
  const audioStore = useAudioStore();
  const gameStore = useGameStore();
  const fallbackTimer = ref<ReturnType<typeof setTimeout> | null>(null);

  const clearFallbackTimer = () => {
    if (fallbackTimer.value) {
      clearTimeout(fallbackTimer.value);
      fallbackTimer.value = null;
    }
  };

  const handleAudioEnded = () => {
    console.log("LOG_DEBUG: handleAudioEnded called");
    clearFallbackTimer();

    if (gameStore.isLastDialogue && gameStore.hasChoices) {
      console.log(
        "LOG_DEBUG: Last dialogue with choices, showing choices instead of advancing"
      );
      gameStore.showChoices = true;
      return;
    }
    console.log("LOG_DEBUG: Advancing dialogue");
    gameStore.advanceDialogue();
  };

  const ensureAudioPlaying = (path: string) => {
    const currentItem = (audioStore.list as any[]).find(
      (item) => item.audio === audioStore.currentAudio
    );

    // Normalize paths for comparison (remove leading slash if present)
    const normPath = path.startsWith("/") ? path.substring(1) : path;
    const normCurrentPath = currentItem?.path.startsWith("/")
      ? currentItem.path.substring(1)
      : currentItem?.path;

    // Check simple equality or if path ends with the other (handle relative/absolute confusion)
    const isSamePath =
      normCurrentPath === normPath ||
      normCurrentPath?.endsWith(normPath) ||
      normPath?.endsWith(normCurrentPath || "___");

    if (currentItem && isSamePath && audioStore.isPlaying) {
      console.log("LOG_DEBUG: Audio already playing:", path);

      // NEW: If shared audio, ensure we are at the right position if just switched
      const timings = dialogue.value?.timings;
      const firstTiming = timings?.find((t) => t.start !== undefined);

      if (firstTiming && gameStore.currentDialogueIndex > 0) {
        const audio = audioStore.currentAudio as any;

        if (audio && audio.currentTime < firstTiming.start - 0.5) {
          console.log(
            "LOG_DEBUG: Seeking shared audio to:",
            firstTiming.start
          );
          audio.currentTime = firstTiming.start;
        }
      }
      return;
    }

    const audioPath = path.startsWith("/") ? path : `/audios/${path}`;
    console.log("LOG_DEBUG: Starting new audio:", audioPath);
    audioStore.playAudio(audioPath);

    // Seek if we have timings and we're joining mid-scene (not at the first dialogue)
    // Don't seek for the first dialogue of any scene — let the ambient intro play from 0
    const firstTiming = dialogue.value?.timings?.find(
      (t) => t.start !== undefined
    );
    if (firstTiming && gameStore.currentDialogueIndex > 0) {
      setTimeout(() => {
        const audio = audioStore.currentAudio as any;
        if (audio && audio.currentTime < firstTiming.start) {
          audio.currentTime = firstTiming.start;
        }
      }, 50);
    }
  };

  return {
    fallbackTimer,
    clearFallbackTimer,
    handleAudioEnded,
    ensureAudioPlaying,
  };
}
