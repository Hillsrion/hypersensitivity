<script setup lang="ts">
import { useGameStore } from "~/stores/game";

const gameStore = useGameStore();
const { $gsap } = useNuxtApp();

const titleRef = ref<HTMLElement | null>(null);
const displayTitle = ref(gameStore.currentTitle);

watch(
  () => gameStore.currentTitle,
  (newTitle) => {
    if (!titleRef.value) {
      displayTitle.value = newTitle;
      return;
    }

    const tl = $gsap.timeline();

    tl.to(titleRef.value, {
      opacity: 0,
      filter: "blur(12px)",
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        displayTitle.value = newTitle;
      },
    });

    tl.to(titleRef.value, {
      opacity: 1,
      filter: "blur(0px)",
      duration: 0.4,
      ease: "power2.out",
    });
  }
);
</script>

<template>
  <header class="absolute top-10 left-1/2 -translate-x-1/2 z-40">
    <h1 class="text-primary font-serif text-xl tracking-wide whitespace-nowrap">
      <span class="font-medium uppercase">JOUR {{ gameStore.currentDay }}</span>
      <span class="mx-2">-</span>
      <span
        ref="titleRef"
        class="italic font-light capitalize inline-block"
      >
        {{ displayTitle }}
      </span>
    </h1>
  </header>
</template>
