import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayOneMetroSexy: Scene = {
  id: SCENE_IDS.DAY_ONE_METRO_SEXY,
  day: 1,
  title: 'Trajet',
  entryAnnotation: 'À la gare',
  condition: { flag: 'outfitChoice', operator: 'equals', value: 'sexy' },
  audio: 'experience/J01_S03_Trajet_A.mp3',
  dialogues: [
    d(
      'd1a_4',
      'Annonce',
      "En raison d'un bagage abandonné, les métros A et B-",
      {
        color: 'red',
      }
    ),
    thoughts('d1a_5', "Mais qu'est-ce que je fous là ? C'est trop !", {
      color: 'red',
    }),
    thoughts(
      'd1a_6',
      'Je vais aller prendre un vélo et je vais me faire siffler cinq fois sur le chemin. Super.',
      {
        color: 'blue',
      }
    ),
    d(
      'd1a_7',
      'Inconnue',
      "Coucou, je voulais juste te dire que t'es trop belle. C'est quoi la ref de ta robe ?",
      {
        color: 'green',
      }
    ),
    d(
      'd1a_8',
      'LUCIE',
      "Oh, merci beaucoup ! C'est une robe Maje, la patineuse à col montant.",
      {
        color: 'green',
      }
    ),
    d('d1a_9', 'Inconnue', 'Merciii !', {}),
  ],
}

export const dayOneMetroComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_METRO_COMFORT,
  day: 1,
  title: 'Trajet',
  entryAnnotation: 'À la gare',
  condition: { flag: 'outfitChoice', operator: 'equals', value: 'comfort' },
  audio: 'experience/J01_S03_Trajet_B.mp3',
  dialogues: [
    d('d1b_4', 'Annonce', "En raison d'un bagage abandonné, le métro A et B-", {
      color: 'red',
    }),
    thoughts('d1b_5', "Mais qu'est-ce que je fous là ? C'est trop !", {
      color: 'red',
    }),
    thoughts(
      'd1b_6',
      'Bah, [souffle] vélo hein, ça aurait été relou avec la robe.',
      {
        color: 'green',
      }
    ),
  ],
}
