<script setup lang="ts">
import { EDGE_SPACING } from '~/app/constants/layout'

type QuizSection = {
  name: string
  shortName: string
}

type SensitivityLevel = {
  label: string
  description: string
}

type Profile = {
  name: string
  description: string
  advice: string
  sections: number[]
}

const props = defineProps<{
  totalScore: number
  totalQuestions: number
  sensitivityLevel: SensitivityLevel
  sections: QuizSection[]
  sectionScores: number[]
  questionsPerSection: number
  dominantProfile: Profile | null
}>()

const emit = defineEmits<{
  (e: 'restart'): void
}>()

const { enter, leave } = useHSPResultsAnimation(props)

onMounted(() => {
  enter()
})

defineExpose({
  enter,
  leave,
})
</script>

<template>
  <div class="w-full max-w-5xl text-left mx-auto md:mt-8 mt-10">
    <!-- Top block -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-10">
      <!-- Left side: Score and Sensitivity -->
      <div ref="scoreContainerRef" class="opacity-0">
        <div class="flex flex-col items-start">
          <div class="flex items-baseline gap-1 mb-2">
            <span
              ref="totalScoreRef"
              class="2xl:text-6xl text-5xl/7 font-bold font-sans text-white tabular-nums"
              >0</span
            >
            <span class="text-gray-400 text-2xl/7 font-sans"
              >/ {{ totalQuestions * 4 }}</span
            >
          </div>
          <div
            ref="sensitivityLabelRef"
            class="text-4xl md:text-[2.5rem] font-serif font-light italic mb-6 opacity-0 text-white leading-tight"
          >
            {{ sensitivityLevel.label }}
          </div>
          <AppText as="div" variant="body">
            <p ref="sensitivityDescRef" class="text-white opacity-0 font-light">
              {{ sensitivityLevel.description }}
            </p>
          </AppText>
        </div>
      </div>

      <!-- Right side: Profile and Advice -->
      <div class="gap-4 flex flex-col justify-start pt-2 md:pt-4">
        <div
          v-if="dominantProfile"
          ref="profileCardRef"
          class="opacity-0 space-y-6"
        >
          <div>
            <h3 class="text-white text-base/7 font-sans font-medium mb-3">
              <span class="uppercase">Profil</span>
              <AppText
                as="span"
                variant="body"
                class="font-serif italic font-normal ml-1"
              >
                "{{ dominantProfile.name }}"
              </AppText>
            </h3>
            <AppText as="p" variant="body" class="text-white font-light">
              {{ dominantProfile.description }}
            </AppText>
          </div>
          <div>
            <h3
              class="text-white text-base/7 font-sans font-medium uppercase mb-3"
            >
              Conseil
            </h3>
            <AppText as="p" variant="body" class="text-white font-light">
              {{ dominantProfile.advice }}
            </AppText>
          </div>
        </div>

        <div
          v-if="(sectionScores?.[7] ?? 0) > questionsPerSection * 4 * 0.75"
          ref="alertCardRef"
          class="opacity-0"
        >
          <h4 class="text-white text-sm font-sans font-medium uppercase mb-3">
            Indicateur de sur-adaptation
          </h4>
          <p class="text-white font-sans text-sm">
            Votre score en Section VIII (Adaptation sociale) est supérieur à
            {{ questionsPerSection * 4 * 0.75 }}/{{ questionsPerSection * 4 }}.
            Cela suggère que vous êtes actuellement en sur-adaptation et
            dépensez beaucoup d'énergie à « faire comme tout le monde ».
          </p>
        </div>
      </div>
    </div>

    <!-- Middle block: Scores par section -->
    <div class="mb-10">
      <h3
        ref="sectionsTitleRef"
        class="text-white text-base/7 font-sans font-medium uppercase mb-4 opacity-0"
      >
        Scores par section
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-22 gap-y-6 md:gap-y-2">
        <div
          v-for="(section, index) in sections"
          :key="index"
          ref="sectionItemsRef"
          class="opacity-0 flex flex-col group"
        >
          <AppText
            as="span"
            variant="label"
            class="text-gray-200 font-serif italic"
          >
            {{ section.shortName }}
          </AppText>
          <div class="flex items-center gap-4">
            <div class="h-1 bg-white/20 w-full relative flex-1 rounded-full">
              <div
                ref="sectionBarsRef"
                class="h-full bg-white absolute left-0 top-0 rounded-full"
                :style="{
                  width: '0%',
                }"
                :data-width="
                  ((sectionScores?.[index] ?? 0) / (questionsPerSection * 4)) *
                    100 +
                  '%'
                "
              />
            </div>
            <AppText
              as="span"
              variant="label"
              class="text-white font-sans font-semibold whitespace-nowrap tabular-nums"
            >
              <span ref="sectionScoreCountersRef">0</span>/{{
                questionsPerSection * 4
              }}
            </AppText>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom block: Restart button -->
    <div class="flex justify-center" :class="EDGE_SPACING.PB">
      <HSPButton ref="restartBtnRef" class="opacity-0" @click="emit('restart')">
        Recommencer le questionnaire
      </HSPButton>
    </div>
  </div>
</template>
