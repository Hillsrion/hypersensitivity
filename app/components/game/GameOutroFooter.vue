<script setup lang="ts">
import { EDGE_SPACING } from '~/app/constants/layout'

const props = defineProps<{
  developmentCreditUrl: string
  designCreditUrl: string
}>()

const { $gsap } = useNuxtApp()
const titleRef = useTemplateRef<HTMLElement>('titleRef')
const { chars } = useSplitText(titleRef, { splitBy: 'chars,words' })
const currentYear = new Date().getFullYear()

watch(
  chars,
  (newChars) => {
    if (!newChars?.length) return

    nextTick(() => {
      const elements = [...newChars]
      const phaseTime = 0.1

      $gsap.set(elements, { autoAlpha: 0 })
      $gsap.to(elements, {
        keyframes: [
          { autoAlpha: 0.2, duration: phaseTime, ease: 'power1.out' },
          { autoAlpha: 0.8, duration: phaseTime, ease: 'power1.inOut' },
          { autoAlpha: 1, duration: phaseTime, ease: 'power1.in' },
        ],
        stagger: phaseTime,
      })
    })
  },
  { immediate: true }
)
</script>

<template>
  <section class="absolute inset-0 z-30 text-white">
    <div class="absolute inset-0 flex items-center justify-center px-4 md:px-8">
      <h2
        ref="titleRef"
        class="font-epilogue font-semibold fl-text-footer-min/footer-max leading-[1.05] text-center"
      >
        Hypersensibles
      </h2>
    </div>

    <footer class="absolute inset-x-0 bottom-0 w-full">
      <div :class="[EDGE_SPACING.PX, EDGE_SPACING.PB]">
        <div
          class="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 text-base/5 font-medium text-white"
        >
          <p class="uppercase shrink-0">{{ currentYear }} Hypersensibles</p>

          <div
            class="basis-full md:basis-auto flex flex-wrap md:justify-end gap-x-6 gap-y-2"
          >
            <p class="whitespace-normal md:whitespace-nowrap">
              Développement / Court-métrage par
              <a
                :href="props.developmentCreditUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-serif italic font-light"
              >
                Ismaël Sebbane
              </a>
            </p>
            <p class="whitespace-normal md:whitespace-nowrap">
              Design par
              <a
                :href="props.designCreditUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="font-serif italic font-light"
              >
                Anaïs Boucherie
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>
