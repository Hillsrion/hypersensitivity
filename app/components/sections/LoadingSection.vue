<script setup>
import circleAudiowave from "~/assets/images/circle-audiowave.svg";

const { $gsap } = useNuxtApp();
const bottomElementRef = ref(null);

const onTitleEntryComplete = () => {
  if (bottomElementRef.value) {
    $gsap.to(bottomElementRef.value, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  }
};
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0 z-10 bg-[linear-gradient(to_bottom,_#242124_0%,_#1c2032_33%,_#2b3e5f_66%,_#627ea4_100%)]"
  >
    <MainTitle title="Hypersensibles" @entry-complete="onTitleEntryComplete" />
    <div
      ref="bottomElementRef"
      class="flex flex-col place-items-center gap-y-4 absolute left-1/2 bottom-10 -translate-x-1/2 opacity-0"
    >
      <p class="text-white uppercase leading-5">Cliquer pour écouter</p>
      <img :src="circleAudiowave" alt="Circle Audio Wave" class="w-18 h-18" />
    </div>
  </div>
</template>
