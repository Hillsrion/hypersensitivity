import { isEntryAnnotationPhase } from '~/app/stores/game/intro'

import type { Choice } from '../../types/game'

export const useGameInteractions = (
  showGameUI: Ref<boolean>,
  isChoiceSelecting: Ref<boolean>
) => {
  const gameStore = useGameStore()

  const handleInteraction = () => {
    if (isEntryAnnotationPhase(gameStore.introAnimationPhase)) {
      console.log('LOG_DEBUG: Skipping entry annotation via click')
      gameStore.setIntroAnimationPhase('complete')
      return
    }

    if (
      (!showGameUI.value && !gameStore.introPlayed) ||
      gameStore.showChoices ||
      gameStore.isTransitioning ||
      gameStore.isMenuOpen ||
      gameStore.isMenuOpening ||
      gameStore.isMenuClosing
    ) {
      return
    }

    gameStore.advanceDialogue()
  }

  const handleChoiceSelect = (choice: Choice) => {
    isChoiceSelecting.value = false
    gameStore.selectChoice(choice)
  }

  const onDialogueAnimationComplete = () => {
    console.log('LOG_DEBUG: onDialogueAnimationComplete called')

    if (gameStore.currentDialogue?.isChat) {
      console.log('LOG_DEBUG: Chat dialogue completed, advancing')
      gameStore.advanceDialogue()
    }
  }

  return {
    handleInteraction,
    handleChoiceSelect,
    onDialogueAnimationComplete,
  }
}
