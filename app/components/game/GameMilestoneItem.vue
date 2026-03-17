<script setup lang="ts">
type Props = {
  milestone: {
    id: string
    day: number
    label: string
  }
  isReached: boolean
}

defineProps<Props>()
defineEmits<{
  (e: 'click', milestoneId: string): void
}>()

const dotRef = useTemplateRef<HTMLElement>('dotRef')
const labelRef = useTemplateRef<HTMLElement>('labelRef')

const { $gsap } = useNuxtApp()

defineExpose({
  dotRef,
  labelRef,
})
</script>

<template>
  <div
    class="relative h-full flex-none w-[140px] lg:w-[25vw] flex flex-col shrink-0 overflow-visible"
  >
    <div
      class="absolute top-1/2 h-px bg-primary/10 pointer-events-none left-0"
      :class="isReached ? 'w-[calc(50%-8px)]' : 'w-1/2'"
    />
    <div
      class="absolute top-1/2 h-px bg-primary/10 pointer-events-none right-0"
      :class="isReached ? 'w-[calc(50%-8px)]' : 'w-1/2'"
    />
    <button
      class="absolute left-1/2 top-1/2 -translate-x-2 -translate-y-1/2 origin-left -rotate-45"
      style="transform-origin: 8px 50%"
      :class="isReached ? 'cursor-pointer' : 'pointer-events-none opacity-0'"
      @click="$emit('click', milestone.id)"
    >
      <!-- Title -->
      <AppText as="div" variant="body" class="flex items-center">
        <!-- Dot -->
        <div
          ref="dotRef"
          class="size-4 rounded-full border border-primary bg-transparent transition-all duration-500"
        />
        <div
          ref="labelRef"
          class="font-sans pl-4 transition-colors duration-300 text-primary group-hover:text-primary/70 leading-tight whitespace-nowrap"
        >
          <span class="uppercase mr-1 font-medium tabular-nums"
            >JOUR {{ milestone.day }}</span
          >
          <span class="mx-1 font-serif">-</span>
          <span class="font-serif">{{ milestone.label }}</span>
        </div>
      </AppText>
    </button>
  </div>
</template>
