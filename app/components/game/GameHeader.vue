<script setup lang="ts">
import { EDGE_SPACING } from '~/app/constants/layout'
import { UI_SIZES } from '~/app/constants/ui'

const gameStore = useGameStore()
const { $gsap } = useNuxtApp()

const titleRef = useTemplateRef<HTMLElement>('titleRef')
const displayTitle = ref(gameStore.currentTitle)

watch(
  () => gameStore.currentTitle,
  (newTitle) => {
    if (!titleRef.value) {
      displayTitle.value = newTitle
      return
    }

    const tl = $gsap.timeline()

    tl.to(titleRef.value, {
      opacity: 0,
      filter: 'blur(12px)',
      duration: 0.4,
      ease: 'power2.inOut',
      onComplete: () => {
        displayTitle.value = newTitle
      },
    })

    tl.to(titleRef.value, {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.4,
      ease: 'power2.out',
    })
  }
)
</script>

<template>
  <header
    class="absolute left-1/2 -translate-x-1/2 z-40 flex items-center justify-center"
    :class="[EDGE_SPACING.TOP, UI_SIZES.TOP_HEADER]"
  >
    <h1 class="text-primary font-serif fl-text-sm/xl">
      <span class="font-medium font-sans uppercase"
        >JOUR {{ gameStore.currentDay }}</span
      >
      <span class="mx-2">-</span>
      <span ref="titleRef" class="italic font-light capitalize">
        {{ displayTitle }}
      </span>
    </h1>
  </header>
</template>
