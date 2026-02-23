<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** The semantic HTML tag to render */
    as?: string
    /** The typography scale variant */
    variant?: 'body' | 'quiz' | 'label'
  }>(),
  {
    as: 'p',
    variant: 'body',
  }
)

const classes = computed(() => {
  return {
    'fl-text-lg/xl leading-[1.4]': props.variant === 'body',
    'fl-text-xl/2xl leading-[1.75rem]': props.variant === 'quiz',
    'fl-text-sm/base leading-[1.5]': props.variant === 'label',
  }
})
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
