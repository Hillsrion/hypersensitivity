<script setup lang="ts">
const buttonRef = useTemplateRef<HTMLButtonElement>('buttonRef')

defineExpose({
  $el: buttonRef,
})
</script>

<template>
  <button
    ref="buttonRef"
    class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    <slot />
  </button>
</template>
