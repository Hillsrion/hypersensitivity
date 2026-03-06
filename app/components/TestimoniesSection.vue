<script setup lang="ts">
import { useTestimoniesAnimation } from '~/app/composables/ui/useTestimoniesAnimation'
import mainData from '~/app/data/main.json'

import TestimonyCard from './ui/TestimonyCard.vue'

const sectionRef = useTemplateRef<HTMLElement>('sectionRef')
const stickyRef = useTemplateRef<HTMLElement>('stickyRef')
const heroTextRef = useTemplateRef<ComponentPublicInstance>('heroTextRef')
const trackRef = useTemplateRef<HTMLElement>('trackRef')
const firstCardContentRef = ref<HTMLElement | null>(null)

const testimonies = mainData?.testimonies || []
const firstTestimony = computed(() => testimonies[0] || { content: '' })

// Function ref to capture the first card's content element reliably
const setFirstCardRef = (
  el:
    | InstanceType<typeof TestimonyCard>
    | Element
    | ComponentPublicInstance
    | null,
  index: number
) => {
  if (index === 0 && el) {
    // el is the component instance, we want the textRef element
    firstCardContentRef.value = (
      el as InstanceType<typeof TestimonyCard>
    ).textRef
  }
}

useTestimoniesAnimation(
  sectionRef,
  stickyRef,
  heroTextRef,
  trackRef,
  firstCardContentRef
)
</script>

<template>
  <section ref="sectionRef" class="relative h-[400svh]">
    <div
      ref="stickyRef"
      class="sticky top-0 h-lvh w-full overflow-hidden flex flex-col justify-center"
    >
      <!-- HERO TEXT (The big one) -->
      <div
        class="absolute inset-0 px-[7%] py-[29px] z-20 pointer-events-none flex items-center"
      >
        <AppText
          ref="heroTextRef"
          as="h2"
          variant="body"
          class="text-primary font-serif font-light origin-center opacity-0"
        >
          {{ firstTestimony.content }}
        </AppText>
      </div>

      <!-- HORIZONTAL TRACK -->
      <div
        ref="trackRef"
        class="opacity-0 flex items-center gap-6 px-[10vw] w-max h-full pointer-events-none"
      >
        <TestimonyCard
          v-for="(t, i) in testimonies"
          :key="i"
          :ref="(el) => setFirstCardRef(el, i)"
          :content="t.content"
          :author="t.author"
          :audio="t.audio"
          :color="t.color"
          class="shrink-0 w-100"
        />
      </div>
    </div>
  </section>
</template>
