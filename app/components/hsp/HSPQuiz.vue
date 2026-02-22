<script setup>
const props = defineProps({
  sections: {
    type: Array,
    required: true
  },
  currentQuestion: {
    type: Object,
    required: true
  },
  currentQuestionIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  ratings: {
    type: Array,
    required: true
  },
  currentAnswer: {
    type: [Number, null],
    required: true
  },
  currentSectionIndex: {
    type: Number,
    required: true
  },
  displaySectionName: {
    type: String,
    required: true
  },
  progressPercent: {
    type: Number,
    required: true
  },
  isLastQuestion: {
    type: Boolean,
    required: true
  },
  questions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['selectAnswer', 'next', 'previous']);

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
  leave
} = useHSPQuizAnimation(props, emit);

onMounted(() => {
  enter();
});

defineExpose({
    enter,
    leave
});

const getRatingClass = (value) => {
  const isSelected = props.currentAnswer === value;
  return {
    'bg-white text-black border-white': isSelected,
    'text-white border-white/60 hover:bg-white/10 focus:bg-white/10': !isSelected
  };
};
</script>

<template>
  <div class="w-full max-w-4xl lg:pt-24 md:pt-18 sm:pt-14 pt-10 flex flex-col flex-1">
    <!-- Fixed Header -->
    <nav ref="headerRef" class="fixed top-0 left-0 w-full flex justify-between items-center px-4 lg:px-8 md:px-16 py-13 z-50 opacity-0">
      <div class="flex items-center">
        <span class="font-sans font-medium text-base leading-[28px] uppercase">Section {{ currentSectionIndex + 1 }}</span>
        <span class="mx-2">-</span>
        <span
          ref="sectionNameRef"
          class="font-serif text-base leading-[28px] text-white inline-block"
        >
          {{ internalDisplaySectionName }}
        </span>
      </div>
    </nav>

    <!-- Fixed Progress Bar -->
    <div ref="progressBarRef" class="fixed bottom-0 left-0 w-full h-[4px] bg-white/10 z-50 translate-y-full">
      <div class="h-full bg-white transition-all duration-500 ease-out" :style="{ width: progressPercent + '%' }"></div>
    </div>
    
    <!-- Central Content -->
    <div class="flex-1 flex flex-col justify-center">
      <!-- Question -->
      <div class="min-h-36 flex flex-col justify-center mb-8">
        <div ref="questionInfoRef" class="flex items-center h-16 gap-x-4 opacity-0">
          <p class="font-sans font-medium text-white uppercase sm:text-xl/7 text-lg/7">Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>
          <div v-if="currentQuestion.inversed" class="bg-white text-primary px-4 py-2 rounded-full text-xl font-medium">
            Inversée
          </div>
        </div>
        <p ref="questionTextRef" class="sm:text-2xl/7 text-[1.38rem]/7 leading-snug text-white font-serif italic opacity-0">
          {{ currentQuestion.text }}
        </p>
      </div>
        
      <!-- Answers -->
      <div ref="answersRef" class="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-6 opacity-0">
        <button 
            v-for="rating in ratings" 
            :key="rating.value"
            class="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-[10px] border transition-all duration-200 hover:scale-105"
            :class="getRatingClass(rating.value)"
            @click="$emit('selectAnswer', rating.value)"
        >
            <span class="text-2xl/7 font-black mb-2 group-hover:text-current transition-colors">{{ rating.value }}</span>
            <span class="text-base/7 text-center transition-opacity">{{ currentQuestion.inversed ? rating.inversedLabel : rating.label }}</span>
        </button>
      </div>
    </div>
    
    <!-- Navigation -->
    <div ref="navRef" class="flex justify-between items-center opacity-0 mt-auto pb-10">
      <button 
        class="text-white transition-colors duration-300 flex items-center gap-2 px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed" 
        @click="onPrevious" 
        :disabled="currentQuestionIndex === 0 || isAnimating"
      >
        ← Précédent
      </button>
      <button 
        class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2" 
        @click="onNext"
        :disabled="currentAnswer === null || isAnimating"
      >
        {{ isLastQuestion ? 'Voir les résultats' : 'Suivant' }}
        <span v-if="!isLastQuestion">→</span>
      </button>
    </div>
  </div>
</template>
