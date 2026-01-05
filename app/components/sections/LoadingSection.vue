<script setup>
import circleAudiowave from "~/assets/images/circle-audiowave.svg";
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col items-center justify-center fixed inset-0 z-10"
  >
    <MainTitle title="Hypersensibles" />
    <div
      class="flex flex-col place-items-center gap-y-4 absolute left-1/2 bottom-10 -translate-x-1/2"
    >
      <p class="text-white uppercase leading-5">Cliquer pour écouter</p>
      <img :src="circleAudiowave" alt="Circle Audio Wave" class="w-18 h-18" />
    </div>
  </div>
</template>
