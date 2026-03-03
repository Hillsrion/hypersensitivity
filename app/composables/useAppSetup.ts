import type { Ref } from 'vue'

import { gameData } from '~/app/data/game'
import mainData from '~/app/data/main.json'
import type { RawAudioTiming } from '~/app/types/game'

interface AudioItem {
  path: string
  transcript: string
  timings?: RawAudioTiming[]
}

interface LenisRef {
  lenis?: {
    start: () => void
    stop: () => void
  }
}

export const useAppSetup = (lenisRef: Ref<LenisRef | null>) => {
  const audioStore = useAudioStore()
  const animations = useAnimationsStore()
  const route = useRoute()

  const timingsModules = import.meta.glob('../data/timings/*.json', {
    eager: true,
    import: 'default',
  }) as Record<string, RawAudioTiming[]>

  const getTimings = (audioPath?: string) => {
    if (!audioPath) return undefined
    const filename = audioPath.replace('/audios/', '').replace('.mp3', '')
    const key = `../data/timings/${filename}.json`
    return timingsModules[key] || []
  }

  const introductionData = {
    ...mainData.introduction,
    timings: getTimings(mainData.introduction.audio),
  }

  const creditsLinks = {
    development: 'https://ismaelsebbane.fr',
    design: 'https://anabanana.fr',
  }

  // Watch loading state and control Lenis scrolling
  watch(
    [
      () => animations.landing.intro.entry.completed,
      () => animations.scroll.locked,
    ],
    ([introCompleted, scrollLocked]) => {
      if (!lenisRef.value?.lenis) return

      if (introCompleted && !scrollLocked) {
        // Re-enable scrolling after loading is complete and if not locked
        lenisRef.value.lenis.start()
      } else {
        // Locking scroll
        lenisRef.value.lenis.stop()
      }
    },
    { immediate: true }
  )

  /**
   * Collect all audio items from the game scenes, deduplicating by path.
   * - Scene-level audio: aggregates all dialogue texts and timings under a single audio entry.
   * - Dialogue-level audio: added individually (backward-compat / overrides).
   */
  const collectGameAudios = () => {
    const collected: AudioItem[] = []

    const addIfNew = (entry: AudioItem) => {
      if (!collected.find((a) => a.path === entry.path)) {
        collected.push(entry)
      }
    }

    Object.values(gameData.scenes).forEach((scene) => {
      // Scene-level audio: merge all dialogue texts and timings into one entry
      if (scene.audio) {
        const fullPath = scene.audio.startsWith('/')
          ? scene.audio
          : `/audios/${scene.audio}`

        const allTimings = scene.dialogues.flatMap((d) => d.timings ?? [])
        const transcript = scene.dialogues.map((d) => d.text ?? '').join(' ')

        addIfNew({ path: fullPath, transcript, timings: allTimings })
      }
    })

    return collected
  }

  onMounted(() => {
    if (route.path === '/game-tools-view') return
    scrollTo(0, 0)
    if (!animations.landing.intro.entry.completed) {
      lenisRef.value?.lenis?.stop()
    }

    // Build the full audio preload list: testimonies + intro + all game scenes
    const audioList = [
      // Testimony audios
      ...mainData.testimonies
        .filter((item) => Boolean(item.audio))
        .map((item) => ({
          path: item.audio as string,
          transcript: item.content,
          timings: getTimings(item.audio as string),
        })),
      // Intro narration
      {
        path: '/audios/alix-intro.mp3',
        transcript: introductionData.content,
        timings: introductionData.timings,
      },
      // Game scene audios
      ...collectGameAudios(),
    ]

    audioStore.preloadList(audioList)

    // Expose Lenis to window for DevTools
    if (import.meta.dev && import.meta.client) {
      watch(
        () => lenisRef.value?.lenis,
        (lenis) => {
          if (lenis) {
            // @ts-expect-error: Necessary for DevTools bridge
            window.lenis = lenis
          }
        },
        { immediate: true }
      )
    }
  })

  onUnmounted(() => {
    // Release all audio resources to avoid memory leaks on route teardown
    audioStore.cleanupAudio()
  })

  return {
    introductionData,
    creditsLinks,
  }
}
