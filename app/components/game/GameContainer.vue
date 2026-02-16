<script setup lang="ts">
import GameHeader from "./GameHeader.vue";
import GameEnergyBar from "./GameEnergyBar.vue";
import DialogueBox from "./DialogueBox.vue";
import ChoiceButtons from "./ChoiceButtons.vue";
import GameMilestoneMenu from "./GameMilestoneMenu.vue";
import MenuIcon from "../MenuIcon.vue";
import { useGameController } from "~/app/composables/useGameController";

const { $gsap } = useNuxtApp();

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
  isMilestoneAnnotation,
  showGameUI,
  annotationText,
  showContent,
  handleInteraction,
  handleChoiceSelect,
  onDialogueAnimationComplete,
} = useGameController();

const visualProgress = ref(0);
const barTransformOrigin = ref('left');

watch(
  () => audioStore.isPlaying,
  (playing) => {
    if (playing) {
      if (barTransformOrigin.value !== 'left') {
        barTransformOrigin.value = 'left';
      }
    } else {
      // Audio stopped - trigger exit animation
      visualProgress.value = 100;
      barTransformOrigin.value = 'right';
      setTimeout(() => {
        visualProgress.value = 0;
      }, 50);
    }
  }
);

watch(audioProgressPercent, (newVal) => {
  if (audioStore.isPlaying) {
    visualProgress.value = newVal;
  }
});
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-screen overflow-hidden transition-colors duration-500"
    @click="handleInteraction"
  >
    <!-- Menu Icon (top left) -->
    <Teleport to="body">
      <Transition name="fade">
        <button
          v-if="showGameUI && !isMilestoneAnnotation"
          class="fixed top-10 left-18 z-70 text-primary cursor-pointer group"
          @click.stop="gameStore.toggleMenu()"
        >
          <MenuIcon :is-open="gameStore.isMenuOpen || gameStore.isMenuOpening" />
        </button>
      </Transition>
    </Teleport>

    <!-- Header -->
    <Transition name="fade">
      <GameHeader
        v-if="showGameUI && !gameStore.isMenuOpening && !gameStore.isMenuOpen && !isMilestoneAnnotation"
      />
    </Transition>

    <!-- Energy Bar (right side) -->
    <Transition name="fade">
      <GameEnergyBar
        v-if="(showGameUI || isMilestoneAnnotation) && !gameStore.isMenuOpening && !gameStore.isMenuOpen"
        class="absolute top-1/2 left-18 -translate-y-1/2 z-40"
      />
    </Transition>

    <!-- Intro Annotation handled by DialogueBox now -->
    <Transition
      :css="false"
      @leave="(el, done) => {
        $gsap.to(el, {
          opacity: 0,
          duration: 0.2,
          ease: 'power2.inOut',
          onComplete: done
        });
      }"
    >
      <div
        v-if="showAnnotation"
        class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-50"
      >
        <DialogueBox
          :dialogue="{
            id: 'intro-anno',
            speaker: '',
            speakerType: 'normal',
            text: '',
            annotation: annotationText,
            isChat: false
          }"
          :blur-amount="gameStore.introBlurAmount"
          class="pointer-events-auto"
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
            (showGameUI || !gameStore.isFirstDialogueOfInitialScene || isMilestoneAnnotation) &&
            !gameStore.isMenuOpening &&
            !gameStore.isMenuOpen
          "
          :key="isMilestoneAnnotation ? 'milestone-anno' : gameStore.currentDialogue?.id"
          ref="dialogueBoxRef"
          :dialogue="isMilestoneAnnotation ? {
            id: 'milestone-entry',
            speaker: '',
            speakerType: 'normal',
            text: '',
            annotation: gameStore.currentScene?.entryAnnotation || '',
            isChat: false
          } : gameStore.currentDialogue"
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
          !gameStore.isMenuOpen &&
          !isMilestoneAnnotation
        "
        ref="choicesRef"
        :choices="activeChoices"
        @selecting="isChoiceSelecting = true"
        @select="handleChoiceSelect"
      />
    </Transition>


    <!-- Milestone Menu - removed from here as it Teleports itself -->
    <!-- <GameMilestoneMenu /> -->

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
      class="fixed bottom-0 left-0 w-full h-[4px] bg-primary/10 z-50"
    >
      <div
        class="w-full h-full bg-primary transition-transform duration-500 ease-out"
        :style="{
          transform: `scaleX(${visualProgress / 100})`,
          transformOrigin: barTransformOrigin,
        }"
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
