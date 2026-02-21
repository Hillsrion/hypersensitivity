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

const isMinimized = ref(false);
const showIntroOptions = ref(true);
const showExperienceOptions = ref(false);

const checkScrollPosition = () => {
  const experienceEl = document.getElementById('experience');
  if (!experienceEl) return;

  const scrollY = window.scrollY;
  const experienceTop = experienceEl.offsetTop;
  
  // Show intro options if we are above the experience section minus some threshold
  showIntroOptions.value = scrollY < experienceTop - window.innerHeight;
  // Show experience options if we are near or past the experience section
  showExperienceOptions.value = scrollY >= experienceTop - window.innerHeight;
};

let scrollRafId = 0;
const onScroll = () => {
    cancelAnimationFrame(scrollRafId);
    scrollRafId = requestAnimationFrame(checkScrollPosition);
};

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

const skipIntro = () => {
    // Check env variable for SKIP_INTRO from stores/animations.ts:L5 logic
    const SKIP_INTRO = import.meta.env.VITE_SKIP_INTRO === 'true';

    // 1. Stop audio only if we didn't initially load with skip intro
    if (!SKIP_INTRO) {
        audioStore.stopCurrentAudio(false);
    }
    
    // 2. Complete Title Animations
    animationsStore.landing.mainTitle.entry.started = true;
    animationsStore.landing.mainTitle.entry.completed = true;
    animationsStore.landing.mainTitle.exit.started = true;
    animationsStore.landing.mainTitle.exit.completed = true;
    
    // 3. Complete Intro Animations (SoundIntroduction)
    animationsStore.landing.intro.entry.started = true;
    animationsStore.landing.intro.entry.completed = true;
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
  // Check env variable for SKIP_INTRO from stores/animations.ts:L5 logic
  const SKIP_INTRO = import.meta.env.VITE_SKIP_INTRO === 'true';
  if (SKIP_INTRO) {
    skipIntro();
  }

  // Dev shortcut: scroll to a specific component on pageload
  // e.g. VITE_START_POSITION=experience
  const target = route.query.scroll || import.meta.env.VITE_START_POSITION || null;
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

  window.addEventListener('scroll', onScroll, { passive: true });
  // Initial check
  setTimeout(checkScrollPosition, 500);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  cancelAnimationFrame(scrollRafId);
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
  <div class="fixed bottom-4 right-4 z-99999 flex flex-col gap-2">
    <!-- Minimized Button -->
    <button 
      v-if="isMinimized"
      @click="isMinimized = false"
      class="p-3 bg-black/80 hover:bg-black text-white rounded-full shadow-lg border border-white/20 transition-all flex items-center justify-center opacity-50 hover:opacity-100 group"
      title="Ouvrir DevTools"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 group-hover:text-white transition-colors"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
    </button>

    <!-- Expanded Panel -->
    <div 
      v-else
      class="flex flex-col gap-2 p-4 bg-black/80 rounded-lg text-white text-xs font-mono border border-white/10 shadow-2xl backdrop-blur-md"
    >
      <div class="flex justify-between items-center mb-1 border-b border-white/20 pb-2">
        <div class="font-bold">DEV TOOLS</div>
        <button 
          @click="isMinimized = true"
          class="text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors shrink-0 flex items-center gap-1"
          title="Minimiser"
        >
          <span>Réduire</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
      </div>
      
      <div class="flex flex-col gap-1 max-h-[80vh] overflow-y-auto pr-1">
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

        <template v-if="showIntroOptions">
          <button 
            class="px-2 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-left transition-colors"
            @click="resetIntro"
          >
            Reset Intro
          </button>

          <button 
            class="px-2 py-1 bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 rounded text-left transition-colors"
            @click="skipIntro"
          >
            Skip Intro
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
        </template>

        <template v-if="showExperienceOptions">
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
        </template>

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

        <template v-if="!gameStore.showQuestionnaire && showExperienceOptions">
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
  </div>
</template>
