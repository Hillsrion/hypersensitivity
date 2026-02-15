<script setup lang="ts">
import { useGameStore } from "~/stores/game";
import { useAnimationsStore } from "~/stores/animations";
import { useAudioStore } from "~/stores/audio";

const gameStore = useGameStore();
const animationsStore = useAnimationsStore();
const audioStore = useAudioStore();
const route = useRoute();

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
</script>

<template>
  <div class="fixed bottom-4 right-4 z-99999 flex flex-col gap-2 p-4 bg-black/80 rounded-lg text-white text-xs font-mono">
    <div class="font-bold mb-1 border-b border-white/20 pb-1">DEV TOOLS</div>
    
    <div class="flex flex-col gap-1">
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

      <div class="h-px bg-white/10 my-1"></div>

      <button 
        class="px-2 py-1 rounded text-left transition-colors"
        :class="gameStore.forceShowUI ? 'bg-orange-500/40 text-orange-200 outline outline-1 outline-orange-500' : 'bg-white/10 hover:bg-white/20'"
        @click="gameStore.toggleForceShowUI()"
      >
        UI: {{ gameStore.forceShowUI ? 'Forcée' : 'Par défaut' }}
      </button>
    </div>
  </div>
</template>
