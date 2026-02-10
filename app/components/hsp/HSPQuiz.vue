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
  }
});

defineEmits(['selectAnswer', 'next', 'previous']);

const { $gsap } = useNuxtApp();
const sectionNameRef = ref(null);
const internalDisplaySectionName = ref(props.displaySectionName);

watch(() => props.currentSectionIndex, (newIndex) => {
  if (!sectionNameRef.value) {
    internalDisplaySectionName.value = props.sections[newIndex].name;
    return;
  }

  const tl = $gsap.timeline();

  tl.to(sectionNameRef.value, {
    opacity: 0,
    filter: "blur(12px)",
    duration: 0.4,
    ease: "power2.inOut",
    onComplete: () => {
      internalDisplaySectionName.value = props.sections[newIndex].name;
    },
  });

  tl.to(sectionNameRef.value, {
    opacity: 1,
    filter: "blur(0px)",
    duration: 0.4,
    ease: "power2.out",
  });
});

// We need to handle the animation in the parent or emit an event when section changes
// to let the parent know we need to animate? 
// Or better: the parent passes the displaySectionName, but the animation happens here.
// But the current parent has a watch on currentSectionIndex to update displaySectionName.
</script>

<template>
  <div class="w-full max-w-4xl pt-24">
    <!-- Fixed Header -->
    <nav class="fixed top-0 left-0 w-full flex justify-between items-center px-8 md:px-16 py-13 z-50">
      <div class="flex items-center">
        <span class="font-satoshi font-medium text-base leading-[28px] uppercase">Section {{ currentSectionIndex + 1 }}</span>
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
    <div class="fixed bottom-0 left-0 w-full h-[4px] bg-white/10 z-50">
      <div class="h-full bg-white transition-all duration-500 ease-out" :style="{ width: progressPercent + '%' }"></div>
    </div>
    
    <!-- Question -->
    <div class="min-h-36 flex flex-col justify-center mb-6">
      <div class="flex items-center h-16 gap-x-4">
        <p class="font-satoshi font-medium text-white uppercase text-xl/7">Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>
        <div v-if="currentQuestion.inversed" class="bg-white text-primary px-4 py-2 rounded-full text-xl font-medium">
          Inversée
        </div>
      </div>
      <p class="text-2xl/7 leading-snug text-white font-serif italic mb-4 transition-all duration-500">
        {{ currentQuestion.text }}
      </p>
    </div>
      
    <!-- Answers -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16">
      <button 
          v-for="rating in ratings" 
          :key="rating.value"
          class="group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 hover:scale-105"
          :class="currentAnswer === rating.value ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/30'"
          @click="$emit('selectAnswer', rating.value)"
      >
          <span class="text-2xl font-bold mb-2 group-hover:text-current transition-colors">{{ rating.value }}</span>
          <span class="text-xs text-center opacity-70 group-hover:opacity-100 transition-opacity">{{ currentQuestion.inversed ? rating.inversedLabel : rating.label }}</span>
      </button>
    </div>
    
    <!-- Navigation -->
    <div class="flex justify-between items-center border-t border-white/10 pt-8">
      <button 
        class="text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-2 px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed" 
        @click="$emit('previous')" 
        :disabled="currentQuestionIndex === 0"
      >
        ← Précédent
      </button>
      <button 
        class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2" 
        @click="$emit('next')"
        :disabled="currentAnswer === null"
      >
        {{ isLastQuestion ? 'Voir les résultats' : 'Suivant' }}
        <span v-if="!isLastQuestion">→</span>
      </button>
    </div>
  </div>
</template>
