<script setup lang="ts">
import GameHeader from "./GameHeader.vue";
import GameEnergyBar from "./GameEnergyBar.vue";
import DialogueBox from "./DialogueBox.vue";
import ChoiceButtons from "./ChoiceButtons.vue";
import GameMilestoneMenu from "./GameMilestoneMenu.vue";
import MenuIcon from "../MenuIcon.vue";
import IntroAnnotation from "./IntroAnnotation.vue";
import { useGameController } from "~/app/composables/useGameController";

const containerRef = ref<HTMLElement | null>(null);

const {
  gameStore,
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
  onDialogueAnimationComplete,
} = useGameController();
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
            !showAnnotation &&
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
          Merci d'avoir vécu cette expérience avec Lucie.
        </p>
        <button
          class="px-8 py-4 border border-primary text-primary font-satoshi text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-colors"
          @click="gameStore.resetGame()"
        >
          Recommencer
        </button>
      </div>
    </Transition>

    <!-- Fixed Progress Bar -->
    <div
      v-if="(showGameUI || audioStore.isPlaying) && !gameStore.isMenuOpening && !gameStore.isMenuOpen"
      class="fixed bottom-0 left-0 w-full h-[4px] bg-white/10 z-50"
    >
      <div
        class="h-full bg-white transition-all duration-500 ease-out"
        :style="{ width: audioProgressPercent + '%' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
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
