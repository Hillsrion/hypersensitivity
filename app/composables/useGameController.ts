import { useGameStore } from "~/stores/game";
import { useAnimationsStore } from "~/stores/animations";
import { useAudioStore } from "~/stores/audio";

export const useGameController = () => {
  const gameStore = useGameStore();
  const animationsStore = useAnimationsStore();
  const audioStore = useAudioStore();
  const { $gsap } = useNuxtApp();

  const dialogueBoxRef = ref<any>(null);
  const choicesRef = ref<HTMLElement | null>(null);
  const isChoiceSelecting = ref(false);
  const activeChoices = ref<any[]>([]);

  // Progress tracking
  const audioProgressPercent = computed(() => {
    const audio = audioStore.currentAudio as any;
    if (!audio || !audioStore.isPlaying) return 0;
    
    const duration = audio.duration;
    if (!duration || isNaN(duration) || duration === 0) return 0;
    
    return Math.min(100, (audioStore.currentTime / duration) * 100);
  });

  // Visibility indicators
  const showAnnotation = computed(() => {
    return gameStore.introAnimationPhase === "annotation";
  });

  const isMilestoneAnnotation = computed(() => {
    return gameStore.introAnimationPhase === "milestoneAnnotation";
  });

  const showGameUI = computed(() => {
    return (
      gameStore.forceShowUI ||
      gameStore.introAnimationPhase === "revealing" ||
      gameStore.introAnimationPhase === "complete"
    );
  });

  const annotationText = computed(() => {
    const text = gameStore.firstDialogueAnnotation || "";
    console.log("LOG_DEBUG: annotationText computed:", text);
    return text;
  });

  const showContent = computed(() => {
    const has = gameStore.hasDialogues && !!gameStore.currentDialogue;
    console.log("LOG_DEBUG: GameContainer showContent:", has, "currentDialogueIdx:", gameStore.currentDialogueIndex);
    return has;
  });

  // Initialiser le jeu au montage
  onMounted(() => {
    gameStore.initGame();
  });

  // Gerer le clic pour avancer dans les dialogues
  const handleInteraction = () => {
    // Si on est en train d'afficher une annotation d'entrée (milestone)
    // le premier clic permet de la passer pour voir le dialogue
    if (gameStore.introAnimationPhase === "annotation" || gameStore.introAnimationPhase === "milestoneAnnotation") {
        console.log("LOG_DEBUG: Skipping entry annotation via click");
        // Si c'etait une milestoneAnnotation, on s'assure de passer a complete
        // Pour l'annotation normale, ca reste pareil
        gameStore.setIntroAnimationPhase("complete");
        return;
    }

    if (
      (!showGameUI.value && !gameStore.introPlayed) || // Bloquer seulement si l'intro globale n'est pas jouée
      gameStore.showChoices ||
      gameStore.isTransitioning ||
      gameStore.isMenuOpen ||
      gameStore.isMenuOpening ||
      gameStore.isMenuClosing
    ) {
      return;
    }
    gameStore.advanceDialogue();
  };

  // Gerer la selection d'un choix
  const handleChoiceSelect = (choice: any) => {
    isChoiceSelecting.value = false;
    gameStore.selectChoice(choice);
  };  // Aurora management (stable, doesn't remount on dialogue change)
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

    // Force hide if we're in an entry annotation (chapter/milestone transition)
    // Note: For milestoneAnnotation, we let the aurora behave normally based on the dialogue color
    if (gameStore.introAnimationPhase === "annotation") {
      animationsStore.setAuroraVisibility(false);
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
    [() => gameStore.currentDialogue?.id, () => gameStore.introAnimationPhase, () => gameStore.isMenuOpen],
    () => {
      handleAuroraEffect();
    },
    { immediate: true }
  );


  // Animation des choix quand ils apparaissent
  watch(
    () => gameStore.showChoices,
    async (show) => {
      if (show && showGameUI.value) {
        activeChoices.value = [...gameStore.availableChoices];
        await nextTick();
        if (choicesRef.value) {
          $gsap.fromTo(
            choicesRef.value,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }
      }
    }
  );

  // Nettoyer les choix quand ils ne sont plus nécessaires
  watch(
    () => gameStore.selectedChoice,
    (choice) => {
      if (!choice && !gameStore.showChoices) {
        activeChoices.value = [];
      }
    }
  );

  // Animation quand le dialogue change
  const onDialogueAnimationComplete = () => {
    console.log("LOG_DEBUG: onDialogueAnimationComplete called");
    
    // Pour les dialogues type "chat", on respecte purement les timings définis
    // donc quand l'animation (timeline) est finie, on passe à la suite
    if (gameStore.currentDialogue?.isChat) {
      console.log("LOG_DEBUG: Chat dialogue completed, advancing");
      gameStore.advanceDialogue();
      return;
    }

    // On ne fait plus d'avance automatique ici pour les audios partagés
    // car cela cause un effet "machine gun" si on est un peu en avance.
    // On utilise maintenant le watcher sur audioStore.currentTime pour plus de précision.
  };

  // Synchronisation pour les audios partagés (progression automatique)
  watch(
    () => audioStore.currentTime,
    (time) => {
      // Uniquement si on a un audio de scène (partagé)
      const scene = gameStore.currentScene;
      if (!scene || !scene.audio) return;
      if (gameStore.isLastDialogue || gameStore.showChoices || gameStore.isTransitioning) return;
      
      const nextDialogue = scene.dialogues[gameStore.currentDialogueIndex + 1];
      const nextTimings = nextDialogue?.timings;
      if (nextTimings && nextTimings.length > 0) {
        // On cherche le premier timing qui a un start (mot ou annotation)
        const nextStart = nextTimings[0].start;
        
        // Si l'audio a atteint le début du dialogue suivant
        // on laisse une petite marge de 0.1s pour éviter les micro-coupures
        if (time >= nextStart - 0.1) {
          console.log("LOG_DEBUG: Auto-advancing shared audio via currentTime watcher", { time, nextStart });
          gameStore.advanceDialogue();
        }
      }
    }
  );

  // Watch menu opening sequence
  watch(
    () => gameStore.isMenuOpening,
    (isOpening) => {
      if (isOpening) {
        setTimeout(() => {
          gameStore.openMenu();
        }, 400); // Wait for fade-out animation
      }
    }
  );

  return {
    gameStore,
    animationsStore,
    audioStore,
    dialogueBoxRef,
    choicesRef,
    isChoiceSelecting,
    activeChoices,
    audioProgressPercent,
    showAnnotation,
    isMilestoneAnnotation,
    showGameUI,
    annotationText,
    showContent,
    handleInteraction,
    handleChoiceSelect,
    onDialogueAnimationComplete
  };
};
