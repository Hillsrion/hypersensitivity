<script setup>
import HSPIntro from './hsp/HSPIntro.vue';
import HSPQuiz from './hsp/HSPQuiz.vue';
import HSPResults from './hsp/HSPResults.vue';
import quizData from '@/app/data/hsp-quiz.json';
import { useAnimationsStore } from "~/stores/animations";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();

const currentView = ref('intro');
const currentQuestionIndex = ref(0);
const elementRef = ref(null);

const { ratings, sections, questions, profiles } = quizData;
const totalQuestions = questions.length;
const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1);
const answers = ref(Array(totalQuestions).fill(null));

const questionsPerSection = totalQuestions / sections.length;
const currentQuestion = computed(() => questions[currentQuestionIndex.value]);
const currentSectionIndex = computed(() => Math.floor(currentQuestionIndex.value / questionsPerSection));
const progressPercent = computed(() => Math.round((currentQuestionIndex.value + 1) / totalQuestions * 100));

const displaySectionName = computed(() => sections[currentSectionIndex.value].name);

const totalScore = computed(() => {
  return answers.value.reduce((sum, val) => sum + (val ?? 0), 0);
});

const sensitivityLevel = computed(() => {
  const score = totalScore.value;
  if (score <= totalQuestions) {
    return {
      label: 'Sensibilité standard',
      description: 'Vous gérez bien les stimuli et les émotions. Vous pouvez être sensible sur certains points précis, mais votre système nerveux filtre efficacement.'
    };
  } else if (score <= totalQuestions * 2) {
    return {
      label: 'Sensibilité modérée',
      description: 'Sensibilité supérieure à la moyenne. Vous avez probablement développé de bonnes stratégies d\'adaptation, ou votre sensibilité ne concerne que certains domaines.'
    };
  } else if (score <= totalQuestions * 3) {
    return {
      label: 'Hypersensibilité avérée (HSP)',
      description: 'Profil classique de la haute sensibilité. Votre système nerveux traite les informations avec une profondeur inhabituelle. Comprendre ce fonctionnement vous aidera à mieux le vivre.'
    };
  } else {
    return {
      label: 'Ultra-sensibilité',
      description: 'Perméabilité très élevée. Souvent associée à une grande créativité, mais le risque d\'épuisement est réel si l\'environnement n\'est pas adapté. Un accompagnement peut être bénéfique.'
    };
  }
});

const sectionScores = computed(() => {
  return sections.map((_, index) => getSectionScore(index));
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

onMounted(() => {
  $gsap.timeline({
    scrollTrigger: {
      trigger: elementRef.value,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => {
        animationsStore.setCursorVariant("light");
        animationsStore.setAudiowaveVariant("light");
      },
      onEnterBack: () => {
        animationsStore.setCursorVariant("light");
        animationsStore.setAudiowaveVariant("light");
      }
    }
  });
});
</script>

<template>
  <div ref="elementRef" class="questionnaire-container w-full min-h-screen relative flex flex-col items-center justify-center p-4 bg-primary text-white">
    
    <!-- Intro Screen -->
    <HSPIntro 
      v-if="currentView === 'intro'" 
      :total-questions="totalQuestions" 
      :sections-count="sections.length"
      @start="startQuiz"
    />
    
    <!-- Quiz Screen -->
    <HSPQuiz 
      v-if="currentView === 'quiz'"
      :sections="sections"
      :current-question="currentQuestion"
      :current-question-index="currentQuestionIndex"
      :total-questions="totalQuestions"
      :ratings="ratings"
      :current-answer="answers[currentQuestionIndex]"
      :current-section-index="currentSectionIndex"
      :display-section-name="displaySectionName"
      :progress-percent="progressPercent"
      :is-last-question="isLastQuestion"
      @select-answer="selectAnswer"
      @next="nextQuestion"
      @previous="previousQuestion"
    />
    
    <!-- Results Screen -->
    <HSPResults 
      v-if="currentView === 'results'"
      :total-score="totalScore"
      :total-questions="totalQuestions"
      :sensitivity-level="sensitivityLevel"
      :sections="sections"
      :section-scores="sectionScores"
      :questions-per-section="questionsPerSection"
      :dominant-profile="dominantProfile"
      @restart="restart"
    />
  </div>
</template>
