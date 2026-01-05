<script setup>
import circleAudiowave from "~/assets/images/circle-audiowave.svg";
</script>

<template>
  <div class="h-screen w-screen flex flex-col items-center justify-between">
    <MainTitle title="Hypersensitivity" />
    <div class="flex flex-col items-center justify-center gap-y-4">
      <p class="text-white uppercase">Cliquer pour écouter</p>
      <img :src="circleAudiowave" alt="Circle Audio Wave" class="w-10 h-10" />
    </div>
  </div>
</template>
