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
  <div class="w-full max-w-5xl text-center">
    <div ref="scoreContainerRef" class="mb-16 opacity-0">        
      <div class="flex-col items-center justify-center mb-8">
          <div class="flex items-baseline gap-2 mb-2 text-white justify-center">
              <span ref="totalScoreRef" class="fl-text-4xl/5xl font-bold">0</span>
              <span class="text-gray-500 text-xl">/ {{ totalQuestions * 4 }}</span>
          </div>
          <div ref="sensitivityLabelRef" class="text-[2.5rem] font-serif mb-2 opacity-0">
              {{ sensitivityLevel.label }}
          </div>
          <p ref="sensitivityDescRef" class="max-w-lg mx-auto text-balance text-title text-gray-300 opacity-0">
          {{ sensitivityLevel.description }}
          </p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-left">
      <div>
          <h3 ref="sectionsTitleRef" class="fl-text-xl/2xl text-white font-serif italic mb-8 border-b border-white/10 pb-4 opacity-0">Scores par dimension</h3>
          <div class="space-y-6">
              <div v-for="(section, index) in sections" :key="index" ref="sectionItemsRef" class="relative group opacity-0">
                  <div class="flex items-center justify-between mb-2 z-10 relative">
                      <div class="flex items-center gap-3">
                          <span class="text-gray-300 font-medium text-sm">{{ section.shortName }}</span>
                      </div>
                      <span class="text-white font-mono text-sm">
                        <span ref="sectionScoreCountersRef">0</span>/{{ questionsPerSection * 4 }}
                      </span>
                  </div>
                  <div class="h-2 bg-gray-800 rounded-full overflow-hidden w-full relative">
                      <div 
                          ref="sectionBarsRef"
                          class="h-full rounded-full" 
                          :style="{ 
                            width: '0%',
                            backgroundColor: section.color
                          }"
                          :data-width="(sectionScores[index] / (questionsPerSection * 4) * 100) + '%'"
                      ></div>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="space-y-8">
          <div v-if="dominantProfile" ref="profileCardRef" class="bg-linear-to-br from-white/10 to-transparent border border-white/10 rounded-3xl p-8 opacity-0">
              <div class="flex items-center gap-4 mb-6">
                  <div>
                      <h3 class="text-xl text-white font-bold">{{ dominantProfile.name }}</h3>
                      <span class="text-xs uppercase tracking-widest text-gray-500">Profil Dominant</span>
                  </div>
              </div>
              <p class="text-gray-300 mb-6 leading-relaxed">{{ dominantProfile.description }}</p>
              <div class="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-6">
                  <strong class="text-indigo-300 block mb-2 text-sm uppercase tracking-wide">Conseil</strong>
                  <p class="text-indigo-100/80 text-sm leading-relaxed">{{ dominantProfile.advice }}</p>
              </div>
          </div>
          
          <div v-if="sectionScores[7] > (questionsPerSection * 4 * 0.75)" ref="alertCardRef" class="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 opacity-0">
              <div class="flex items-center gap-3 mb-4">
                  <h4 class="text-red-300 font-bold">Indicateur de sur-adaptation</h4>
              </div>
              <p class="text-red-100/80 text-sm leading-relaxed">
                  Votre score en Section VIII (Adaptation sociale) est supérieur à {{ questionsPerSection * 4 * 0.75 }}/{{ questionsPerSection * 4 }}. 
                  Cela suggère que vous êtes actuellement en sur-adaptation et dépensez beaucoup d'énergie à « faire comme tout le monde ».
              </p>
          </div>
      </div>
    </div>
    
    <div class="flex justify-center pb-16">
      <button ref="restartBtnRef" class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2 opacity-0" @click="$emit('restart')">
          <span>Recommencer le questionnaire</span>
      </button>
    </div>
  </div>
</template>
