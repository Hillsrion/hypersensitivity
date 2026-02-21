import { watch } from "vue";
import { useAudioStore } from "~/stores/audio";
import { useGameStore } from "~/stores/game";

export function useDialogueAudioSync() {
  const audioStore = useAudioStore();
  const gameStore = useGameStore();

  // Synchronisation pour les audios partagés (progression automatique)
  watch(
    () => audioStore.currentTime,
    (time) => {
      // Uniquement si on a un audio de scène (partagé)
      const scene = gameStore.currentScene;
      if (!scene || !scene.audio) return;
      if (
        gameStore.isLastDialogue ||
        gameStore.showChoices ||
        gameStore.isTransitioning
      )
        return;

      const nextDialogue = scene.dialogues[gameStore.currentDialogueIndex + 1];
      const nextTimings = nextDialogue?.timings;
      if (nextTimings && nextTimings.length > 0) {
        // On cherche le premier timing qui a un start (mot ou annotation)
        const firstTiming = nextTimings[0];
        if (!firstTiming) return;
        const nextStart = firstTiming.start;

        // Si l'audio a atteint le début du dialogue suivant
        // on laisse une petite marge de 0.1s pour éviter les micro-coupures
        if (time >= nextStart - 0.1) {
          console.log(
            "LOG_DEBUG: Auto-advancing shared audio via currentTime watcher",
            { time, nextStart }
          );
          gameStore.advanceDialogue();
        }
      }
    }
  );
}
