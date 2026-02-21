<script setup>

const { $gsap } = useNuxtApp();
const props = defineProps({
  totalScore: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  sensitivityLevel: {
    type: Object,
    required: true
  },
  sections: {
    type: Array,
    required: true
  },
  sectionScores: {
    type: Array,
    required: true
  },
  questionsPerSection: {
    type: Number,
    required: true
  },
  dominantProfile: {
    type: Object,
    required: true
  }
});

defineEmits(['restart']);

const scoreContainerRef = ref(null);
const totalScoreRef = ref(null);
const sensitivityLabelRef = ref(null);
const sensitivityDescRef = ref(null);
const sectionsTitleRef = ref(null);
const sectionItemsRef = ref([]); // This needs to collect the divs
const sectionScoreCountersRef = ref([]);
const sectionBarsRef = ref([]);
const profileCardRef = ref(null);
const alertCardRef = ref(null);
const restartBtnRef = ref(null);

const enter = () => {
  return new Promise((resolve) => {
    // Collect all elements to animate in
    const mainElements = [
        scoreContainerRef.value,
        sensitivityLabelRef.value,
        sensitivityDescRef.value,
        sectionsTitleRef.value,
        profileCardRef.value,
        alertCardRef.value,
        restartBtnRef.value
    ].filter(el => el); // filter nulls

    // Set initial states
    $gsap.set(mainElements, {
        opacity: 0,
        y: 20,
        filter: 'blur(10px)'
    });
    
    $gsap.set(sectionItemsRef.value, {
        opacity: 0,
        x: -20
    });

    const tl = $gsap.timeline({
        onComplete: resolve
    });

    // 1. Animate Total Score Counter
    const scoreObj = { val: 0 };
    tl.to(scoreObj, {
        val: props.totalScore,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
            if (totalScoreRef.value) {
                totalScoreRef.value.textContent = Math.round(scoreObj.val);
            }
        }
    }, 0);

    // 2. Stagger animate main elements
    tl.to(mainElements, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    }, 0);

    // 3. Stagger animate section items container
    tl.to(sectionItemsRef.value, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out'
    }, 0.5);

    // 4. Animate Bars and Section Counters
    sectionBarsRef.value.forEach((bar, index) => {
        if (!bar) return;
        
        // Bar width
        const targetWidth = bar.dataset.width;
        tl.to(bar, {
            width: targetWidth,
            duration: 1.5,
            ease: 'power3.out'
        }, 0.5 + (index * 0.05));

        // Section Score Counter
        const counterEl = sectionScoreCountersRef.value[index];
        if (counterEl) {
            const sectionScore = props.sectionScores[index];
            const sectionScoreObj = { val: 0 };
            tl.to(sectionScoreObj, {
                val: sectionScore,
                duration: 1.5,
                ease: 'power2.out',
                onUpdate: () => {
                    counterEl.textContent = Math.round(sectionScoreObj.val);
                }
            }, 0.5 + (index * 0.05));
        }
    });

  });
};

const leave = () => {
  return new Promise((resolve) => {
    const tl = $gsap.timeline({
      onComplete: resolve
    });
    
    // Simple fade out for everything
    const allRefs = [
        scoreContainerRef.value,
        profileCardRef.value,
        alertCardRef.value,
        restartBtnRef.value,
        ...sectionItemsRef.value
    ].filter(el => el);

    tl.to(allRefs, {
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.5,
        ease: 'power2.in'
    });
  });
};

onMounted(() => {
    enter();
});

defineExpose({
    enter,
    leave
});
</script>

<template>
  <div class="w-full max-w-5xl text-left mx-auto px-4 md:px-0 mt-8">
    <!-- Top block -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 mb-24">
      
      <!-- Left side: Score and Sensitivity -->
      <div ref="scoreContainerRef" class="opacity-0">        
        <div class="flex flex-col items-start mb-8">
            <div class="flex items-baseline gap-1 mb-2">
                <span ref="totalScoreRef" class="text-6xl font-bold font-satoshi text-white">0</span>
                <span class="text-gray-400 text-2xl font-satoshi">/ {{ totalQuestions * 4 }}</span>
            </div>
            <div ref="sensitivityLabelRef" class="text-4xl md:text-[2.75rem] font-eiko italic mb-6 opacity-0 text-white leading-tight">
                {{ sensitivityLevel.label }}
            </div>
            <p ref="sensitivityDescRef" class="text-gray-300 font-satoshi opacity-0 leading-relaxed text-sm md:text-base">
                {{ sensitivityLevel.description }}
            </p>
        </div>
      </div>

      <!-- Right side: Profile and Advice -->
      <div class="space-y-8 flex flex-col justify-start pt-2 md:pt-4">
          <div v-if="dominantProfile" ref="profileCardRef" class="opacity-0 space-y-6">
              <div>
                  <h3 class="text-white text-sm font-satoshi font-medium tracking-wide uppercase mb-3">
                      Profil <span class="font-eiko italic font-normal text-[1.4rem] ml-1 text-gray-200">"{{ dominantProfile.name }}"</span>
                  </h3>
                  <p class="text-gray-400 font-satoshi leading-relaxed text-sm">{{ dominantProfile.description }}</p>
              </div>
              <div>
                  <h3 class="text-white text-sm font-satoshi font-medium tracking-wide uppercase mb-3">Conseil</h3>
                  <p class="text-gray-400 font-satoshi leading-relaxed text-sm">{{ dominantProfile.advice }}</p>
              </div>
          </div>
          
          <div v-if="sectionScores[7] > (questionsPerSection * 4 * 0.75)" ref="alertCardRef" class="opacity-0">
              <h4 class="text-red-400 text-sm font-satoshi font-medium tracking-wide uppercase mb-3">Indicateur de sur-adaptation</h4>
              <p class="text-gray-400 font-satoshi leading-relaxed text-sm">
                  Votre score en Section VIII (Adaptation sociale) est supérieur à {{ questionsPerSection * 4 * 0.75 }}/{{ questionsPerSection * 4 }}. 
                  Cela suggère que vous êtes actuellement en sur-adaptation et dépensez beaucoup d'énergie à « faire comme tout le monde ».
              </p>
          </div>
      </div>
    </div>

    <!-- Middle block: Scores par section -->
    <div class="mb-20">
        <h3 ref="sectionsTitleRef" class="text-white text-sm font-satoshi font-medium tracking-wide uppercase mb-10 opacity-0">Scores par section</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-8">
            <div v-for="(section, index) in sections" :key="index" ref="sectionItemsRef" class="opacity-0 flex flex-col group">
                <span class="text-gray-200 font-eiko italic text-xl mb-4">{{ section.shortName }}</span>
                <div class="flex items-center gap-6">
                    <div class="h-[2px] bg-white/20 w-full relative flex-1">
                        <div 
                            ref="sectionBarsRef"
                            class="h-full bg-white absolute left-0 top-0" 
                            :style="{ 
                              width: '0%',
                            }"
                            :data-width="(sectionScores[index] / (questionsPerSection * 4) * 100) + '%'"
                        ></div>
                    </div>
                    <span class="text-white text-sm font-satoshi font-semibold tracking-wide whitespace-nowrap">
                      <span ref="sectionScoreCountersRef">0</span>/{{ questionsPerSection * 4 }}
                    </span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Bottom block: Restart button -->
    <div class="flex justify-center pb-8">
      <button ref="restartBtnRef" class="bg-transparent border border-gray-600 text-gray-300 px-8 py-4 rounded-md font-satoshi text-xs md:text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 opacity-0" @click="$emit('restart')">
          Recommencer le questionnaire
      </button>
    </div>
  </div>
</template>
