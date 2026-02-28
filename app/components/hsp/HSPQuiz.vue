<script setup lang="ts">
import { EDGE_SPACING } from '~/app/constants/layout'

type QuizSection = {
  name: string
  shortName: string
}

type QuizQuestion = {
  text: string
  inversed: boolean
}

type QuizRating = {
  value: number
  label: string
  inversedLabel: string
}

const props = defineProps<{
  sections: QuizSection[]
  currentQuestion: QuizQuestion
  currentQuestionIndex: number
  totalQuestions: number
  ratings: QuizRating[]
  currentAnswer: number | null
  currentSectionIndex: number
  displaySectionName: string
  progressPercent: number
  isLastQuestion: boolean
  questions: QuizQuestion[]
}>()

const emit = defineEmits<{
  (event: 'selectAnswer', value: number): void
  (event: 'next' | 'previous'): void
}>()

const {
  isAnimating,
  internalDisplaySectionName,
  sectionNameRef,
  headerRef,
  progressBarRef,
  questionInfoRef,
  questionTextRef,
  answersRef,
  navRef,
  onPrevious,
  onNext,
  enter,
  leave,
} = useHSPQuizAnimation(props, emit)

onMounted(() => {
  enter()
})

defineExpose({
  enter,
  leave,
})

const getRatingClass = (value: number) => {
  const isSelected = props.currentAnswer === value
  return {
    'bg-white text-black border-white': isSelected,
    'text-white border-white/60 hover:bg-white/10 focus:bg-white/10':
      !isSelected,
  }
}
</script>

<template>
  <div
    class="w-full max-w-4xl lg:pt-24 md:pt-18 sm:pt-14 pt-10 flex flex-col flex-1"
  >
    <!-- Fixed Header -->
    <nav
      ref="headerRef"
      class="fixed left-0 w-full flex justify-between items-center z-50 opacity-0"
      :class="[EDGE_SPACING.TOP, EDGE_SPACING.PX]"
    >
      <div class="flex items-center">
        <span class="font-sans font-medium text-base leading-[28px] uppercase"
          >Section {{ currentSectionIndex + 1 }}</span
        >
        <span class="mx-2">-</span>
        <AppText as="span" variant="label" class="inline-block">
          <span ref="sectionNameRef" class="font-serif text-white inline-block">
            {{ internalDisplaySectionName }}
          </span>
        </AppText>
      </div>
    </nav>

    <!-- Fixed Progress Bar -->
    <div
      ref="progressBarRef"
      class="fixed bottom-0 left-0 w-full h-[4px] bg-white/10 z-50 translate-y-full"
    >
      <div
        class="h-full bg-white transition-all duration-500 ease-out"
        :style="{ width: progressPercent + '%' }"
      />
    </div>

    <!-- Central Content -->
    <div class="flex-1 flex flex-col justify-center">
      <!-- Question -->
      <div class="min-h-36 flex flex-col justify-center mb-8">
        <div
          ref="questionInfoRef"
          class="flex items-center h-16 gap-x-4 opacity-0"
        >
          <AppText
            as="p"
            variant="body"
            class="font-sans font-medium text-white uppercase"
          >
            Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}
          </AppText>
          <div
            v-if="currentQuestion.inversed"
            class="bg-white text-primary px-4 py-2 rounded-full text-xl font-medium"
          >
            Inversed
          </div>
        </div>
        <AppText as="div" variant="quiz">
          <p
            ref="questionTextRef"
            class="leading-snug text-white font-serif italic opacity-0"
          >
            {{ currentQuestion.text }}
          </p>
        </AppText>
      </div>

      <!-- Answers -->
      <div
        ref="answersRef"
        class="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-6 opacity-0"
      >
        <button
          v-for="rating in ratings"
          :key="rating.value"
          class="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-[10px] border transition-all duration-200 hover:scale-105"
          :class="getRatingClass(rating.value)"
          @click="emit('selectAnswer', rating.value)"
        >
          <AppText
            as="span"
            variant="quiz"
            class="font-black mb-2 group-hover:text-current transition-colors"
          >
            {{ rating.value }}
          </AppText>
          <AppText
            as="span"
            variant="label"
            class="text-center transition-opacity"
          >
            {{ currentQuestion.inversed ? rating.inversedLabel : rating.label }}
          </AppText>
        </button>
      </div>
    </div>

    <!-- Navigation -->
    <div
      ref="navRef"
      class="flex justify-between items-center opacity-0 mt-auto"
      :class="EDGE_SPACING.PB"
    >
      <button
        class="text-white transition-colors duration-300 flex items-center gap-2 px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
        :disabled="currentQuestionIndex === 0 || isAnimating"
        @click="onPrevious"
      >
        ← Previous
      </button>
      <button
        class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
        :disabled="currentAnswer === null || isAnimating"
        @click="onNext"
      >
        {{ isLastQuestion ? 'See results' : 'Next' }}
        <span v-if="!isLastQuestion">→</span>
      </button>
    </div>
  </div>
</template>
