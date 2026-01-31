<script setup>
const currentView = ref('intro');
const currentQuestionIndex = ref(0);

import quizData from '@/app/data/hsp-quiz.json';

const { ratings, sections, questions, profiles } = quizData;
const totalQuestions = questions.length;
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1);

const answers = ref(Array(totalQuestions).fill(null));

const questionsPerSection = totalQuestions / sections.length;
const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
const currentSectionIndex = computed(() => Math.floor(currentQuestionIndex.value / questionsPerSection));
const currentSection = computed(() => sections[currentSectionIndex.value]);
const progressPercent = computed(() => Math.round((currentQuestionIndex.value + 1) / totalQuestions * 100));

const totalScore = computed(() => {
  return answers.value.reduce((sum, val) => sum + (val ?? 0), 0);
});

const sensitivityLevel = computed(() => {
  const score = totalScore.value;
  if (score <= totalQuestions) {
    return {
      label: 'Sensibilité standard',
      class: 'text-green-400',
      description: 'Vous gérez bien les stimuli et les émotions. Vous pouvez être sensible sur certains points précis, mais votre système nerveux filtre efficacement.'
    };
  } else if (score <= totalQuestions * 2) {
    return {
      label: 'Sensibilité modérée',
      class: 'text-yellow-400',
      description: 'Sensibilité supérieure à la moyenne. Vous avez probablement développé de bonnes stratégies d\'adaptation, ou votre sensibilité ne concerne que certains domaines.'
    };
  } else if (score <= totalQuestions * 3) {
    return {
      label: 'Hypersensibilité avérée (HSP)',
      class: 'text-orange-400',
      description: 'Profil classique de la haute sensibilité. Votre système nerveux traite les informations avec une profondeur inhabituelle. Comprendre ce fonctionnement vous aidera à mieux le vivre.'
    };
  } else {
    return {
      label: 'Ultra-sensibilité',
      class: 'text-red-400',
      description: 'Perméabilité très élevée. Souvent associée à une grande créativité, mais le risque d\'épuisement est réel si l\'environnement n\'est pas adapté. Un accompagnement peut être bénéfique.'
    };
  }
});

const dominantProfile = computed(() => {
  let maxScore = 0;
  let dominant = null;
  
  profiles.forEach(profile => {
    const profileScore = profile.sections.reduce((sum, sectionIdx) => {
      return sum + getSectionScore(sectionIdx);
    }, 0);
    const avgScore = profileScore / profile.sections.length;
    
    if (avgScore > maxScore) {
      maxScore = avgScore;
      dominant = profile;
    }
  });
  
  return dominant;
});

function getSectionScore(sectionIndex) {
  const start = sectionIndex * questionsPerSection;
  const end = start + questionsPerSection;
  return answers.value.slice(start, end).reduce((sum, val) => sum + (val ?? 0), 0);
}

function startQuiz() {
  currentView.value = 'quiz';
}

function selectAnswer(value) {
  answers.value[currentQuestionIndex.value] = value;
}

function nextQuestion() {
  if (!isLastQuestion.value) {
    currentQuestionIndex.value++;
  } else {
    currentView.value = 'results';
  }
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--;
  }
}

function restart() {
  currentView.value = 'intro';
  currentQuestionIndex.value = 0;
  answers.value = Array(totalQuestions).fill(null);
}
</script>

<template>
  <div class="w-full h-screen relative flex flex-col items-center justify-center p-4 bg-primary text-white">
    
    <!-- Intro Screen -->
    <div v-if="currentView === 'intro'" class="w-full max-w-3xl text-center">
      <div class="mb-12 max-w-2xl mx-auto text-xl/7 leading-relaxed mb-8 font-serif space-y-4">
        <p>
          Ce questionnaire est un outil d'auto-exploration, non un diagnostic clinique. Il s'appuie sur le modèle de la Haute Sensibilité (HSP) d'Elaine Aron.
        </p>
        <p>
          Ce test mesure une <strong>intensité</strong>, pas une réponse binaire. Pour un accompagnement personnalisé, consultez un professionnel de santé mentale.
        </p>
      </div>
      
    
        
        <div class="flex items-center justify-center gap-8 text-gray-500 text-sm">
          <span>{{ totalQuestions }} questions réparties en {{ sections.length }} sections</span>
          <span>Durée estimée : 15-20 minutes</span>
        </div>
      <button 
        class="absolute bottom-18 uppercase left-1/2 text-base/5 -translate-x-1/2 items-center justify-center font-medium text-white transition-all duration-300"
        @click="startQuiz"
      >
        Commencer le questionnaire
      </button>
    </div>
    
    <!-- Quiz Screen -->
    <div v-if="currentView === 'quiz'" class="w-full max-w-4xl pt-24">
      <!-- Fixed Header -->
      <nav class="fixed top-0 left-0 w-full flex justify-between items-center px-8 md:px-12 py-8 z-50">
        <div class="flex items-center gap-4">
          <span class="font-satoshi font-medium text-base leading-[28px] uppercase text-white/50">Section {{ currentSectionIndex + 1 }}</span>
          <span class="font-serif text-base leading-[28px] text-white">{{ currentSection.name }}</span>
        </div>
      </nav>

      <!-- Fixed Progress Bar -->
      <div class="fixed bottom-0 left-0 w-full h-[4px] bg-white/10 z-50">
        <div class="h-full bg-white transition-all duration-500 ease-out" :style="{ width: progressPercent + '%' }"></div>
      </div>
      
      <!-- Question -->
      <div class="min-h-[300px] flex flex-col justify-center mb-12">
        <div class="flex items-center gap-4 mb-4">
          <p class="font-satoshi font-medium text-xl/7 text-white/50">Question {{ currentQuestionIndex + 1 }} / {{ totalQuestions }}</p>
          <div v-if="currentQuestion.inversed" class="bg-white text-black px-4 py-1.5 rounded-full text-[12px] font-medium uppercase tracking-wider">
            Inversé
          </div>
        </div>
        <p class="text-[28px] leading-[40px] text-white font-serif italic text-balance mb-4 transition-all duration-500">
          {{ currentQuestion.text }}
        </p>
      </div>
        
      <!-- Answers -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-3 mb-16">
        <button 
            v-for="rating in ratings" 
            :key="rating.value"
            class="group relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 hover:scale-105"
            :class="answers[currentQuestionIndex] === rating.value ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:border-white/30'"
            @click="selectAnswer(rating.value)"
        >
            <span class="text-2xl font-bold mb-2 group-hover:text-current transition-colors">{{ rating.value }}</span>
            <span class="text-xs text-center opacity-70 group-hover:opacity-100 transition-opacity">{{ currentQuestion.inversed ? rating.inversedLabel : rating.label }}</span>
        </button>
      </div>
      
      <!-- Navigation -->
      <div class="flex justify-between items-center border-t border-white/10 pt-8">
        <button 
          class="text-gray-500 hover:text-white transition-colors duration-300 flex items-center gap-2 px-4 py-2 disabled:opacity-30 disabled:cursor-not-allowed" 
          @click="previousQuestion" 
          :disabled="currentQuestionIndex === 0"
        >
          ← Précédent
        </button>
        <button 
          class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2" 
          @click="nextQuestion"
          :disabled="answers[currentQuestionIndex] === null"
        >
          {{ isLastQuestion ? 'Voir les résultats' : 'Suivant' }}
          <span v-if="!isLastQuestion">→</span>
        </button>
      </div>
    </div>
    
    <!-- Results Screen -->
    <div v-if="currentView === 'results'" class="w-full max-w-5xl animate-fade-in">
      <div class="text-center mb-16">
        <h1 class="fl-text-4xl/6xl font-serif italic text-white mb-8">Vos Résultats</h1>
        
        <div class="inline-flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-3xl p-8 mb-8 backdrop-blur-sm">
            <div class="flex items-baseline gap-2 mb-2">
                <span class="fl-text-6xl/7xl font-bold text-white">{{ totalScore }}</span>
                <span class="text-gray-500 text-xl">/ {{ totalQuestions * 4 }}</span>
            </div>
            <div class="text-2xl font-medium mb-2" :class="sensitivityLevel.class">
                {{ sensitivityLevel.label }}
            </div>
            <p class="text-gray-400 max-w-lg mx-auto text-balance leading-relaxed">
            {{ sensitivityLevel.description }}
            </p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div>
            <h3 class="fl-text-xl/2xl text-white font-serif italic mb-8 border-b border-white/10 pb-4">Scores par dimension</h3>
            <div class="space-y-6">
                <div v-for="(section, index) in sections" :key="index" class="relative group">
                    <div class="flex items-center justify-between mb-2 z-10 relative">
                        <div class="flex items-center gap-3">
                            <span class="text-gray-300 font-medium text-sm">{{ section.shortName }}</span>
                        </div>
                        <span class="text-white font-mono text-sm">{{ getSectionScore(index) }}/{{ questionsPerSection * 4 }}</span>
                    </div>
                    <div class="h-2 bg-gray-800 rounded-full overflow-hidden w-full relative">
                        <div 
                            class="h-full rounded-full transition-all duration-1000 ease-out" 
                            :style="{ 
                            width: (getSectionScore(index) / (questionsPerSection * 4) * 100) + '%',
                            backgroundColor: section.color
                            }"
                        ></div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="space-y-8">
            <div v-if="dominantProfile" class="bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl p-8">
                <div class="flex items-center gap-4 mb-6">
                <!-- Icon removed -->
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
            
            <div v-if="getSectionScore(7) > (questionsPerSection * 4 * 0.75)" class="bg-red-500/10 border border-red-500/20 rounded-3xl p-8">
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
        <button class="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors duration-300 flex items-center gap-2" @click="restart">
            <span>Recommencer le questionnaire</span>
        </button>
      </div>
    </div>
  </div>
</template>
