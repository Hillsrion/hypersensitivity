<script setup lang="ts">
defineProps<{
  isOpen?: boolean
}>()
</script>

<template>
  <div 
    class="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 transition-transform duration-500 ease-out"
    :class="{ 'rotate-90': isOpen }"
  >
    <!-- Parallel lines (Menu) -->
    <span
      class="w-6 h-0.5 bg-current transition-all duration-300"
    ></span>
    <span
      class="w-6 h-0.5 bg-current transition-all duration-300"
    ></span>

    <!-- Cross lines (Close) - Only visible when open -->
    <!-- First line of cross -->
    <span
      class="absolute top-1/2 left-1/2 w-0.5 h-6 bg-current origin-center"
      :class="isOpen ? 'scale-y-100' : 'scale-y-0 opacity-0'"
      style="transform: translate(-50%, -50%) rotate(45deg); transition: transform 0.4s ease-out, opacity 0.2s;"
    ></span>
    
    <!-- Second line of cross -->
    <span
      class="absolute top-1/2 left-1/2 w-0.5 h-6 bg-current origin-center"
      :class="isOpen ? 'scale-y-100' : 'scale-y-0 opacity-0'"
      style="transform: translate(-50%, -50%) rotate(-45deg); transition: transform 0.4s ease-out 0.1s, opacity 0.2s;"
    ></span>
  </div>
</template>
