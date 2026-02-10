<script setup>
import HSPIntro from './hsp/HSPIntro.vue';
import HSPQuiz from './hsp/HSPQuiz.vue';
import HSPResults from './hsp/HSPResults.vue';
import { useAnimationsStore } from "~/stores/animations";
import { useHSPQuiz } from "~/app/composables/useHSPQuiz";

const { $gsap } = useNuxtApp();
const animationsStore = useAnimationsStore();
const {
  currentView,
  currentQuestionIndex,
  answers,
  ratings,
  sections,
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
  dominantProfile,
  startQuiz,
  selectAnswer,
  nextQuestion,
  previousQuestion,
  restart
} = useHSPQuiz();

const elementRef = ref(null);

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
