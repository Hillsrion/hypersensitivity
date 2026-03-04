<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'

import { useWindowSize } from '@vueuse/core'

interface Props {
  title: string
  shortTitle?: string
  content: string[]
  color: string
}

const props = defineProps<Props>()

const containerRef = useTemplateRef<HTMLElement>('containerRef')
const titleWrapperRef = useTemplateRef<HTMLElement>('titleWrapperRef')
const contentRef = useTemplateRef<HTMLElement>('contentRef')
// We will have one "main" title and duplicates.
// Let's create an array for the titles to animate.
const titlesRef =
  useTemplateRef<Array<HTMLElement | ComponentPublicInstance>>('titlesRef')

const { isCompact } = useGenericSectionAnimation(
  () => props.color,
  containerRef,
  titleWrapperRef,
  contentRef,
  titlesRef
)

// Dynamically compute the number of titles based on window width to reduce DOM nodes on mobile
const { width } = useWindowSize()
const numTitles = computed(() => {
  if (import.meta.server) return 9 // Default for SSR
  return width.value < 768 ? 5 : 9
})
</script>

<template>
  <section
    ref="containerRef"
    class="h-[600svh] w-full relative overflow-hidden flex flex-col items-center justify-start z-10 will-change-[opacity,visibility]"
  >
    <!-- Title Wrapper: Holds the stack of titles -->

    <div
      ref="titleWrapperRef"
      class="relative w-full grid place-items-center z-10 px-4 md:px-0"
    >
      <AppHeading
        v-for="i in numTitles"
        :key="i"
        ref="titlesRef"
        as="p"
        variant="display"
        class="col-start-1 row-start-1 w-full font-serif font-light text-center origin-top select-none text-primary will-change-transform"
        :class="{
          'z-10': i === 1,
          'z-20': i > 1,
          'leading-[1.13]': numTitles === 9 ? i < 3 : i < 2,
          'leading-[1.2]': numTitles === 9 ? i >= 3 && i < 5 : i >= 2 && i < 3,
          'leading-[1.28]': numTitles === 9 ? i >= 5 : i >= 3,
        }"
        aria-hidden="true"
      >
        <span
          class="bg-white max-w-7xl mx-auto py-[0.2em] px-[0.2em] [box-decoration-break:clone]"
        >
          <span :class="{ 'hidden md:inline': shortTitle }">{{ title }}</span>
          <span v-if="shortTitle" class="md:hidden">{{ shortTitle }}</span>
        </span>
      </AppHeading>

      <span class="sr-only">{{ title }}</span>
    </div>

    <!-- Content Paragraphs -->
    <div
      ref="contentRef"
      class="absolute top-0 w-full max-w-lg px-6 z-30 will-change-transform"
    >
      <ul class="flex flex-col gap-y-4 min-[390px]:gap-y-6">
        <li
          v-for="(item, index) in content"
          :key="index"
          class="opacity-0 will-change-[transform,opacity]"
        >
          <!-- Start hidden for GSAP to control -->

          <AppText
            as="p"
            :variant="isCompact ? 'body-sm' : 'body'"
            class="text-primary/60 font-sans font-light"
          >
            {{ item }}
          </AppText>
        </li>
      </ul>
    </div>
  </section>
</template>
