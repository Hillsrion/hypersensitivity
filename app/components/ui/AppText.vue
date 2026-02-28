<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    /** The semantic HTML tag to render */
    as?: string
    /** The typography scale variant */
    variant?: 'body' | 'body-sm' | 'quiz' | 'label' | 'choice'
  }>(),
  {
    as: 'p',
    variant: 'body',
  }
)

const classes = computed(() => {
  return {
    'fl-text-lg/xl': props.variant === 'body',
    'fl-text-choice-min/xl': props.variant === 'choice',
    'fl-text-base/lg': props.variant === 'body-sm',
    'leading-[1.4]': props.variant === 'body-sm' || props.variant === 'label',
    'fl-text-sm/base leading-[1.5]': props.variant === 'label',
    'fl-text-xl/2xl leading-[1.75rem]': props.variant === 'quiz',
  }
})
</script>

<template>
  <component :is="as" :class="classes">
    <slot />
  </component>
</template>
