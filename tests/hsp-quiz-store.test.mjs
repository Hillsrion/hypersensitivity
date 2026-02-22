import test from 'node:test';
import { strict as assert } from 'node:assert';
import { createPinia, setActivePinia } from 'pinia';
import { useHspQuizStore } from '../app/stores/hspQuiz.ts';
import quizData from '../app/data/hsp-quiz.json' with { type: 'json' };

test('hspQuizStore', async (t) => {
  // Setup Pinia before each test
  t.beforeEach(() => {
    setActivePinia(createPinia());
  });

  await t.test('initial state is correct', () => {
    const store = useHspQuizStore();
    
    assert.equal(store.currentView, 'intro');
    assert.equal(store.currentQuestionIndex, 0);
    assert.equal(store.answers.length, quizData.questions.length);
    assert.ok(store.answers.every(a => a === null));
  });

  await t.test('startQuiz changes view to quiz', () => {
    const store = useHspQuizStore();
    
    store.startQuiz();
    assert.equal(store.currentView, 'quiz');
  });

  await t.test('selectAnswer updates answers array', () => {
    const store = useHspQuizStore();
    
    // Select answer '2' for the first question
    store.selectAnswer(2);
    assert.equal(store.answers[0], 2);
    assert.equal(store.answers[1], null);
  });

  await t.test('nextQuestion and previousQuestion navigation', () => {
    const store = useHspQuizStore();
    
    // Check next behavior
    store.nextQuestion();
    assert.equal(store.currentQuestionIndex, 1);
    
    // Check previous behavior
    store.previousQuestion();
    assert.equal(store.currentQuestionIndex, 0);
    
    // Should not go below 0
    store.previousQuestion();
    assert.equal(store.currentQuestionIndex, 0);
  });

  await t.test('nextQuestion on last question changes view to results', () => {
    const store = useHspQuizStore();
    
    store.currentQuestionIndex = store.totalQuestions - 1;
    store.nextQuestion();
    
    assert.equal(store.currentView, 'results');
    assert.equal(store.currentQuestionIndex, store.totalQuestions - 1);
  });

  await t.test('restart resets state to default', () => {
    const store = useHspQuizStore();
    
    // Setup modified state
    store.currentView = 'results';
    store.currentQuestionIndex = 5;
    store.answers[0] = 3;
    
    store.restart();
    
    assert.equal(store.currentView, 'intro');
    assert.equal(store.currentQuestionIndex, 0);
    assert.ok(store.answers.every(a => a === null));
  });

  await t.test('completeWithFakeResults generates fake answers and goes to results', () => {
    const store = useHspQuizStore();
    
    store.completeWithFakeResults();
    
    assert.equal(store.currentView, 'results');
    assert.ok(store.answers.every(a => a !== null && a >= 0 && a <= 3)); // Assuming 0-3 rating mapping logic
  });

  await t.test('computed scores and profiles', () => {
    const store = useHspQuizStore();
    
    // Simulate all answers as 1
    store.answers = Array(store.totalQuestions).fill(1);
    
    assert.equal(store.totalScore, store.totalQuestions);
    assert.equal(store.sensitivityLevel.label, 'Sensibilité standard');
    
    // Simulate all sections score logic
    const sectionIndexToTest = 0;
    const testScore = store.getSectionScore(sectionIndexToTest);
    assert.equal(testScore, store.questionsPerSection); // 1 * questionsPerSection
    
    // Check section sum maps correctly to array computation
    assert.equal(store.sectionScores[sectionIndexToTest], store.questionsPerSection);
    
    // Simulate all answers as max (e.g., 3)
    store.answers = Array(store.totalQuestions).fill(3);
    assert.equal(store.totalScore, store.totalQuestions * 3);
    assert.ok(store.dominantProfile !== null);
  });
});
