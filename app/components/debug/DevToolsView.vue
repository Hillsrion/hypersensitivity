<script setup lang="ts">
const channel = ref<BroadcastChannel | null>(null)
const isConnected = ref(false)

type DevtoolsSyncPayload = {
  forceShowUI?: boolean
  playbackRate?: number
}

type DevtoolsInboundMessage = {
  type: string
  payload?: unknown
}

type DevtoolsCommandMessage =
  | { type: 'REQUEST_SYNC' }
  | { type: 'RESET_INTRO' }
  | { type: 'SKIP_TO_GAME' }
  | { type: 'SKIP_TO_END' }
  | { type: 'TOGGLE_UI' }
  | { type: 'SCROLL_TO'; payload: 'top' | 'bottom' }
  | { type: 'SET_PLAYBACK_RATE'; payload: number }

// Local state for UI
const playbackRate = ref(1)
const forceShowUI = ref(false)

onMounted(() => {
  channel.value = new BroadcastChannel('game-devtools')
  isConnected.value = true

  // Listen for sync messages from the game
  channel.value.onmessage = (event) => {
    const { type, payload } = event.data as DevtoolsInboundMessage
    if (type === 'STATE_SYNC') {
      const syncPayload = (payload ?? {}) as DevtoolsSyncPayload

      if (typeof syncPayload.forceShowUI === 'boolean') {
        forceShowUI.value = syncPayload.forceShowUI
      }
      if (typeof syncPayload.playbackRate === 'number') {
        playbackRate.value = syncPayload.playbackRate
      }
    }
  }

  // Request initial state
  sendCommand({ type: 'REQUEST_SYNC' })

  // Force cursor to be visible
  document.body.classList.add('devtools-mode')
})

onUnmounted(() => {
  if (channel.value) {
    channel.value.close()
  }
  document.body.classList.remove('devtools-mode')
})

const sendCommand = (message: DevtoolsCommandMessage) => {
  if (channel.value) {
    channel.value.postMessage(message)
  }
}

const resetIntro = () => sendCommand({ type: 'RESET_INTRO' })
const skipToGame = () => sendCommand({ type: 'SKIP_TO_GAME' })
const skipToEnd = () => sendCommand({ type: 'SKIP_TO_END' })
const toggleForceShowUI = () => {
  // We send the toggle command, the game updates state and sends it back via sync
  sendCommand({ type: 'TOGGLE_UI' })
}
const scrollTo = (position: 'top' | 'bottom') =>
  sendCommand({ type: 'SCROLL_TO', payload: position })

watch(playbackRate, (rate) => {
  sendCommand({ type: 'SET_PLAYBACK_RATE', payload: rate })
})
</script>

<template>
  <div class="bg-[#111] text-white min-h-screen p-4 font-mono text-xs">
    <div class="max-w-md mx-auto flex flex-col gap-4">
      <div
        class="font-bold border-b border-white/20 pb-2 mb-2 flex justify-between items-center"
      >
        <span>HYPERSENSITIVITY TOOLS</span>
        <span
          class="text-[10px] uppercase"
          :class="isConnected ? 'text-green-400' : 'text-red-400'"
        >
          {{ isConnected ? 'Connected' : 'Disconnected' }}
        </span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button
          class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-left transition-colors flex items-center gap-2"
          @click="scrollTo('top')"
        >
          <span class="i-carbon-arrow-up" /> Scroll Top (XP)
        </button>

        <button
          class="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-left transition-colors flex items-center gap-2"
          @click="scrollTo('bottom')"
        >
          <span class="i-carbon-arrow-down" /> Scroll Bottom (XP)
        </button>
      </div>

      <div class="h-px bg-white/10" />

      <div class="grid grid-cols-2 gap-2">
        <button
          class="px-3 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded text-center transition-colors border border-red-500/20"
          @click="resetIntro"
        >
          Reset Intro
        </button>
        <button
          class="px-3 py-2 bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 rounded text-center transition-colors border border-purple-500/20"
          @click="skipToEnd"
        >
          Skip to End
        </button>
      </div>

      <div class="grid grid-cols-1 gap-2">
        <button
          class="px-3 py-2 bg-green-500/20 hover:bg-green-500/40 text-green-300 rounded text-center transition-colors border border-green-500/20"
          @click="skipToGame"
        >
          Skip to Game
        </button>
      </div>

      <div class="h-px bg-white/10" />

      <div class="bg-white/5 rounded p-3 flex flex-col gap-2">
        <div class="flex justify-between items-center text-gray-400">
          <span class="text-[10px] uppercase tracking-wider"
            >Playback Speed</span
          >
          <span class="font-bold text-white">{{ playbackRate }}x</span>
        </div>
        <input
          v-model.number="playbackRate"
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          class="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
        />
        <div class="flex justify-between text-[8px] text-gray-500 font-sans">
          <span>0.1x</span>
          <span>1.0x</span>
          <span>5.0x</span>
        </div>
      </div>

      <div class="h-px bg-white/10" />

      <button
        class="px-3 py-3 rounded text-left transition-all border block w-full relative overflow-hidden"
        :class="
          forceShowUI
            ? 'bg-orange-500/20 text-orange-200 border-orange-500/50'
            : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-400'
        "
        @click="toggleForceShowUI"
      >
        <div class="flex justify-between items-center relative z-10">
          <span class="font-bold">Force Message UI</span>
          <span
            :class="
              forceShowUI
                ? 'i-carbon-checkbox-checked text-lg'
                : 'i-carbon-checkbox text-lg'
            "
          />
        </div>
      </button>

      <div class="mt-4 text-[10px] text-gray-600 text-center">
        Changes reflect in the main game window instantly.
      </div>
    </div>
  </div>
</template>

<style>
/* Force cursor visibility in DevTools, overriding main.css */
body.devtools-mode,
body.devtools-mode * {
  cursor: auto !important;
}
</style>

<style scoped>
/* Custom range slider styling if needed */
input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: white;
  margin-top: -4px;
}
input[type='range']::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}
</style>
