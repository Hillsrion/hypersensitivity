<script setup lang="ts">
import type { Choice } from "../../types/game";
import { useGameStore } from "~/stores/game";

const props = defineProps<{
  choices: Choice[];
}>();

const emit = defineEmits<{
  select: [choice: Choice];
  selecting: [];
}>();

const { $gsap } = useNuxtApp();
const gameStore = useGameStore();

const hoveredIndex = ref<number | null>(null);
const isSelecting = ref(false);
const selectedIndex = ref<number | null>(null);

const iconRef = ref<HTMLElement | null>(null);
const buttonRefs = ref<HTMLElement[]>([]);

const handleSelect = async (choice: Choice, index: number) => {
  if (gameStore.isChoiceDisabled(choice) || isSelecting.value) return;

  isSelecting.value = true;
  selectedIndex.value = index;
  emit("selecting");

  const tl = $gsap.timeline({
    onComplete: () => {
      emit("select", choice);
    },
  });

  // Fade out icon and non-selected choice
  const elementsToFade = [
    iconRef.value,
    ...buttonRefs.value.filter((_, i) => i !== index),
  ];

  tl.to(elementsToFade, {
    opacity: 0,
    duration: 0.4,
    ease: "power2.inOut",
  });

  // Move selected choice to center horizontal
  const selectedBtn = buttonRefs.value[index];
  if (selectedBtn) {
    const rect = selectedBtn.getBoundingClientRect();
    const centerX = window.innerWidth / 2;
    const btnCenterX = rect.left + rect.width / 2;
    const xMove = centerX - btnCenterX;

    tl.to(
      selectedBtn,
      {
        x: xMove,
        duration: 0.6,
        ease: "power3.inOut",
      },
      "<"
    );
  }
};
</script>

<template>
  <div
    class="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6"
  >
    <template v-for="(choice, index) in choices" :key="choice.id">
      <!-- CHOICE BUTTON -->
      <button
        :ref="(el) => { if (el) buttonRefs[index] = el as HTMLElement }"
        class="group relative py-4 font-satoshi font-semibold text-xl/7 uppercase transition-all duration-300 flex flex-col items-center"
        :class="[
          gameStore.isChoiceDisabled(choice)
            ? 'text-primary/30 cursor-not-allowed'
            : 'text-primary',
          !isSelecting && hoveredIndex !== null && hoveredIndex !== index
            ? 'opacity-20'
            : 'opacity-100',
        ]"
        :disabled="gameStore.isChoiceDisabled(choice) || isSelecting"
        @mouseenter="hoveredIndex = index"
        @mouseleave="hoveredIndex = null"
        @click="handleSelect(choice, index)"
      >
        <span class="flex items-center gap-3">
          <span>{{ choice.text }}</span>
        </span>

        <!-- Raison de desactivation -->
        <span
          v-if="gameStore.isChoiceDisabled(choice) && choice.disabledReason"
          class="text-xs mt-1 text-primary/40 absolute top-full"
        >
          {{ choice.disabledReason }}
        </span>
      </button>

      <!-- CENTRAL ICON (Inserted between first and second choice) -->
      <div
        v-if="index === 0 && choices.length > 1"
        ref="iconRef"
        class="relative w-14 h-14 rounded-full border border-primary flex items-center justify-center transition-opacity duration-300"
        :class="[
          !isSelecting && hoveredIndex !== null ? 'opacity-20' : 'opacity-100',
        ]"
      >
        <div class="transform -rotate-20">
          <svg
            width="32"
            height="42"
            viewBox="0 0 32 42"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.6247 16.1961L27.1646 25.9219C28.861 30.5828 26.4464 35.7609 21.7856 37.4574C17.1247 39.1538 11.9466 36.7392 10.2501 32.0783L6.71024 22.3525L23.6247 16.1961ZM24.2224 14.9144L5.42853 21.7548L9.31046 32.4203C11.1984 37.6074 16.9405 40.285 22.1276 38.3971C27.3147 36.5091 29.9923 30.767 28.1043 25.5799L24.2224 14.9144Z"
              fill="#0B1018"
            />
            <path
              d="M5.18404 19.619L3.88095 16.0387C2.25635 11.5752 4.22331 6.57064 8.37741 4.38824L12.8989 16.811L5.18404 19.619Z"
              fill="#0B1018"
            />
            <path
              d="M8.10918 5.11341L12.2579 16.5119L5.4827 18.9779L4.35061 15.8675C2.87992 11.8268 4.52494 7.31188 8.10918 5.11341ZM8.65555 3.69075C3.94696 5.84085 1.61189 11.2667 3.41092 16.2095L4.88502 20.2596L13.5396 17.1096L8.65555 3.69075Z"
              fill="#0B1018"
            />
            <path
              d="M11.4732 3.88797C15.632 3.26819 19.7943 5.66942 21.265 9.7101L22.3971 12.8205L15.6219 15.2864L11.4732 3.88797ZM10.1402 3.14935L15.0242 16.5682L23.6788 13.4182L22.2047 9.36808C20.4057 4.42529 15.1292 1.7698 10.1402 3.14935Z"
              fill="#0B1018"
            />
          </svg>
        </div>
      </div>
    </template>
  </div>
</template>
