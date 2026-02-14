import type { DialogueLine } from "../../types/game";
import { useAnimationsStore } from "~/stores/animations";
import { useGameStore } from "~/stores/game";

export function useDialogueAurora(dialogue: Ref<DialogueLine | null>) {
  const animationsStore = useAnimationsStore();
  const gameStore = useGameStore();
  const auroraRafId = ref<number | null>(null);

  const clearAuroraRaf = () => {
    if (auroraRafId.value !== null) {
      cancelAnimationFrame(auroraRafId.value);
      auroraRafId.value = null;
    }
  };

  const handleAuroraEffect = () => {
    clearAuroraRaf();

    if (dialogue.value?.color) {
      // Set to 1 so it's behind Experience (z-10) but triggering transparency
      animationsStore.setAuroraZIndex(1);

      if (dialogue.value.color === "rainbow") {
        animationsStore.setAuroraAutoAnimate(true);
        animationsStore.setAuroraVisibility(true);
      } else {
        // Set color BEFORE visibility to ensure immediate application
        animationsStore.setAuroraAutoAnimate(false);
        animationsStore.setAuroraColor(dialogue.value.color);

        // Use requestAnimationFrame to ensure the color watcher has processed
        auroraRafId.value = requestAnimationFrame(() => {
          animationsStore.setAuroraVisibility(true);
          auroraRafId.value = null;
        });
      }
    } else {
      // Only reset if we're not in the menu (which also controls aurora)
      if (!gameStore.isMenuOpen) {
        animationsStore.setAuroraVisibility(false);
        animationsStore.setAuroraAutoAnimate(false);
        animationsStore.setAuroraZIndex(0);
      }
    }
  };

  onUnmounted(() => {
    clearAuroraRaf();
  });

  return {
    handleAuroraEffect,
    clearAuroraRaf,
  };
}
