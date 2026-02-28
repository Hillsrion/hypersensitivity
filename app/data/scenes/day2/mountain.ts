import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayTwoMountain: Scene = {
  id: SCENE_IDS.DAY_TWO_MOUNTAIN,
  day: 2,
  title: 'Montagne',
  entryAnnotation: 'Arrivée à la montagne',
  condition: { flag: 'callChoice', operator: 'equals', value: 'refuse' },
  audio: 'experience/J02_S02_Montagne_Intro.mp3',
  dialogues: [
    d(
      'd2_7',
      'LUCIE',
      "J'adore le bruit de la nature, je vais faire de la musique avec.",
      {
        annotation: "Bruit de vent, d'oiseaux, de pas dans l'herbe",
        color: 'green',
      }
    ),
    d(
      'd2_8',
      'LUCIE',
      "Merde, y'a un groupe de vieux qui arrive, ils font trop de bruit.",
      {
        annotation: 'Bruit de groupe de randonneurs qui approche',
        color: 'red',
      }
    ),
    d('d2_9', 'Randonneur', 'Bonjour ! Il fait beau hein ?', {
      color: 'yellow',
    }),
    thoughts('d2_10', 'Vos gueules.', {
      color: 'red',
    }),
  ],
}
