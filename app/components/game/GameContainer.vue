<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useAnimationsStore } from "~/stores/animations";
import GameHeader from "./GameHeader.vue";
import GameEnergyBar from "./GameEnergyBar.vue";
import DialogueBox from "./DialogueBox.vue";
import ChoiceButtons from "./ChoiceButtons.vue";
import GameMilestoneMenu from "./GameMilestoneMenu.vue";
import MenuIcon from "../MenuIcon.vue";

import IntroAnnotation from "./IntroAnnotation.vue";

const gameStore = useGameStore();
const animationsStore = useAnimationsStore();
const { $gsap } = useNuxtApp();

const containerRef = ref<HTMLElement | null>(null);
const dialogueBoxRef = ref<InstanceType<typeof DialogueBox> | null>(null);
const choicesRef = ref<HTMLElement | null>(null);
const isChoiceSelecting = ref(false);
const activeChoices = ref<any[]>([]);

// Computeds de visibilité
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
  return gameStore.firstDialogueAnnotation || "";
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

// Animation quand le dialogue change
const onDialogueAnimationComplete = () => {
  // Le dialogue a fini son animation
  // On peut maintenant permettre de cliquer pour avancer
};

// Computed pour savoir si on affiche le contenu
const showContent = computed(() => {
  return gameStore.hasDialogues && gameStore.currentDialogue;
});

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
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-screen overflow-hidden transition-colors duration-500"
    @click="handleInteraction"
  >
    <!-- Menu Icon (top left) -->
    <Transition name="fade">
      <button
        v-if="showGameUI && !gameStore.isMenuOpening && !gameStore.isMenuOpen"
        class="absolute top-10 left-18 z-50 text-primary"
        @click.stop="gameStore.toggleMenu()"
      >
        <MenuIcon />
      </button>
    </Transition>

    <!-- Header -->
    <Transition name="fade">
      <GameHeader
        v-if="showGameUI && !gameStore.isMenuOpening && !gameStore.isMenuOpen"
      />
    </Transition>

    <!-- Energy Bar (right side) -->
    <Transition name="fade">
      <GameEnergyBar
        v-if="showGameUI && !gameStore.isMenuOpening && !gameStore.isMenuOpen"
        class="absolute top-1/2 left-18 -translate-y-1/2 z-40"
      />
    </Transition>

    <!-- Intro Annotation -->
    <Transition name="fade">
      <div
        v-if="showAnnotation"
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
      >
        <IntroAnnotation
          :text="annotationText"
          :blur-amount="gameStore.introBlurAmount"
        />
      </div>
    </Transition>

    <!-- Dialogue Area (center) -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
    >
      <Transition name="fade" mode="out-in">
        <DialogueBox
          v-if="
            showContent &&
            (showGameUI || !gameStore.isFirstDialogueOfInitialScene) &&
            !gameStore.isMenuOpening &&
            !gameStore.isMenuOpen
          "
          :key="gameStore.currentDialogue?.id"
          ref="dialogueBoxRef"
          :dialogue="gameStore.currentDialogue"
          :is-selecting="isChoiceSelecting"
          class="pointer-events-auto"
          @animation-complete="onDialogueAnimationComplete"
        />
      </Transition>
    </div>

    <!-- Choice Buttons (bottom) -->
    <Transition name="fade">
      <ChoiceButtons
        v-if="
          (gameStore.showChoices || gameStore.selectedChoice) &&
          showGameUI &&
          !gameStore.isMenuOpening &&
          !gameStore.isMenuOpen
        "
        ref="choicesRef"
        :choices="activeChoices"
        @selecting="isChoiceSelecting = true"
        @select="handleChoiceSelect"
      />
    </Transition>

    <!-- Scene Transition Overlay -->
    <Transition name="fade">
      <div
        v-if="gameStore.isTransitioning"
        class="absolute inset-0 bg-white/50 z-30 pointer-events-none"
      />
    </Transition>

    <!-- Milestone Menu -->
    <GameMilestoneMenu />

    <!-- Game End Screen -->
    <Transition name="fade">
      <div
        v-if="gameStore.isGameEnded"
        class="absolute inset-0 flex flex-col items-center justify-center bg-[#F5E6C8] z-40"
      >
        <h1 class="font-serif text-4xl text-primary mb-8">Fin</h1>
        <p
          class="font-serif text-xl text-primary/60 mb-12 text-center max-w-md"
        >
          Merci d'avoir vecu cette experience avec Lucie.
        </p>
        <button
          class="px-8 py-4 border border-primary text-primary font-satoshi text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-colors"
          @click="gameStore.resetGame()"
        >
          Recommencer
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.4s ease;
}

.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
