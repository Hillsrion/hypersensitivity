<script setup lang="ts">
import { useGameStore } from "~/stores/game";

const gameStore = useGameStore();
</script>

<template>
  <header class="absolute top-10 left-1/2 -translate-x-1/2 z-40">
    <h1 class="text-primary font-serif text-xl tracking-wide">
      <span class="font-medium uppercase">JOUR {{ gameStore.currentDay }}</span>
      <span class="mx-2">-</span>
      <span class="italic font-light capitalize">{{ gameStore.currentTitle }}</span>
    </h1>
  </header>
</template>
