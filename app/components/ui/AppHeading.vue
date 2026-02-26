<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** The semantic HTML tag to render (e.g., h1, h2, span) */
    as?: string
    /** The typography scale variant */
    variant?: 'h1' | 'display'
  }>(),
  {
    as: 'h1',
    variant: 'h1',
  }
)

const classes = computed(() => {
  return {
    'fl-text-h1-min/h1-max leading-[1.1]': props.variant === 'h1',
    'fl-text-display-min/display-max leading-[1.15]':
      props.variant === 'display',
  }
})
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
