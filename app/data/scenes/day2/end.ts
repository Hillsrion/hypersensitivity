import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { thoughts } from '../../helpers'

export const gameEnd: Scene = {
  id: SCENE_IDS.GAME_END,
  day: 2,
  title: 'Fin',
  entryAnnotation: 'Fin de la démo',
  audio: 'experience/J02_S03_Coucher_Soleil.mp3',
  dialogues: [thoughts('end_1', "Merci d'avoir joué à cette démo.", {})],
}
