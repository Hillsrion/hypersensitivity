<script setup>
import HSPIntro from './hsp/HSPIntro.vue';
import HSPQuiz from './hsp/HSPQuiz.vue';
import HSPResults from './hsp/HSPResults.vue';
import { useAnimationsStore } from "~/stores/animations";
import { useHspQuizStore } from "~/stores/hspQuiz";
import { storeToRefs } from "pinia";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const hspQuizStore = useHspQuizStore();
const {
  currentView,
  currentQuestionIndex,
  answers,
  ratings,
  sections,
  questions,
  totalQuestions,
  questionsPerSection,
  currentQuestion,
  currentSectionIndex,
  isLastQuestion,
  progressPercent,
  displaySectionName,
  totalScore,
  sensitivityLevel,
  sectionScores,
  dominantProfile
} = storeToRefs(hspQuizStore);

const {
  startQuiz,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  restart
} = hspQuizStore;


const route = useRoute();
const introRef = useTemplateRef("introRef");
const quizRef = useTemplateRef("quizRef");
const resultsRef = useTemplateRef("resultsRef");
const elementRef = useTemplateRef("elementRef");

const handleStart = async () => {
    if (introRef.value) {
        await introRef.value.leave();
    }
    startQuiz();
};

const handleNext = async () => {
    if (isLastQuestion.value) {
        if (quizRef.value) {
            await quizRef.value.leave();
        }
    }
    nextQuestion();
};

const handleRestart = async () => {
    if (resultsRef.value) {
        await resultsRef.value.leave();
    }
    restart();
};

const contentReady = ref(false);

onMounted(() => {
  // Debug mode: jump straight to quiz
  if (route.query.debug === 'quiz') {
    startQuiz();
  }

  // Delay content rendering to match the external background transition duration from Experience.vue
  setTimeout(() => {
    contentReady.value = true;
  }, 2000); // 4 steps * 0.5s = 2s total duration for the background gradient

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
  <div 
    ref="elementRef" 
    class="questionnaire-container fixed inset-0 z-100 w-full h-full flex flex-col items-center p-4 text-white overflow-y-auto transition-all duration-500"
    :class="{
      'justify-center': currentView !== 'results',
      'justify-start md:pt-20 pt-10': currentView === 'results'
    }"
  >
    
    <!-- Delay content rendering until external gradient finishes if needed or just let it be handled by child components (HSPIntro handles its own enter fade) -->
    <template v-if="contentReady || currentView !== 'intro'">
      <!-- Intro Screen -->
      <HSPIntro 
        v-if="currentView === 'intro'"
        ref="introRef"
        :total-questions="totalQuestions" 
        :sections-count="sections.length"
        @start="handleStart"
      />
      
      <!-- Quiz Screen -->
      <HSPQuiz 
        v-if="currentView === 'quiz'"
        ref="quizRef"
        :sections="sections"
        :questions="questions"
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
        @next="handleNext"
        @previous="previousQuestion"
      />
      
      <!-- Results Screen -->
      <HSPResults 
        v-if="currentView === 'results'"
        ref="resultsRef"
        :total-score="totalScore"
        :total-questions="totalQuestions"
        :sensitivity-level="sensitivityLevel"
        :sections="sections"
        :section-scores="sectionScores"
        :questions-per-section="questionsPerSection"
        :dominant-profile="dominantProfile"
        @restart="handleRestart"
      />
    </template>
  </div>
</template>
