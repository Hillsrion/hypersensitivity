<script setup lang="ts">
defineProps<{
  isOpen?: boolean
}>()
</script>

<template>
  <div 
    class="relative w-8 h-8 flex flex-col justify-center items-center gap-2 transition-transform duration-500 ease-out"
    :class="isOpen ? 'rotate-90' : 'group-hover:rotate-90'"
  >
    <!-- Parallel lines (Menu) -->
    <span
      class="w-6 h-0.5 bg-current transition-transform duration-500 origin-center"
      :class="isOpen ? 'scale-x-0 delay-0' : 'scale-x-100 delay-500'"
    />
    <span
      class="w-6 h-0.5 bg-current transition-transform duration-500 origin-center"
      :class="isOpen ? 'scale-x-0 delay-0' : 'scale-x-100 delay-500'"
    />

    <!-- Cross lines (Close) - Only visible when open -->
    <!-- First line of cross (starts near top-left, goes to bottom-right) -->
    <span
      class="absolute top-1 w-0.5 bg-current origin-top -rotate-45 transition-transform duration-500 ease-out"
      :class="isOpen ? 'scale-y-100 delay-200' : 'scale-y-0 delay-0'"
      style="height: 2.125rem; left: 0.1875rem; transform-origin: top center;" 
    />
    
    <!-- Second line of cross (starts near top-right, goes to bottom-left) -->
    <span
      class="absolute top-1 w-0.5 bg-current origin-top rotate-45 transition-transform duration-500 ease-out"
      :class="isOpen ? 'scale-y-100 delay-200' : 'scale-y-0 delay-0'"
      style="height: 2.125rem; right: 0.1875rem; transform-origin: top center;"
    />
  </div>
</template>
