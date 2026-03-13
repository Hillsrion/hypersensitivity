import { gameData } from '../../data/game'

export function useDialogueAudioSync() {
  const audioStore = useAudioStore()
  const gameStore = useGameStore()

  // Synchronisation pour les audios partagés (progression automatique)
  watch(
    () => audioStore.currentTime,
    (time) => {
      // Uniquement si on a un audio de scène (partagé)
      const scene = gameStore.currentScene
      if (!scene || !scene.audio) return
      if (gameStore.showChoices || gameStore.isTransitioning) return

      // CAS 1 : Dialogue suivant dans la MEME scène
      if (!gameStore.isLastDialogue) {
        const nextDialogue = scene.dialogues[gameStore.currentDialogueIndex + 1]
        const nextTimings = nextDialogue?.timings
        if (nextTimings && nextTimings.length > 0) {
          const firstTiming = nextTimings[0]
          if (firstTiming) {
            const nextStart = firstTiming.start
            if (time >= nextStart - 0.1) {
              console.log(
                'LOG_DEBUG: Auto-advancing within scene via audio sync',
                { time, nextStart }
              )
              gameStore.advanceDialogue()
            }
          }
        }
        return
      }

      // CAS 2 : Fin de scène, regarder si la scène suivante partage le même audio
      if (!gameStore.hasChoices && gameStore.nextSceneId) {
        const nextSceneId = gameStore.nextSceneId
        const nextScene = gameData.scenes[nextSceneId]

        if (nextScene && nextScene.audio === scene.audio) {
          const firstDialogue = nextScene.dialogues[0]
          const firstTiming = firstDialogue?.timings?.find(
            (t) => t.start !== undefined
          )
          if (firstTiming) {
            const nextStart = firstTiming.start
            if (time >= nextStart - 0.1) {
              console.log(
                'LOG_DEBUG: Auto-advancing to next scene via shared audio sync',
                { time, nextStart, nextSceneId }
              )
              gameStore.advanceDialogue()
            }
          }
        }
      }
    }
  )
}
