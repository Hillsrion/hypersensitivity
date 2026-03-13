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

// Set initial hidden state immediately at mount to prevent flash
onMounted(() => {
  if (labelRef.value) {
    $gsap.set(labelRef.value, { opacity: 0, y: 20 })
  }
})

defineExpose({
  dotRef,
  labelRef,
})
</script>

<template>
  <div
    class="relative flex-none w-[280px] lg:w-[25vw] -mr-[140px] lg:mr-0 flex flex-col shrink-0"
  >
    <!-- Milestone Point Container -->
    <button
      class="absolute left-1/2 top-1/2 -translate-x-2 -translate-y-2 origin-left -rotate-45"
      :class="{
        'opacity-50 cursor-not-allowed': !isReached,
        'cursor-pointer': isReached,
      }"
      @click="$emit('click', milestone.id)"
    >
      <!-- Title -->
      <AppText as="div" variant="body" class="flex items-center">
        <!-- Dot -->
        <div
          ref="dotRef"
          class="size-4 rounded-full border border-primary transition-all duration-500"
          :class="isReached ? 'bg-white' : 'bg-primary/20 scale-75'"
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
