import { defineStore } from 'pinia'

export const useAnimationsStore = defineStore('animations', {
  state: () => {
    return {
      skipIntro: false,
      landing: {
        enabled: true,
        complete: false,
        intro: {
          entry: {
            started: false,
            completed: false,
          },
          exit: {
            started: false,
            completed: false,
          },
        },
        mainTitle: {
          entry: {
            started: false,
            completed: false,
          },
          exit: {
            started: false,
            completed: false,
          },
        },
      },
      aurora: {
        color: 'green',
        visible: false,
        colorStep: 1,
        autoAnimate: false,
        zIndex: 0,
      },
      cursor: {
        variant: 'light' as 'dark' | 'light',
      },
      audiowave: {
        variant: 'light' as 'dark' | 'light',
      },
      scroll: {
        locked: false,
      },
    }
  },
  actions: {
    setCursorVariant(variant: 'dark' | 'light') {
      this.cursor.variant = variant
    },
    setAudiowaveVariant(variant: 'dark' | 'light') {
      this.audiowave.variant = variant
    },
    setAuroraColor(color: string) {
      this.aurora.color = color
    },
    setAuroraVisibility(visible: boolean) {
      this.aurora.visible = visible
    },
    setAuroraStep(step: number) {
      this.aurora.colorStep = step
    },
    setAuroraAutoAnimate(enabled: boolean) {
      this.aurora.autoAnimate = enabled
    },
    setAuroraZIndex(zIndex: number) {
      this.aurora.zIndex = zIndex
    },
    onTitleEntryComplete() {
      this.landing.mainTitle.entry.completed = true
    },
    startTitleExit() {
      this.landing.mainTitle.exit.started = true
    },
    onTitleExitComplete() {
      this.landing.mainTitle.exit.completed = true
      this.startIntroEntry()
    },
    onIntroEntryComplete() {
      this.landing.intro.entry.completed = true
    },
    startIntroExit() {
      this.landing.intro.exit.started = true
    },
    onIntroExitComplete() {
      this.landing.intro.exit.completed = true
    },
    startIntroEntry() {
      this.landing.intro.entry.started = true
    },
    setScrollLocked(locked: boolean) {
      this.scroll.locked = locked
    },
  },
})
