<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'ghost'
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
        : 'bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200',
    ]"
  >
    <slot />
  </button>
</template>
