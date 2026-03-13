<script setup lang="ts">
defineProps<{
  variant?: 'outline' | 'ghost'
}>()

const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')

defineExpose({
  $el: buttonRef,
})
</script>

<template>
  <button
    ref="buttonRef"
    class="transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    :class="[
      variant === 'ghost'
        ? 'text-white hover:text-gray-300 px-4 py-2'
        : 'bg-transparent border border-gray-600 text-gray-300 px-8 py-4 rounded-md font-sans text-xs md:text-sm st uppercase hover:bg-white hover:text-black',
    ]"
  >
    <slot />
  </button>
</template>
