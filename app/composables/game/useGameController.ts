import type { Ref } from 'vue'

import { useChoicePresentation } from './useChoicePresentation'
import { useDialogueAudioSync } from './useDialogueAudioSync'
import { useDialogueAurora } from './useDialogueAurora'
import { useGameInteractions } from './useGameInteractions'
import { useGameUiVisibility } from './useGameUiVisibility'

export const useGameController = (isContainerVisible: Ref<boolean>) => {
  const gameStore = useGameStore()
  const animationsStore = useAnimationsStore()
  const audioStore = useAudioStore()

  useDialogueAurora(isContainerVisible)
  useDialogueAudioSync()

  const dialogueBoxRef = useTemplateRef<HTMLElement>('dialogueBoxRef')
  const choicesRef = useTemplateRef<HTMLElement>('choicesRef')
  const isChoiceSelecting = ref(false)

  const {
    audioProgressPercent,
    showAnnotation,
    isMilestoneAnnotation,
    showGameUI,
    showDelayedGameUI,
    annotationText,
    showContent,
  } = useGameUiVisibility()

  const { activeChoices } = useChoicePresentation(showGameUI, choicesRef)

  const { handleInteraction, handleChoiceSelect, onDialogueAnimationComplete } =
    useGameInteractions(showGameUI, isChoiceSelecting)

  onMounted(() => {
    gameStore.initGame()
  })

  return {
    gameStore,
    animationsStore,
    audioStore,
    dialogueBoxRef,
    choicesRef,
    isChoiceSelecting,
    activeChoices,
    audioProgressPercent,
    showAnnotation,
    isMilestoneAnnotation,
    showGameUI,
    showDelayedGameUI,
    annotationText,
    showContent,
    handleInteraction,
    handleChoiceSelect,
    onDialogueAnimationComplete,
  }
}
