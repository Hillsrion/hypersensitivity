import { defineStore } from 'pinia'

import { devConfig } from '../config/dev'
import { ENTRY_ANNOTATION_AUTO_COMPLETE_DELAY_MS } from '../constants/durations'
import { gameData } from '../data/game'
import {
  MILESTONES,
  MILESTONE_ORDER,
  getMilestoneForScene,
} from '../data/milestones'
import type {
  Choice,
  DialogueLine,
  GameFlags,
  IntroAnimationPhase,
  Milestone,
  Scene,
} from '../types/game'
import { useAnimationsStore } from './animations'
import { useAudioStore } from './audio'
import { applyChoiceEffects, applyDialogueEnergyChange } from './game/effects'
import {
  clearScheduledTimer,
  computeAnnotationDelayMs,
  getEntryAnnotationPhase,
  isEntryAnnotationPhase,
  scheduleTimer,
  shouldAutoCompleteAnnotation,
} from './game/intro'
import {
  MENU_CLOSE_DELAY_MS,
  finalizeClosingStatus,
  getMenuClosingStatus,
  getMenuOpenStatus,
  getToggleTargetMenuStatus,
} from './game/menu'
import { loadSnapshot, saveSnapshot } from './game/persistence'
import {
  findFirstValidSceneIdInMilestone,
  resolveNextProgressionStep,
} from './game/progression'
import {
  getAvailableChoices,
  getCurrentDay,
  getCurrentDialogue,
  getCurrentScene,
  getCurrentTitle,
  getEnergyPercentage,
  getFirstDialogueAnnotation,
  getHasChoices,
  getHasDialogues,
  getIsLastDialogue,
  getMilestones,
  getReachedMilestonesList,
  isChoiceDisabled,
  isFirstDialogueOfInitialScene,
} from './game/selectors'
import {
  STORAGE_KEY,
  createInitialFlags,
  createInitialGameState,
  ensureInitialMilestone,
} from './game/state'

export const useGameStore = defineStore('game', {
  state: createInitialGameState,

  getters: {
    currentScene(state): Scene | null {
      return getCurrentScene(gameData.scenes, state.currentSceneId)
    },

    currentDialogue(state): DialogueLine | null {
      return getCurrentDialogue(
        gameData.scenes,
        state.currentSceneId,
        state.currentDialogueIndex
      )
    },

    isLastDialogue(state): boolean {
      return getIsLastDialogue(
        gameData.scenes,
        state.currentSceneId,
        state.currentDialogueIndex
      )
    },

    hasDialogues(state): boolean {
      return getHasDialogues(gameData.scenes, state.currentSceneId)
    },

    hasChoices(state): boolean {
      return getHasChoices(gameData.scenes, state.currentSceneId)
    },

    availableChoices(state): Choice[] {
      return getAvailableChoices(gameData.scenes, state.currentSceneId)
    },

    isChoiceDisabled(state): (choice: Choice) => boolean {
      return (choice: Choice) => isChoiceDisabled(choice, state.flags)
    },

    energyPercentage(state): number {
      return getEnergyPercentage(state.flags.energy)
    },

    currentDay(state): 1 | 2 {
      return getCurrentDay(gameData.scenes, state.currentSceneId)
    },

    currentTitle(state): string {
      return getCurrentTitle(gameData.scenes, state.currentSceneId)
    },

    milestones(): Milestone[] {
      return getMilestones()
    },

    reachedMilestonesList(state): Milestone[] {
      return getReachedMilestonesList(state.reachedMilestones)
    },

    isGameEnded(state): boolean {
      return state.hasGameEnded
    },

    firstDialogueAnnotation(state): string | undefined {
      return getFirstDialogueAnnotation(
        gameData.scenes,
        state.currentSceneId,
        state.currentEntryAnnotationIndex
      )
    },

    isFirstDialogueOfInitialScene(state): boolean {
      return isFirstDialogueOfInitialScene(
        state.currentSceneId,
        state.currentDialogueIndex,
        gameData.initialSceneId
      )
    },

    isMenuOpen: (state) => state.menuStatus === 'open',
    isMenuOpening: (state) => state.menuStatus === 'opening',
    isMenuClosing: (state) => state.menuStatus === 'closing',
  },

  actions: {
    initGame(forceReset = false) {
      if (forceReset) {
        this.resetGame()
        return
      }

      const runtimeConfig = useRuntimeConfig()
      const startDialogueId = runtimeConfig.public.startDialogueId

      if (startDialogueId) {
        let foundSceneId: string | null = null
        let foundDialogueIndex = -1

        for (const [sceneId, scene] of Object.entries(gameData.scenes)) {
          const index = scene.dialogues.findIndex(
            (d) => d.id === startDialogueId
          )
          if (index !== -1) {
            foundSceneId = sceneId
            foundDialogueIndex = index
            break
          }
        }

        if (foundSceneId !== null) {
          console.log(
            `LOG_DEBUG: Starting from dialogue ID "${startDialogueId}" (Scene: ${foundSceneId}, Index: ${foundDialogueIndex})`
          )
          this.currentSceneId = foundSceneId
          this.currentDialogueIndex = foundDialogueIndex
          this.flags = createInitialFlags()
          this.introPlayed = true
          this.introAnimationPhase = 'complete'
          this.introBlurAmount = 0

          const animationsStore = useAnimationsStore()
          animationsStore.setCursorVariant('dark')
          animationsStore.setAudiowaveVariant('dark')

          return
        } else {
          console.warn(
            `LOG_DEBUG: Dialogue ID "${startDialogueId}" not found in any scene.`
          )
        }
      }

      if (
        import.meta.env.DEV &&
        devConfig.enabled &&
        devConfig.initialSceneId
      ) {
        console.log('LOG_DEBUG: Applying Dev Config', devConfig)
        this.currentSceneId = devConfig.initialSceneId
        this.currentDialogueIndex = 0
        this.flags = { ...createInitialFlags(), ...devConfig.initialFlags }
        this.introPlayed = true
        this.introAnimationPhase = 'complete'
        this.introBlurAmount = 0

        const animationsStore = useAnimationsStore()
        animationsStore.setCursorVariant('dark')
        animationsStore.setAudiowaveVariant('dark')

        if (devConfig.playbackRate) {
          const audioStore = useAudioStore()
          audioStore.setPlaybackRate(devConfig.playbackRate)
        }

        return
      }

      try {
        const canResume =
          import.meta.env.DEV && devConfig.enabled
            ? devConfig.resumeFromSnapshot
            : true

        const savedState = loadSnapshot(STORAGE_KEY)

        if (savedState && canResume) {
          this.reachedMilestones = ensureInitialMilestone(
            savedState.reachedMilestones
          )
          this.currentSceneId = savedState.currentSceneId
          this.currentDialogueIndex = savedState.currentDialogueIndex
          this.flags = savedState.flags
          this.introPlayed = savedState.introPlayed
          this.introAnimationPhase = 'hidden'
          this.menuStatus = 'closed'
          this.hasGameEnded = savedState.hasGameEnded
        }
      } catch {
        this.resetGame()
      }
    },

    saveGame() {
      saveSnapshot(STORAGE_KEY, this.$state)
    },

    resetGame() {
      const audioStore = useAudioStore()
      const animationsStore = useAnimationsStore()

      this._annotationTimerId = clearScheduledTimer(this._annotationTimerId)
      this._annotationSwitchTimerId = clearScheduledTimer(
        this._annotationSwitchTimerId
      )
      this._pauseTimerId = clearScheduledTimer(this._pauseTimerId)

      const runtimeConfig = useRuntimeConfig()
      const startDialogueId = runtimeConfig.public.startDialogueId

      let targetSceneId = gameData.initialSceneId
      let targetDialogueIndex = 0

      if (startDialogueId) {
        for (const [sceneId, scene] of Object.entries(gameData.scenes)) {
          const index = scene.dialogues.findIndex(
            (d) => d.id === startDialogueId
          )
          if (index !== -1) {
            targetSceneId = sceneId
            targetDialogueIndex = index
            break
          }
        }
      }

      this.currentSceneId = targetSceneId
      this.currentDialogueIndex = targetDialogueIndex
      this.currentEntryAnnotationIndex = 0
      this.flags = createInitialFlags()
      this.reachedMilestones = ['reveil']
      this.isTransitioning = false
      this.isDayTransitioning = false
      this.pendingTransitionSceneId = null
      this.showChoices = false
      this.menuStatus = 'closed'
      this.selectedChoice = null
      this.showQuiz = false
      this.showFinalFooter = false
      this.hasGameEnded = false

      animationsStore.setAuroraVisibility(false)
      animationsStore.setAuroraZIndex(0)

      this.introPlayed = !!startDialogueId
      this.introAnimationPhase = startDialogueId ? 'complete' : 'annotation'
      this.introBlurAmount = 0
      this.saveGame()

      const currentScene = gameData.scenes[targetSceneId]
      if (currentScene?.audio) {
        const audioPath = currentScene.audio.startsWith('/')
          ? currentScene.audio
          : `/audios/${currentScene.audio}`
        audioStore.playAudio(audioPath)
      }

      if (import.meta.client) {
        const experienceEl = document.getElementById('experience')
        if (experienceEl) {
          const targetY = experienceEl.offsetTop + experienceEl.offsetHeight

          // lenis is added to window in app.vue
          if (window.lenis) {
            // lenis is added to window in app.vue
            window.lenis.scrollTo(targetY, { immediate: true })
          } else {
            window.scrollTo({
              top: targetY,
              behavior: 'instant',
            })
          }
        }
      }

      const firstDialogue = currentScene?.dialogues[targetDialogueIndex]
      const firstWordStart = firstDialogue?.timings?.[0]?.start
      const delay = computeAnnotationDelayMs(firstWordStart)

      if (!startDialogueId) {
        this._annotationTimerId = scheduleTimer(() => {
          if (isEntryAnnotationPhase(this.introAnimationPhase)) {
            this.introAnimationPhase = 'complete'
          }
          this._annotationTimerId = null
        }, delay)

        if (currentScene?.entryAnnotations?.items?.length) {
          const switchDelayMs =
            currentScene.entryAnnotations.transitionAtTime ??
            delay *
              ((currentScene.entryAnnotations.transitionAtPercent ?? 50) / 100)
          this._annotationSwitchTimerId = scheduleTimer(() => {
            this.currentEntryAnnotationIndex = 1
            this._annotationSwitchTimerId = null
          }, switchDelayMs)
        }
      }
    },

    setIntroPlayed() {
      this.introPlayed = true
    },

    setIntroAnimationPhase(phase: IntroAnimationPhase) {
      this.introAnimationPhase = phase
    },

    setIntroBlurAmount(amount: number) {
      this.introBlurAmount = amount
    },

    setShowQuiz(show: boolean) {
      this.showQuiz = show
      if (show) {
        this.showFinalFooter = false
      }
    },

    setShowFinalFooter(show: boolean) {
      this.showFinalFooter = show
    },

    setAutoScrolling(isAutoScrolling: boolean) {
      this.isAutoScrolling = isAutoScrolling
    },

    setDayTransitioning(isTransitioning: boolean) {
      this.isDayTransitioning = isTransitioning
    },

    completeDayTransition() {
      if (!this.pendingTransitionSceneId) return

      const sceneId = this.pendingTransitionSceneId
      const scene = gameData.scenes[sceneId]
      if (!scene) return

      // Make sure the transition flag is still on here; Experience.vue will turn it off after the eye opens
      // (This prevents the annotation rendering twice before eye completes)

      if (scene.entryAnnotation || scene.entryAnnotations?.items?.length) {
        this.selectedChoice = null
        this.introAnimationPhase = getEntryAnnotationPhase(this.introPlayed)
      }

      this.currentSceneId = sceneId
      this.currentEntryAnnotationIndex = 0
      this.currentDialogueIndex = 0
      this.flags = applyDialogueEnergyChange(this.flags, this.currentDialogue)

      this.pendingTransitionSceneId = null
      this.saveGame()
    },

    setShowChoices(showChoices: boolean) {
      this.showChoices = showChoices
    },

    advanceDialogue(force = false) {
      if (this.isTransitioning) return

      // Clear any pending pause timer if we advance manually
      this._pauseTimerId = clearScheduledTimer(this._pauseTimerId)

      const scene = this.currentScene
      if (!scene) return

      const dialogue = this.currentDialogue
      if (dialogue?.pause && !force) {
        console.log(`LOG_DEBUG: Pause of ${dialogue.pause}s detected`)
        this._pauseTimerId = scheduleTimer(() => {
          this.advanceDialogue(true)
          this._pauseTimerId = null
        }, dialogue.pause * 1000)
        return
      }

      if (!this.hasDialogues || this.isLastDialogue) {
        this.handleEndOfDialogues()
        return
      }

      this.currentDialogueIndex++
      this.flags = applyDialogueEnergyChange(this.flags, this.currentDialogue)

      this.saveGame()
    },

    handleEndOfDialogues() {
      const scene = this.currentScene
      if (!scene) return

      if (this.hasChoices) {
        this.selectedChoice = null
        this.setShowChoices(true)
        return
      }

      if (scene.nextSceneId) {
        this.goToScene(scene.nextSceneId)
        return
      }

      this.goToNextScene()
    },

    selectChoice(choice: Choice) {
      this.selectedChoice = choice
      this.setShowChoices(false)

      this.flags = applyChoiceEffects(this.flags, choice.effects)

      this.saveGame()

      if (choice.nextSceneId) {
        this.goToScene(choice.nextSceneId)
      } else {
        this.goToNextScene()
      }
    },

    startAnnotationTimer(
      durationMs: number = ENTRY_ANNOTATION_AUTO_COMPLETE_DELAY_MS
    ) {
      this._annotationTimerId = clearScheduledTimer(this._annotationTimerId)
      this._annotationTimerId = scheduleTimer(() => {
        if (shouldAutoCompleteAnnotation(this.introAnimationPhase)) {
          this.introAnimationPhase = 'complete'
        }
        this._annotationTimerId = null
      }, durationMs)
    },

    goToScene(sceneId: string, devFlags?: Partial<GameFlags>) {
      if (this.isTransitioning) return

      const scene = gameData.scenes[sceneId]
      if (!scene) {
        console.error(`Scene not found: ${sceneId}`)
        return
      }

      // DevTools only: inject pre-resolved flags so scene conditions are satisfied
      if (devFlags) {
        this.flags = { ...this.flags, ...devFlags }
      }

      this.isTransitioning = true

      setTimeout(() => {
        const oldDay = getCurrentDay(gameData.scenes, this.currentSceneId)
        const newDay = getCurrentDay(gameData.scenes, sceneId)

        if (oldDay === 1 && newDay === 2 && !devFlags) {
          // If we are crossing the day boundary natively, put the scene load on hold
          // while Experience.vue hides the UI and handles the background swap
          this.pendingTransitionSceneId = sceneId
          this.setDayTransitioning(true)
          this.isTransitioning = false
          return
        }

        if (scene.entryAnnotation || scene.entryAnnotations?.items?.length) {
          this.selectedChoice = null
          this.introAnimationPhase = getEntryAnnotationPhase(this.introPlayed)

          const firstWordStart = scene.dialogues?.[0]?.timings?.[0]?.start
          const delay =
            firstWordStart !== undefined
              ? computeAnnotationDelayMs(firstWordStart)
              : ENTRY_ANNOTATION_AUTO_COMPLETE_DELAY_MS

          this.startAnnotationTimer(delay)

          if (scene.entryAnnotations?.items?.length) {
            const switchDelayMs =
              scene.entryAnnotations.transitionAtTime ??
              delay * ((scene.entryAnnotations.transitionAtPercent ?? 50) / 100)

            this._annotationSwitchTimerId = clearScheduledTimer(
              this._annotationSwitchTimerId
            )
            this._annotationSwitchTimerId = scheduleTimer(() => {
              this.currentEntryAnnotationIndex = 1
              this._annotationSwitchTimerId = null
            }, switchDelayMs)
          }

          if (scene.audio && scene.entryAudioEarlyStart) {
            const audioStore = useAudioStore()
            const audioPath = scene.audio.startsWith('/')
              ? scene.audio
              : `/audios/${scene.audio}`
            audioStore.playAudio(audioPath)
          }
        }

        this.currentSceneId = sceneId
        this.currentEntryAnnotationIndex = 0
        this.currentDialogueIndex = 0

        this.flags = applyDialogueEnergyChange(this.flags, this.currentDialogue)

        this.setShowChoices(false)
        this.isTransitioning = false
        this.saveGame()
      }, 300)
    },

    goToNextScene() {
      const nextStep = resolveNextProgressionStep({
        currentSceneId: this.currentSceneId,
        flags: this.flags,
        scenes: gameData.scenes,
        milestones: MILESTONES,
        milestoneOrder: MILESTONE_ORDER,
        getMilestoneForScene,
      })

      if (nextStep.type === 'scene') {
        this.goToScene(nextStep.sceneId)
        return
      }

      if (nextStep.type === 'milestone') {
        this.goToMilestone(nextStep.milestoneId)
        return
      }

      this.hasGameEnded = true
      this.saveGame()
    },

    goToMilestone(milestoneId: string) {
      const milestone = MILESTONES[milestoneId]
      const isReached =
        this.reachedMilestones.includes(milestoneId) || import.meta.env.DEV

      if (!milestone || !isReached) {
        return
      }

      const sceneId = findFirstValidSceneIdInMilestone(
        milestoneId,
        MILESTONES,
        gameData.scenes,
        this.flags
      )

      if (sceneId) {
        this.introPlayed = true
        this.introAnimationPhase = 'complete'
        this.goToScene(sceneId)
        this.menuStatus = 'closed'
      }
    },

    async toggleMenu() {
      if (this.menuStatus === 'open') {
        this.closeMenu()
        return
      }

      this.menuStatus = getToggleTargetMenuStatus(this.menuStatus)
    },

    openMenu() {
      this.menuStatus = getMenuOpenStatus()
      const audioStore = useAudioStore()
      audioStore.pauseAudio()
    },

    closeMenu(resumeAudio: boolean = true) {
      this.menuStatus = getMenuClosingStatus()

      setTimeout(() => {
        this.menuStatus = finalizeClosingStatus(this.menuStatus)
      }, MENU_CLOSE_DELAY_MS)

      if (resumeAudio) {
        const audioStore = useAudioStore()
        audioStore.resumeAudio()
      }
    },

    toggleForceShowUI() {
      this.forceShowUI = !this.forceShowUI
    },
  },
})
