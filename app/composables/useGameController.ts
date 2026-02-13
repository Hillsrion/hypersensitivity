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

  const showGameUI = computed(() => {
    return (
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
    if (
      !showGameUI.value || // Pas d'interaction pendant l'intro
      gameStore.showChoices ||
      gameStore.isTransitioning ||
      gameStore.isMenuOpen
    ) {
      return;
    }
    gameStore.advanceDialogue();
  };

  // Gerer la selection d'un choix
  const handleChoiceSelect = (choice: any) => {
    isChoiceSelecting.value = false;
    gameStore.selectChoice(choice);
  };

  // Gerer l'effet Aurora quand le dialogue a une couleur
  watch(
    () => gameStore.currentDialogue?.color,
    (color) => {
      if (color) {
        animationsStore.setAuroraColor(color);
        animationsStore.setAuroraVisibility(true);
      } else {
        animationsStore.setAuroraVisibility(false);
      }
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
    // Logic for dialogue animation completion
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
    showGameUI,
    annotationText,
    showContent,
    handleInteraction,
    handleChoiceSelect,
    onDialogueAnimationComplete
  };
};
