<script setup lang="ts">
import { EDGE_SPACING } from '~/app/constants/layout'

const props = defineProps<{
  developmentCreditUrl: string
  designCreditUrl: string
}>()

const titleRef = useTemplateRef<HTMLElement>('titleRef')
const { chars } = useSplitText(titleRef, { splitBy: 'chars,words' })
const currentYear = new Date().getFullYear()
const rootClasses = 'relative flex-1 w-full text-white'

useTextWaveAnimation(
  computed(() => chars.value as HTMLElement[]),
  { immediate: true, skipIntroOverride: false }
)
</script>

<template>
  <section :class="rootClasses">
    <div class="flex items-center justify-center px-4 md:px-8 h-full">
      <h2
        ref="titleRef"
        class="font-epilogue font-semibold fl-text-footer-min/footer-max leading-[1.05] text-center"
      >
        Hypersensibles
      </h2>
    </div>

    <footer class="absolute left-0 w-full" :class="EDGE_SPACING.BOTTOM">
      <div>
        <div
          class="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 text-base/5 font-medium text-white"
        >
          <p class="uppercase shrink-0">© {{ currentYear }} Hypersensibles</p>

          <div
            class="basis-full md:basis-auto flex flex-wrap md:justify-end fl-gap-x-8/12 gap-y-2"
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
