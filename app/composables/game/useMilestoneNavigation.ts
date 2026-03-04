import { QUIZ_ENTRY_DELAY_MS } from '~/app/constants/durations'

export function useMilestoneNavigation() {
  const gameStore = useGameStore()
  let quizTimer: ReturnType<typeof setTimeout> | null = null

  const isMilestoneReached = (milestoneId: string) => {
    if (import.meta.dev) return true
    return gameStore.reachedMilestones.includes(milestoneId)
  }

  const handleMilestoneClick = (milestoneId: string) => {
    if (isMilestoneReached(milestoneId)) {
      gameStore.goToMilestone(milestoneId)
    }
  }

  const navigateToTest = () => {
    gameStore.closeMenu(false)
    if (quizTimer) {
      clearTimeout(quizTimer)
    }
    quizTimer = setTimeout(() => {
      quizTimer = null
      gameStore.setShowQuiz(true)
    }, QUIZ_ENTRY_DELAY_MS)
  }

  onUnmounted(() => {
    if (quizTimer) {
      clearTimeout(quizTimer)
      quizTimer = null
    }
  })

  return {
    isMilestoneReached,
    handleMilestoneClick,
    navigateToTest,
  }
}
