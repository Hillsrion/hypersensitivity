import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d } from '../../helpers'

export const dayOnePartySexy: Scene = {
  id: SCENE_IDS.DAY_ONE_PARTY_SEXY,
  day: 1,
  title: 'Soiree',
  entryAnnotations: {
    items: ['À la soirée', 'Lucie toque à la porte'],
    transitionAtTime: 2000,
  },
  entryAudioEarlyStart: true,
  condition: { flag: 'outfitChoice', operator: 'equals', value: 'sexy' },
  audio: 'experience/J01_S05_Soiree_Tenue_Sexy.mp3',
  dialogues: [
    d('d1_19a', 'LUCIE', 'Hey !', {
      color: 'green',
    }),
    d(
      'd1_20a',
      'Ines',
      'Ça fait plaisir de te voir. En plus, tu viens en re-sta. Epouse-moi.',
      {
        color: 'green',
      }
    ),
    d(
      'd1_21a',
      'LUCIE',
      "Mais c'est à moi de te dire ça. Regarde-toi, t'es toute mimi.",
      {
        color: 'green',
      }
    ),
    d(
      'd1_22a',
      'Ines',
      'Bah tiens, pose ta veste et va prendre un verre. Je te rejoins dans le salon.',
      {
        color: 'green',
      }
    ),
  ],
}

export const dayOnePartyComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_PARTY_COMFORT,
  day: 1,
  title: 'Soiree',
  entryAnnotation: 'Lucie arrive à la soirée',
  entryAudioEarlyStart: true,
  condition: { flag: 'outfitChoice', operator: 'equals', value: 'comfort' },
  audio: 'experience/J01_S05_Soiree_Tenue_Confort.mp3',
  dialogues: [
    d('d1_19b', 'Ines', 'Hey, ça fait plaisir de te voir !', {
      color: 'green',
    }),
    d('d1_20b', 'LUCIE', 'Mais moi aussi, ça me fait plaisir.', {
      color: 'green',
    }),
    d(
      'd1_21b',
      'Ines',
      "Comment il va, le petit monstre ? Ça fait longtemps que je ne l'ai pas vu, lui non plus.",
      {
        color: 'green',
      }
    ),
    d('d1_22b', 'LUCIE', 'Ben, ça va, il va bien hein.', {
      color: 'green',
    }),
    d(
      'd1_23b',
      'Ines',
      'Ah bah super alors. Bah viens, rentre, prends un verre et je te rejoins dans le salon.',
      {
        color: 'green',
      }
    ),
  ],
}
