import { useDialogueAurora } from "./useDialogueAurora";
import { useDialogueAudioSync } from "./useDialogueAudioSync";
import type { Choice } from "../../types/game";

export const useGameController = () => {
  const gameStore = useGameStore();
  const animationsStore = useAnimationsStore();
  const audioStore = useAudioStore();
  const { $gsap } = useNuxtApp();

  useDialogueAurora();
  useDialogueAudioSync();

  const dialogueBoxRef = useTemplateRef<HTMLElement>("dialogueBoxRef");
  const choicesRef = useTemplateRef<HTMLElement>("choicesRef");
  const isChoiceSelecting = ref(false);
  const activeChoices = ref<Choice[]>([]);

  // Progress tracking
  const audioProgressPercent = computed(() => {
    const audio = audioStore.currentAudio;
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

  const showDelayedGameUI = ref(false);
  let uiDelayTimer: ReturnType<typeof setTimeout> | null = null;
  
  watch(
    () => ({
      phase: gameStore.introAnimationPhase,
      force: gameStore.forceShowUI,
      day: gameStore.currentDay
    }),
    ({ phase, force, day }) => {
      console.log(`LOG_DEBUG: useGameController watcher trigger - phase: ${phase}, force: ${force}, day: ${day}`);
      if (uiDelayTimer) {
        console.log("LOG_DEBUG: Clearing existing uiDelayTimer");
        clearTimeout(uiDelayTimer);
      }

      if (force || phase === "revealing" || phase === "complete") {
        console.log("LOG_DEBUG: Setting showDelayedGameUI = true IMMEDIATELY");
        showDelayedGameUI.value = true;
      } else if ((phase === "annotation" || phase === "milestoneAnnotation") && day > 1) {
        console.log(`LOG_DEBUG: Setting showDelayedGameUI = false initially, then true via 2000ms TIMEOUT (day ${day})`);
        
        // Hide the UI first
        showDelayedGameUI.value = false;
        
        uiDelayTimer = setTimeout(() => {
          console.log("LOG_DEBUG: 2000ms delay finished, setting showDelayedGameUI = true");
          showDelayedGameUI.value = true;
        }, 3000);
      } else {
        console.log("LOG_DEBUG: Setting showDelayedGameUI = false");
        showDelayedGameUI.value = false;
      }
    },
    { immediate: true }
  );

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
  const handleChoiceSelect = (choice: Choice) => {
    isChoiceSelecting.value = false;
    gameStore.selectChoice(choice);
  };

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
    showDelayedGameUI,
    annotationText,
    showContent,
    handleInteraction,
    handleChoiceSelect,
    onDialogueAnimationComplete
  };
};
