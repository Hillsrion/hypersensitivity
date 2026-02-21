<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { SCENE_IDS } from "../../data/constants";
import { gameData } from "../../data/game";
import { getFlagsForScene } from "../../data/sceneFlagRequirements";
import { useAnimationsStore } from "~/stores/animations";
import { useAudioStore } from "~/stores/audio";
import { useHSPQuiz } from "~/app/composables/useHSPQuiz";

const gameStore = useGameStore();
const animationsStore = useAnimationsStore();
const audioStore = useAudioStore();
const quiz = useHSPQuiz();
const route = useRoute();
const { $gsap } = useNuxtApp();

const playbackRate = ref(audioStore.playbackRate);

watch(playbackRate, (rate) => {
  audioStore.setPlaybackRate(rate);
  $gsap.globalTimeline.timeScale(rate);
}, { immediate: true });

const scrollTo = (position: 'top' | 'bottom') => {
  const experienceEl = document.getElementById('experience');
  if (!experienceEl) return;

  const targetY = position === 'top' 
    ? experienceEl.offsetTop 
    : experienceEl.offsetTop + experienceEl.offsetHeight;

    // @ts-ignore
    if (window.lenis) {
         // @ts-ignore
        if (position === 'top') {
             // @ts-ignore
             window.lenis.start(); // Force start to allow scrolling up if locked
        }
        // @ts-ignore
        window.lenis.scrollTo(targetY, { immediate: true });
    } else {
        window.scrollTo({
            top: targetY,
            behavior: 'instant'
        });
    }
};

const resetIntro = () => {
    // 1. Unlock scroll first to allow lenis to work
    animationsStore.setScrollLocked(false);
    
    // 2. Reset Game State
    gameStore.resetGame();
    
    // 3. Reset Animations State if needed (cursor, etc)
    animationsStore.setCursorVariant('light'); // Intro starts with light? or check logic
    
    // 4. Scroll to top
    setTimeout(() => {
        scrollTo('top');
    }, 50);
};

const skipToGame = () => {
    // 1. Set Game State to Playing
    gameStore.setIntroPlayed();
    gameStore.setIntroAnimationPhase('complete');
    gameStore.setIntroBlurAmount(0);
    
    // 2. Scroll to bottom
    scrollTo('bottom');
    
    // 3. Lock Scroll (simulating end of intro)
    setTimeout(() => {
        animationsStore.setScrollLocked(true);
        
        // 4. Ensure Audio Starts
        // If current scene has audio, play it
        if (gameStore.currentScene?.audio) {
             const audioPath = gameStore.currentScene.audio.startsWith("/")
            ? gameStore.currentScene.audio
            : `/audios/${gameStore.currentScene.audio}`;
            
            if (audioStore.currentAudio !== audioPath || !audioStore.isPlaying) {
                audioStore.playAudio(audioPath);
            }
        }
    }, 100);
}

onMounted(() => {
  // Dev shortcut: scroll to a specific component on pageload
  const target = route.query.scroll || (import.meta.env.DEV ? "experience" : null);
  if (target) {
    // We wait a bit for Lenis and ScrollTrigger to be fully initialized and for the page to render
    setTimeout(() => {
      const element = document.getElementById(String(target));
      // @ts-ignore
      if (element && window.lenis) {
        // @ts-ignore
        window.lenis.scrollTo(element, { immediate: true });
      }
    }, 500);
  }
});
const getSceneLabel = (id: string) => {
  const scene = gameData.scenes[id];
  if (!scene) return id;
  
  const shortId = id.replace(/^(dayOne|dayTwo)/, '');
  return `Jour ${scene.day} - ${scene.title} - ${shortId}`;
};

/**
 * Jump to a scene while automatically resolving the flags needed
 * so the scene (and its successors) unfold logically.
 */
const jumpToScene = (sceneId: string) => {
  const resolvedFlags = getFlagsForScene(sceneId, gameData.initialFlags);
  gameStore.goToScene(sceneId, resolvedFlags);
};
</script>

<template>
  <div class="fixed bottom-4 right-4 z-99999 flex flex-col gap-2 p-4 bg-black/80 rounded-lg text-white text-xs font-mono">
    <div class="font-bold mb-1 border-b border-white/20 pb-1">DEV TOOLS</div>
    
    <div class="flex flex-col gap-1">
      <template v-if="!gameStore.showQuestionnaire">
        <button 
          class="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-left transition-colors"
          @click="scrollTo('top')"
        >
        Scroll Top (XP)
      </button>
      
      <button 
        class="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-left transition-colors"
        @click="scrollTo('bottom')"
      >
        Scroll Bottom (XP)
      </button>

      <div class="h-px bg-white/10 my-1"></div>

      <button 
        class="px-2 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-left transition-colors"
        @click="resetIntro"
      >
        Reset Intro
      </button>

      <button 
        class="px-2 py-1 bg-green-500/20 hover:bg-green-500/40 text-green-300 rounded text-left transition-colors"
        @click="skipToGame"
      >
        Skip to Game
      </button>

      <button 
        class="px-2 py-1 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded text-left transition-colors"
        @click="jumpToScene(SCENE_IDS.GAME_END)"
      >
        Skip to End
      </button>

      <div class="h-px bg-white/10 my-1"></div>

      <div class="flex flex-col gap-1 px-2 py-1 bg-white/5 rounded">
        <div class="flex justify-between items-center text-[10px] text-gray-400">
           <span>Speed</span>
           <span>{{ playbackRate }}x</span>
        </div>
        <input 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1" 
          v-model.number="playbackRate"
          class="w-full accent-white h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div class="h-px bg-white/10 my-1"></div>

      <button 
        class="px-2 py-1 rounded text-left transition-colors"
        :class="gameStore.forceShowUI ? 'bg-orange-500/40 text-orange-200 outline outline-1 outline-orange-500' : 'bg-white/10 hover:bg-white/20'"
        @click="gameStore.toggleForceShowUI()"
      >
          UI: {{ gameStore.forceShowUI ? 'Forcée' : 'Par défaut' }}
        </button>

        <div class="h-px bg-white/10 my-1"></div>
      </template>

      <template v-if="gameStore.showQuestionnaire">
        <div class="text-[10px] text-gray-500 mb-1 px-1 uppercase tracking-wider">HSP Questionnaire</div>
        
        <button 
          v-if="quiz.currentView.value !== 'results'"
          class="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded text-left transition-colors"
          @click="quiz.completeWithFakeResults()"
        >
          {{ (quiz.currentView.value === 'intro' || quiz.currentQuestionIndex.value === 0) ? 'Passer directement à la fin' : 'Terminer avec faux résultats' }}
        </button>

        <button 
          class="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-left transition-colors mt-1"
          @click="quiz.restart"
        >
          Reset Quiz
        </button>

        <div class="h-px bg-white/10 my-1"></div>
      </template>

      <template v-if="!gameStore.showQuestionnaire">
        <div class="flex flex-col gap-1 px-2 py-1 bg-white/5 rounded">
          <label class="text-[10px] text-gray-400">Jump to Scene</label>
        <select 
          class="w-full bg-black/50 border border-white/20 rounded px-1 py-1 text-[10px] text-white focus:outline-none focus:border-white/50"
          :value="gameStore.currentSceneId"
          @change="(e: Event) => jumpToScene((e.target as HTMLSelectElement).value)"
        >
          <option v-for="(id, key) in SCENE_IDS" :key="id" :value="id">
            {{ getSceneLabel(id) }}
          </option>
        </select>
      </div>
      </template>
    </div>
  </div>
</template>
