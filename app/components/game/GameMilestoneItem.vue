<script setup lang="ts">
interface Props {
  milestone: {
    id: string;
    day: number;
    label: string;
  };
  isReached: boolean;
}

defineProps<Props>();
defineEmits<{
  (e: "click", milestoneId: string): void;
}>();
</script>

<template>
  <div class="relative flex-none w-[25vw] min-w-[300px] flex flex-col items-center shrink-0">
    <!-- Milestone Point Container -->
    <button 
      @click="$emit('click', milestone.id)"
      class="origin-bottom-left -rotate-45"
      :class="{ 'opacity-50 cursor-not-allowed': !isReached, 'cursor-pointer': isReached }"
    >
      <!-- Title -->
      <div class="whitespace-nowrap text-xl/7 flex items-center">
        <!-- Dot -->
        <div
          class="size-4 rounded-full border border-primary transition-all duration-500"
          :class="isReached ? 'bg-white' : 'bg-primary/20 scale-75'"
        />
        <div
          class="font-satoshi pl-4 transition-all duration-300 text-primary group-hover:text-primary/70"
        >
          <span class="uppercase mr-1 font-medium">JOUR {{ milestone.day }}</span>
          <span class="mx-1 font-serif">-</span>
          <span class="font-serif">{{ milestone.label }}</span>
        </div>
      </div>
    </button>
  </div>
</template>
