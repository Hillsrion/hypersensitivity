import type { DialogueLine } from '../../types/game'
import {
  isContentRevealedPhase,
  isEntryAnnotationPhase,
} from '~/app/stores/game/intro'

export function useDialogueDisplay(dialogue: Ref<DialogueLine | null>) {
  const gameStore = useGameStore()

  const isPensees = computed(() => {
    return dialogue.value?.speakerType === 'pensees'
  })

  const isRightAligned = computed(() => {
    if (!dialogue.value) return false
    if (isPensees.value) return false
    if (
      dialogue.value.id === 'milestone-entry' ||
      dialogue.value.id === 'intro-anno'
    )
      return false
    const speaker = dialogue.value.speaker.toLowerCase()
    return !speaker.includes('lucie')
  })

  const isInIntroAnimation = computed(() => {
    return gameStore.isFirstDialogueOfInitialScene && !gameStore.introPlayed
  })

  const showAnnotation = (currentTimedAnnotation?: Ref<string | null>) =>
    computed(() => {
      if (currentTimedAnnotation?.value) return true
      if (
        dialogue.value?.id === 'milestone-entry' ||
        dialogue.value?.id === 'intro-anno'
      )
        return true
      if (!dialogue.value?.annotation) return false
      if (gameStore.isFirstDialogueOfInitialScene) return false
      return true
    })

  const showDialogueContent = (
    isShowingOnlyAnnotation: Ref<boolean>,
    currentTimedAnnotation: Ref<string | null>
  ) =>
    computed(() => {
      if (isShowingOnlyAnnotation.value && currentTimedAnnotation.value)
        return false

      // Pendant la phase annotation (intro initiale OU restart), on masque le dialogue
      if (isEntryAnnotationPhase(gameStore.introAnimationPhase)) return false

      if (!isInIntroAnimation.value) return true
      return isContentRevealedPhase(gameStore.introAnimationPhase)
    })

  const annotationClasses = computed(() => {
    const phase = gameStore.introAnimationPhase
    // For milestone annotations (standard dialogue box style), we function normally
    if (phase === 'milestoneAnnotation') {
      return {
        'opacity-100': true,
        'blur-0': true,
      }
    }

    // Restart case: annotation sans intro (introPlayed = true)
    if (phase === 'annotation' && !isInIntroAnimation.value) {
      return {
        'opacity-100': true,
        'blur-0': true,
      }
    }

    return {
      'blur-xs':
        isInIntroAnimation.value &&
        (phase === 'annotation' || !isContentRevealedPhase(phase)),
      'opacity-100':
        isInIntroAnimation.value &&
        (phase === 'annotation' || isContentRevealedPhase(phase)),
      'blur-0': isInIntroAnimation.value && isContentRevealedPhase(phase),
      'opacity-0':
        isInIntroAnimation.value &&
        phase !== 'annotation' &&
        !isContentRevealedPhase(phase),
    }
  })

  return {
    isPensees,
    isRightAligned,
    isInIntroAnimation,
    showAnnotation,
    showDialogueContent,
    annotationClasses,
  }
}
