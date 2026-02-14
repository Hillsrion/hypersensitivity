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

    // Force hide if we're in an entry annotation (chapter/milestone transition)
    if (gameStore.introAnimationPhase === "annotation") {
      animationsStore.setAuroraVisibility(false);
      return;
    }

    if (dialogue.value?.color) {
      animationsStore.setAuroraZIndex(1);

      if (dialogue.value.color === "rainbow") {
        // If already rainbow and visible, don't re-trigger
        if (animationsStore.aurora.autoAnimate && animationsStore.aurora.visible) {
          return;
        }
        animationsStore.setAuroraAutoAnimate(true);
        animationsStore.setAuroraVisibility(true);
      } else {
        const currentColor = animationsStore.aurora.color;
        const isVisible = animationsStore.aurora.visible;

        // If same color and already visible, do nothing to avoid blinks
        if (isVisible && currentColor === dialogue.value.color && !animationsStore.aurora.autoAnimate) {
          return;
        }

        animationsStore.setAuroraAutoAnimate(false);
        animationsStore.setAuroraColor(dialogue.value.color);

        // If not visible, we wait for a frame to ensure the color is applied before fading in
        if (!isVisible) {
          auroraRafId.value = requestAnimationFrame(() => {
            animationsStore.setAuroraVisibility(true);
            auroraRafId.value = null;
          });
        } else {
          // If already visible but color changed, setAuroraVisibility(true) shouldn't blink
          // but we can call it just in case if it was somehow in a transition
          animationsStore.setAuroraVisibility(true);
        }
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

  watch(
    () => gameStore.introAnimationPhase,
    (phase) => {
      if (phase === "annotation") {
        animationsStore.setAuroraVisibility(false);
      } else if (phase === "complete") {
        handleAuroraEffect();
      }
    }
  );

  onUnmounted(() => {
    clearAuroraRaf();
  });

  return {
    handleAuroraEffect,
    clearAuroraRaf,
  };
}
