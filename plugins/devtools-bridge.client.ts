import { useGameStore } from '~/stores/game'
import { useAnimationsStore } from '~/stores/animations'
import { useAudioStore } from '~/stores/audio'
import { SCENE_IDS } from '~/app/data/constants'
import { gameData } from '~/app/data/game'
import { getFlagsForScene } from '~/app/data/sceneFlagRequirements'

export default defineNuxtPlugin((_nuxtApp) => {
  // Only play in dev mode
  if (!import.meta.dev) return

  // IMPORTANT: Do NOT run the bridge inside the DevTools iframe itself!
  // The bridge is the RECEIVER in the main window.
  // The DevToolsView is the SENDER in the iframe.
  if (window.self !== window.top) return

  const channel = new BroadcastChannel('game-devtools')
  const gameStore = useGameStore()
  const animationsStore = useAnimationsStore()
  const audioStore = useAudioStore()
  const { $gsap } = useNuxtApp()

  // Listen for commands from DevTools UI

  channel.onmessage = (event) => {
    const { type, payload } = event.data

    switch (type) {
      case 'RESET_INTRO':
        resetIntro()
        break

      case 'SKIP_TO_GAME':
        skipToGame()
        break

      case 'SKIP_TO_END':
        skipToEnd()
        break

      case 'TOGGLE_UI':
        gameStore.toggleForceShowUI()
        break

      case 'SET_PLAYBACK_RATE':
        if (typeof payload === 'number') {
          audioStore.setPlaybackRate(payload)
          $gsap.globalTimeline.timeScale(payload)
        }
        break

      case 'SCROLL_TO':
        if (payload === 'top' || payload === 'bottom') {
          scrollTo(payload)
        }
        break

      case 'REQUEST_SYNC':
        syncState()
        break
    }
  }

  // Sync state back to DevTools
  const syncState = () => {
    channel.postMessage({
      type: 'STATE_SYNC',
      payload: {
        forceShowUI: gameStore.forceShowUI,
        playbackRate: audioStore.playbackRate, // assuming audioStore has this
        currentSceneId: gameStore.currentSceneId,
      },
    })
  }

  // Watch for changes to sync
  watch(
    () => gameStore.forceShowUI,
    () => syncState()
  )
  watch(
    () => audioStore.playbackRate,
    () => syncState()
  )

  // Initial sync
  setTimeout(syncState, 500)

  // --- Logic copied from original DevTools.vue ---

  const scrollTo = (position: 'top' | 'bottom') => {
    console.log('[GameBridge] Executing scrollTo:', position)
    const experienceEl = document.getElementById('experience')
    if (!experienceEl) {
      console.error('[GameBridge] element #experience not found!')
      return
    }

    const targetY =
      position === 'top'
        ? experienceEl.offsetTop
        : experienceEl.offsetTop + experienceEl.offsetHeight

    console.log('[GameBridge] targetY calculated:', targetY)

    // @ts-expect-error: Necessary for DevTools bridge
    if (window.lenis) {
      console.log('[GameBridge] Using Lenis for scroll')
      // @ts-expect-error: Necessary for DevTools bridge
      if (position === 'top') {
        // @ts-expect-error: Necessary for DevTools bridge
        window.lenis.start()
      }
      // @ts-expect-error: Necessary for DevTools bridge
      window.lenis.scrollTo(targetY, { immediate: true })
    } else {
      console.log('[GameBridge] Using native window.scrollTo')
      window.scrollTo({
        top: targetY,
        behavior: 'instant',
      })
    }
  }

  const resetIntro = () => {
    animationsStore.setScrollLocked(false)
    gameStore.resetGame()
    animationsStore.setCursorVariant('light')
    setTimeout(() => {
      scrollTo('top')
    }, 50)
  }

  const skipToGame = () => {
    gameStore.setIntroPlayed()
    gameStore.setIntroAnimationPhase('complete')
    gameStore.setIntroBlurAmount(0)
    scrollTo('bottom')
    setTimeout(() => {
      animationsStore.setScrollLocked(true)
      if (gameStore.currentScene?.audio) {
        const audioPath = gameStore.currentScene.audio.startsWith('/')
          ? gameStore.currentScene.audio
          : `/audios/${gameStore.currentScene.audio}`
        if (audioStore.currentAudio !== audioPath || !audioStore.isPlaying) {
          audioStore.playAudio(audioPath)
        }
      }
    }, 100)
  }

  const skipToEnd = () => {
    // 1. Ensure we are in a state where game logic runs (skipped intro)
    gameStore.setIntroPlayed()
    gameStore.setIntroAnimationPhase('complete')
    gameStore.setIntroBlurAmount(0)
    scrollTo('bottom')

    // 2. Lock scroll
    setTimeout(() => {
      animationsStore.setScrollLocked(true)

      // 3. Jump to Game End scene with resolved flags
      const resolvedFlags = getFlagsForScene(
        SCENE_IDS.GAME_END,
        gameData.initialFlags
      )
      gameStore.goToScene(SCENE_IDS.GAME_END, resolvedFlags)
    }, 100)
  }
})
