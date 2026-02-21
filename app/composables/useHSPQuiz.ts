import quizData from '@/app/data/hsp-quiz.json';

const currentView = ref('intro');
const currentQuestionIndex = ref(0);
const { ratings, sections, questions: quizQuestions, profiles } = quizData;
const totalQuestions = quizQuestions.length;
const answers = ref(Array(totalQuestions).fill(null));

export const useHSPQuiz = () => {
  const questions = quizQuestions;
  const questionsPerSection = totalQuestions / sections.length;
  
  const currentQuestion = computed(() => questions[currentQuestionIndex.value] || questions[0]);
  const currentSectionIndex = computed(() => Math.floor(currentQuestionIndex.value / questionsPerSection));
  const isLastQuestion = computed(() => currentQuestionIndex.value === totalQuestions - 1);
  const progressPercent = computed(() => Math.round((currentQuestionIndex.value + 1) / totalQuestions * 100));
  const displaySectionName = computed(() => sections[currentSectionIndex.value]?.name || sections[0]?.name || '');

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

  function getSectionScore(sectionIndex: number) {
    const start = sectionIndex * questionsPerSection;
    const end = start + questionsPerSection;
    return answers.value.slice(start, end).reduce((sum, val) => sum + (val ?? 0), 0);
  }

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

  function startQuiz() {
    currentView.value = 'quiz';
  }

  function selectAnswer(value: number) {
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

  function completeWithFakeResults() {
    // Fill with random answers (between 1 and 4 or whatever the ratings are)
    // Ratings are usually 0, 1, 2, 3 or similar
    // Let's check ratings in quizData. In HSPQuiz.vue it says ratings are passed.
    answers.value = answers.value.map(() => Math.floor(Math.random() * 4));
    currentView.value = 'results';
  }

  return {
    // State
    currentView,
    currentQuestionIndex,
    answers,
    
    // Data
    ratings,
    sections,
    questions,
    profiles,
    totalQuestions,
    questionsPerSection,
    
    // Computed
    currentQuestion,
    currentSectionIndex,
    isLastQuestion,
    progressPercent,
    displaySectionName,
    totalScore,
    sensitivityLevel,
    sectionScores,
    dominantProfile,
    
    // Methods
    getSectionScore,
    startQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    restart,
    completeWithFakeResults
  };
};

