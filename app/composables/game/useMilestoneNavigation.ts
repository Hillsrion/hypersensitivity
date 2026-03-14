export function useMilestoneNavigation() {
  const gameStore = useGameStore()

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
    gameStore.navigateToTest()
  }

  return {
    isMilestoneReached,
    handleMilestoneClick,
    navigateToTest,
  }
}
