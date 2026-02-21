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

const isAnimating = ref(false);

const onPrevious = async () => {
  if (isAnimating.value) return;
  isAnimating.value = true;
  
  const prevQuestion = props.questions[props.currentQuestionIndex - 1];
  const optionsChange = prevQuestion && prevQuestion.inversed !== props.currentQuestion.inversed;
  
  const slideElements = [questionTextRef.value];
  if (optionsChange) slideElements.push(answersRef.value);
  
  const tlOut = $gsap.timeline();
  tlOut.to(slideElements, {
    x: 50,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.3,
    stagger: 0.05,
    ease: 'power2.in'
  }, 0);
  
  tlOut.to(questionInfoRef.value, {
    opacity: 0,
    duration: 0.2
  }, 0);
  
  await tlOut;
  
  emit('previous');
  
  await nextTick();
  
  $gsap.set(slideElements, { 
    x: -50,
    opacity: 0,
    filter: 'blur(10px)'
  });
  $gsap.set(questionInfoRef.value, { opacity: 0 });
  
  const tlIn = $gsap.timeline();
  tlIn.to(slideElements, {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out'
  }, 0);
  
  tlIn.to(questionInfoRef.value, {
    opacity: 1,
    duration: 0.3
  }, 0);
  
  await tlIn;
  isAnimating.value = false;
};

const onNext = async () => {
  if (isAnimating.value) return;
  
  if (props.isLastQuestion) {
      emit('next');
      return;
  }
  
  isAnimating.value = true;
  
  const nextQuestion = props.questions[props.currentQuestionIndex + 1];
  const optionsChange = nextQuestion && nextQuestion.inversed !== props.currentQuestion.inversed;
  
  const slideElements = [questionTextRef.value];
  if (optionsChange) slideElements.push(answersRef.value);
  
  const tlOut = $gsap.timeline();
  tlOut.to(slideElements, {
    x: -50,
    opacity: 0,
    filter: 'blur(10px)',
    duration: 0.3,
    stagger: 0.05,
    ease: 'power2.in'
  }, 0);
  
  tlOut.to(questionInfoRef.value, {
    opacity: 0,
    duration: 0.2
  }, 0);
  
  await tlOut;
  
  emit('next');
  
  await nextTick();
  
  $gsap.set(slideElements, { 
    x: 50,
    opacity: 0,
    filter: 'blur(10px)'
  });
  $gsap.set(questionInfoRef.value, { opacity: 0 });
  
  const tlIn = $gsap.timeline();
  tlIn.to(slideElements, {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 0.4,
    stagger: 0.05,
    ease: 'power2.out'
  }, 0);
  
  tlIn.to(questionInfoRef.value, {
    opacity: 1,
    duration: 0.3
  }, 0);
  
  await tlIn;
  isAnimating.value = false;
};


const { $gsap } = useNuxtApp();
const sectionNameRef = ref(null);
const headerRef = ref(null);
const progressBarRef = ref(null);
const questionInfoRef = ref(null);
const questionTextRef = ref(null);
const answersRef = ref(null);
const navRef = ref(null);

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

const enter = () => {
  return new Promise((resolve) => {
    // Initial state
    $gsap.set(progressBarRef.value, { y: '100%' });
    
    const elements = [
      headerRef.value,
      questionInfoRef.value,
      questionTextRef.value,
      answersRef.value,
      navRef.value
    ];

    $gsap.set(elements, {
      opacity: 0,
      y: 20,
      filter: 'blur(5px)'
    });

    const tl = $gsap.timeline({
      onComplete: resolve
    });

    // Animate Progress Bar
    tl.to(progressBarRef.value, {
      y: '0%',
      duration: 0.6,
      ease: 'power3.out'
    }, 0);

    // Stagger animate other elements
    tl.to(elements, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, 0.2);
  });
};

const leave = () => {
  return new Promise((resolve) => {
    const tl = $gsap.timeline({
      onComplete: resolve
    });

    const elements = [
      headerRef.value,
      questionInfoRef.value,
      questionTextRef.value,
      answersRef.value,
      navRef.value
    ];

    // Animate Progress Bar
    tl.to(progressBarRef.value, {
      y: '100%',
      duration: 0.5,
      ease: 'power3.in'
    }, 0);

    // Stagger animate other elements
    tl.to(elements, {
      opacity: 0,
      y: -20,
      filter: 'blur(5px)',
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.in'
    }, 0);
  });
};

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
  <div class="w-full max-w-4xl pt-24">
    <!-- Fixed Header -->
    <nav ref="headerRef" class="fixed top-0 left-0 w-full flex justify-between items-center px-8 md:px-16 py-13 z-50 opacity-0">
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
    <div ref="progressBarRef" class="fixed bottom-0 left-0 w-full h-[4px] bg-white/10 z-50 translate-y-full">
      <div class="h-full bg-white transition-all duration-500 ease-out" :style="{ width: progressPercent + '%' }"></div>
    </div>
    
    <!-- Question -->
    <div class="min-h-36 flex flex-col justify-center mb-8">
      <div ref="questionInfoRef" class="flex items-center h-16 gap-x-4 opacity-0">
        <p class="font-satoshi font-medium text-white uppercase text-xl/7">Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>
        <div v-if="currentQuestion.inversed" class="bg-white text-primary px-4 py-2 rounded-full text-xl font-medium">
          Inversée
        </div>
      </div>
      <p ref="questionTextRef" class="text-2xl/7 leading-snug text-white font-serif italic opacity-0">
        {{ currentQuestion.text }}
      </p>
    </div>
      
    <!-- Answers -->
    <div ref="answersRef" class="grid grid-cols-2 md:grid-cols-5 gap-6 mb-16 opacity-0">
      <button 
          v-for="rating in ratings" 
          :key="rating.value"
          class="group relative flex flex-col items-center justify-center p-6 rounded-[10px] border transition-all duration-200 hover:scale-105"
          :class="getRatingClass(rating.value)"
          @click="$emit('selectAnswer', rating.value)"
      >
          <span class="text-2xl/7 font-black mb-2 group-hover:text-current transition-colors">{{ rating.value }}</span>
          <span class="text-base/7 text-center transition-opacity">{{ currentQuestion.inversed ? rating.inversedLabel : rating.label }}</span>
      </button>
    </div>
    
    <!-- Navigation -->
    <div ref="navRef" class="flex justify-between items-center opacity-0">
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
