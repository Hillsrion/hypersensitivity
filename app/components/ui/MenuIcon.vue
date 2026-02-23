<script setup lang="ts">
defineProps<{
  isOpen?: boolean
}>()
</script>

<template>
  <div
    class="relative w-7 h-7 sm:w-8 sm:h-8 flex flex-col justify-center items-center gap-1.5 sm:gap-2 transition-transform duration-500 ease-out"
    :class="isOpen ? 'rotate-90' : 'group-hover:rotate-90'"
  >
    <!-- Parallel lines (Menu) -->
    <span
      class="w-5 sm:w-6 h-0.5 bg-current transition-transform duration-500 origin-center"
      :class="isOpen ? 'scale-x-0 delay-0' : 'scale-x-100 delay-500'"
    />
    <span
      class="w-5 sm:w-6 h-0.5 bg-current transition-transform duration-500 origin-center"
      :class="isOpen ? 'scale-x-0 delay-0' : 'scale-x-100 delay-500'"
    />

    <!-- Cross lines (Close) - Only visible when open -->
    <!-- First line of cross (starts near top-left, goes to bottom-right) -->
    <span
      class="absolute top-1 w-0.5 bg-current origin-top -rotate-45 transition-transform duration-500 ease-out h-7.5 left-[0.145rem] sm:h-8.5 sm:left-0.75"
      :class="isOpen ? 'scale-y-100 delay-200' : 'scale-y-0 delay-0'"
      style="transform-origin: top center"
    />

    <!-- Second line of cross (starts near top-right, goes to bottom-left) -->
    <span
      class="absolute top-1 w-0.5 bg-current origin-top rotate-45 transition-transform duration-500 ease-out h-7.5 right-[0.145rem] sm:h-8.5 sm:right-0.75"
      :class="isOpen ? 'scale-y-100 delay-200' : 'scale-y-0 delay-0'"
      style="transform-origin: top center"
    />
  </div>
</template>
