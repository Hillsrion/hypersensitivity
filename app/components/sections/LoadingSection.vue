<script setup>
import circleAudiowave from "~/assets/images/circle-audiowave.svg";
import { useAnimationsStore } from "~/stores/animations";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const bottomElement = useTemplateRef("bottomElement");

const onTitleEntryComplete = () => {
  animationsStore.onTitleEntryComplete();
  if (bottomElement.value) {
    $gsap.to(bottomElement.value, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  }
};
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0 z-10 bg-[linear-gradient(to_bottom,var(--color-bg-gradient-start)_0%,var(--color-bg-gradient-third)_33%,var(--color-bg-gradient-two-thirds)_66%,var(--color-bg-gradient-end)_100%)]"
  >
    <MainTitle title="Hypersensibles" @entry-complete="onTitleEntryComplete" />
    <div
      ref="bottomElement"
      class="flex flex-col place-items-center gap-y-4 absolute left-1/2 bottom-10 -translate-x-1/2 opacity-0"
    >
      <p class="text-white uppercase leading-5">Cliquer pour écouter</p>
      <img :src="circleAudiowave" alt="Circle Audio Wave" class="w-18 h-18" />
    </div>
  </div>
</template>
