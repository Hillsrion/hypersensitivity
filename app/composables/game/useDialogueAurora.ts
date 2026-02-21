
export function useDialogueAurora() {
  const animationsStore = useAnimationsStore();
  const gameStore = useGameStore();

  const handleAuroraEffect = () => {
    // If the menu is open or opening, the menu component handles the Aurora (rainbow color)
    if (gameStore.isMenuOpen || gameStore.isMenuOpening) {
      return;
    }

    // If we are currently switching scenes, we keep the current aurora state
    // to avoid a blink during the 300ms transition.
    if (gameStore.isTransitioning && animationsStore.aurora.visible) {
      return;
    }

    // If a day transition is pending or happening, hide the aurora so the background gradient is visible
    if (gameStore.isDayTransitioning || gameStore.pendingTransitionSceneId) {
      if (animationsStore.aurora.visible) {
        animationsStore.setAuroraAutoAnimate(false);
        // Animate to transparent to get a smooth CSS transition fade out
        animationsStore.setAuroraColor("transparent");
        
        // Let the CSS transition finish before hiding completely
        if (import.meta.client) {
          setTimeout(() => {
            // Only hide if we're still transitioning (in case they mashed next)
            if (gameStore.isDayTransitioning || gameStore.pendingTransitionSceneId) {
                animationsStore.setAuroraVisibility(false);
                animationsStore.setAuroraZIndex(0);
            }
          }, 1000); // 1s matches the background fade CSS/GSAP
        } else {
            animationsStore.setAuroraVisibility(false);
            animationsStore.setAuroraZIndex(0);
        }
      }
      return;
    }

    // Force hide if we're in an entry annotation (chapter/milestone transition)
    // Note: For milestoneAnnotation, we let the aurora behave normally based on the dialogue color
    if (gameStore.introAnimationPhase === "annotation" || gameStore.introAnimationPhase === "milestoneAnnotation") {
      // User request: "pendant les passages qui les entry annotation l'aurora ne doit pas être jouée non plus, 
      // et si elle a une couleur, elle doit etre animee vers le blanc"
      
      // If Aurora is visible or was just visible, we animate it to white
      if (animationsStore.aurora.visible) {
        animationsStore.setAuroraAutoAnimate(false);
        animationsStore.setAuroraColor("white");
        // We keep it visible so it transitions to white
      } else {
        // If it wasn't visible, we ensure it's hidden (or white but hidden)
        animationsStore.setAuroraVisibility(false);
      }
      return;
    }

    const dialogue = gameStore.currentDialogue;
    if (dialogue?.color) {
      animationsStore.setAuroraZIndex(1);

      if (dialogue.color === "rainbow") {
        if (animationsStore.aurora.autoAnimate && animationsStore.aurora.visible) return;
        animationsStore.setAuroraAutoAnimate(true);
        animationsStore.setAuroraVisibility(true);
      } else {
        const currentColor = animationsStore.aurora.color;
        const isVisible = animationsStore.aurora.visible;

        if (isVisible && currentColor === dialogue.color && !animationsStore.aurora.autoAnimate) {
          return;
        }

        animationsStore.setAuroraAutoAnimate(false);
        animationsStore.setAuroraColor(dialogue.color);
        
        // If not visible, we wait a frame to ensure the color is applied before fading in
        if (!isVisible) {
          if (import.meta.client) {
            requestAnimationFrame(() => {
              animationsStore.setAuroraVisibility(true);
            });
          } else {
            animationsStore.setAuroraVisibility(true);
          }
        } else {
          animationsStore.setAuroraVisibility(true);
        }
      }
    } else {
      if (!gameStore.isMenuOpen) {
        // Don't hide aurora during milestone annotation (to avoid fade to black)
        if (gameStore.introAnimationPhase === "milestoneAnnotation") return;

        animationsStore.setAuroraVisibility(false);
        animationsStore.setAuroraAutoAnimate(false);
        animationsStore.setAuroraZIndex(0);
      }
    }
  };

  // Watch for dialogue or phase changes to update Aurora
  watch(
    [
      () => gameStore.currentDialogue?.id,
      () => gameStore.introAnimationPhase,
      () => gameStore.isMenuOpen,
      () => gameStore.isDayTransitioning,
    ],
    () => {
      handleAuroraEffect();
    },
    { immediate: true }
  );

  return {
    handleAuroraEffect,
  };
}
