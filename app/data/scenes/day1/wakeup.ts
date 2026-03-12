import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { thoughts } from '../../helpers'

export const dayOneWakeup: Scene = {
  id: SCENE_IDS.DAY_ONE_WAKEUP,
  day: 1,
  title: 'Réveil',
  audio: 'experience/J01_S01_Reveil.mp3',
  entryAnnotation:
    'Le réveil sonne, les oiseaux chantent, bruits de couette qui bouge, bruits de pas',
  entryAudioEarlyStart: true,
  dialogues: [
    thoughts('d1_1', 'Oh purée, un autre jour dans la France de Macron..', {
      color: 'violet',
    }),
  ],
}

export const dayOneBathroom: Scene = {
  id: SCENE_IDS.DAY_ONE_BATHROOM,
  day: 1,
  title: 'Réveil',
  audio: 'experience/J01_C01_Tenue_base.mp3',
  dialogues: [
    thoughts(
      'd1_2',
      'OK, alors soit la robe qui me serre avec cette foutue étiquette dedans, mais je suis maxi fraîche, soit je mets pantalon oversize avec une chemise, mais je suis maxi confort pour la journée de taf',
      {
        color: 'red',
      }
    ),
  ],
  choices: [
    {
      id: 'outfit_sexy',
      text: 'TENUE RAFFINEE',
      nextSceneId: SCENE_IDS.DAY_ONE_OUTFIT_SEXY,
      effects: {
        energy: -5,
        flags: { outfitChoice: 'sexy' },
      },
    },
    {
      id: 'outfit_comfort',
      text: 'TENUE CONFORT',
      nextSceneId: SCENE_IDS.DAY_ONE_OUTFIT_COMFORT,
      effects: {
        flags: { outfitChoice: 'comfort' },
      },
    },
  ],
}

export const dayOneOutfitSexy: Scene = {
  id: SCENE_IDS.DAY_ONE_OUTFIT_SEXY,
  day: 1,
  title: 'Réveil',
  condition: { flag: 'outfitChoice', operator: 'equals', value: 'sexy' },
  audio: 'experience/J01_C01_Tenue_A.mp3',
  dialogues: [
    thoughts(
      'd1_3',
      "Vas-y, ça va le faire. Je coupe les étiquettes et c'est carré",
      {
        color: 'green',
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_ONE_METRO_SEXY,
}

export const dayOneOutfitComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_OUTFIT_COMFORT,
  day: 1,
  title: 'Réveil',
  condition: { flag: 'outfitChoice', operator: 'equals', value: 'comfort' },
  audio: 'experience/J01_C01_Tenue_B.mp3',
  dialogues: [
    thoughts(
      'd1_3b',
      "déjà que j'ai c'te réu de deux heures trente qui va me faire mal à la tête, autant être confort.",
      {
        color: 'blue',
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_ONE_METRO_COMFORT,
}
