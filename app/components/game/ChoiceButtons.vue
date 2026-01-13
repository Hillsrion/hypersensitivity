<script setup lang="ts">
import type { Choice } from "../../types/game";
import { useGameStore } from "~/stores/game";

const props = defineProps<{
  choices: Choice[];
}>();

const emit = defineEmits<{
  select: [choice: Choice];
}>();

const gameStore = useGameStore();
</script>

<template>
  <div class="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-8">
    <button
      v-for="(choice, index) in choices"
      :key="choice.id"
      class="group relative px-8 py-4 font-satoshi text-sm tracking-widest uppercase transition-all duration-300 flex flex-col items-center"
      :class="[
        gameStore.isChoiceDisabled(choice)
          ? 'text-primary/30 cursor-not-allowed'
          : 'text-primary hover:text-primary/70',
      ]"
      :disabled="gameStore.isChoiceDisabled(choice)"
      @click="!gameStore.isChoiceDisabled(choice) && emit('select', choice)"
    >
      <!-- Contenu du bouton -->
      <span class="flex items-center gap-3">
        <!-- Cercle vide pour le premier bouton -->
        <span
          v-if="index === 0"
          class="w-2 h-2 rounded-full border border-current"
        />
        <span>{{ choice.text }}</span>
        <!-- Cercle plein pour le dernier bouton -->
        <span
          v-if="index === choices.length - 1"
          class="w-2 h-2 rounded-full bg-current"
        />
      </span>

      <!-- Raison de desactivation -->
      <span
        v-if="gameStore.isChoiceDisabled(choice) && choice.disabledReason"
        class="text-xs mt-1 text-primary/40"
      >
        {{ choice.disabledReason }}
      </span>

      <!-- Underline on hover -->
      <span
        v-if="!gameStore.isChoiceDisabled(choice)"
        class="absolute bottom-2 left-8 right-8 h-px bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      />
    </button>
  </div>
</template>
