<script setup>
defineProps({
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
</script>

<template>
  <div class="w-full max-w-5xl animate-fade-in text-center">
    <div class="mb-16">        
      <div class="flex-col items-center justify-center mb-8">
          <div class="flex items-baseline gap-2 mb-2 text-white justify-center">
              <span class="fl-text-4xl/5xl font-bold">{{ totalScore }}</span>
              <span class="text-gray-500 text-xl">/ {{ totalQuestions * 4 }}</span>
          </div>
          <div class="text-[2.5rem] font-serif mb-2">
              {{ sensitivityLevel.label }}
          </div>
          <p class="max-w-lg mx-auto text-balance text-title text-gray-300">
          {{ sensitivityLevel.description }}
          </p>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 text-left">
      <div>
          <h3 class="fl-text-xl/2xl text-white font-serif italic mb-8 border-b border-white/10 pb-4">Scores par dimension</h3>
          <div class="space-y-6">
              <div v-for="(section, index) in sections" :key="index" class="relative group">
                  <div class="flex items-center justify-between mb-2 z-10 relative">
                      <div class="flex items-center gap-3">
                          <span class="text-gray-300 font-medium text-sm">{{ section.shortName }}</span>
                      </div>
                      <span class="text-white font-mono text-sm">{{ sectionScores[index] }}/{{ questionsPerSection * 4 }}</span>
                  </div>
                  <div class="h-2 bg-gray-800 rounded-full overflow-hidden w-full relative">
                      <div 
                          class="h-full rounded-full transition-all duration-1000 ease-out" 
                          :style="{ 
                          width: (sectionScores[index] / (questionsPerSection * 4) * 100) + '%',
                          backgroundColor: section.color
                          }"
                      ></div>
                  </div>
              </div>
          </div>
      </div>
      
      <div class="space-y-8">
          <div v-if="dominantProfile" class="bg-linear-to-br from-white/10 to-transparent border border-white/10 rounded-3xl p-8">
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
          
          <div v-if="sectionScores[7] > (questionsPerSection * 4 * 0.75)" class="bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
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
      <button class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2" @click="$emit('restart')">
          <span>Recommencer le questionnaire</span>
      </button>
    </div>
  </div>
</template>
