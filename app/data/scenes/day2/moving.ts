import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, pensees } from '../../helpers'

export const dayTwoMoving: Scene = {
  id: SCENE_IDS.DAY_TWO_MOVING,
  day: 2,
  title: 'Demenagement',
  entryAnnotation: 'Au déménagement',
  audio: 'experience/J02_S02_Demenagement.mp3',
  dialogues: [
    d('d2_11', 'Mere', 'Allez, on se motive ! Il reste plus que le canapé !', {
      annotation: 'Bruits de demenagement, cartons, pas',
      color: 'red',
    }),
    d('d2_12', 'Frere', "Lucie, tu peux m'aider a porter le frigo apres ?", {
      color: 'red',
    }),
    d('d2_13', 'LUCIE', "Attends, je fais une pause la, j'en peux plus.", {
      color: 'blue',
    }),
    pensees(
      'd2_14',
      "J'ai mal partout, il y a trop de bruit, trop de monde. Je vais exploser.",
      {
        color: 'red',
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_TWO_SUNSET,
}

export const dayTwoSunset: Scene = {
  id: SCENE_IDS.DAY_TWO_SUNSET,
  day: 2,
  title: 'Coucher de soleil',
  audio: 'experience/J02_S03_Coucher_Soleil.mp3',
  dialogues: [
    d('d2_15', 'LUCIE', "C'est beau...", {
      annotation: 'Musique douce et vent, Lucie regarde le coucher de soleil',
      color: 'violet',
    }),
    pensees(
      'd2_16',
      "Finalement, c'est pas si mal d'être sensible. Je ressens tout plus fort, le moche comme le beau. C'est à moi de choisir ce que je garde.",
      {
        color: 'violet',
      }
    ),
  ],
  nextSceneId: SCENE_IDS.GAME_END,
}
