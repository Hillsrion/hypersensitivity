<script setup lang="ts">
import { useGameStore } from "~/stores/game";

defineProps<{
  text: string;
  blurAmount: number;
}>();
</script>

<template>
  <div class="flex items-center justify-center p-8">
    <p
      class="font-serif text-primary/60 text-xl/7 text-center transition-all duration-300 transform-gpu will-change-[filter,opacity]"
      :style="{ filter: `blur(${blurAmount}px)`, opacity: blurAmount > 6 ? 0.7 : 1 }"
    >
      {{ text }}
    </p>
  </div>
</template>
