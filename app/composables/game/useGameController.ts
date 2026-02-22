import { useDialogueAurora } from './useDialogueAurora'
import { useDialogueAudioSync } from './useDialogueAudioSync'
import { useGameUiVisibility } from './useGameUiVisibility'
import { useGameInteractions } from './useGameInteractions'
import { useChoicePresentation } from './useChoicePresentation'

export const useGameController = () => {
  const gameStore = useGameStore()
  const animationsStore = useAnimationsStore()
  const audioStore = useAudioStore()

  useDialogueAurora()
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
