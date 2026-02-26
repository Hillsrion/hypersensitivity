import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, pensees } from '../../helpers'

export const dayTwoWakeupCrash: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
  day: 2,
  title: 'Réveil',
  entryAnnotation: 'Lucie se réveille',
  condition: { flag: 'hadBreakdown', operator: 'equals', value: true },
  dialogues: [
    pensees(
      'd2_1a',
      "J'ai trop mal dormi, je me sens lourde. je vais aller a la montagne aujourd'hui, ca me fera du bien.",
      {
        annotation: 'Le reveil sonne, les oiseaux chantent, bruits de couette',
        color: 'blue',
      }
    ),
  ],
}

export const dayTwoWakeupGood: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_GOOD,
  day: 2,
  title: 'Réveil',
  entryAnnotation: 'Lucie se réveille',
  condition: { flag: 'hadBreakdown', operator: 'equals', value: false },
  dialogues: [
    pensees(
      'd2_1b',
      "J'ai bien dormi. Je me sens d'attaque. Allez, montagne aujourd'hui !",
      {
        annotation: 'Le reveil sonne, les oiseaux chantent, bruits de couette',
        color: 'green',
      }
    ),
  ],
}

export const dayTwoCall: Scene = {
  id: SCENE_IDS.DAY_TWO_CALL,
  day: 2,
  title: 'Appel',
  audio: 'experience/J02_S01_Appel.mp3',
  dialogues: [
    d('d2_2', 'Mere', 'Allo ma cherie? Ca va?', {
      annotation: 'Sonnerie de telephone',
    }),
    d('d2_3', 'LUCIE', 'Oui, ca va bien et toi?', {}),
    d(
      'd2_4',
      'Mere',
      "Ecoute, ton frere demenage aujourd'hui, il a besoin de bras, tu peux venir l'aider?",
      {
        color: 'red',
      }
    ),
  ],
  choices: [
    {
      id: 'day_two_accept',
      text: 'ACCEPTER',
      nextSceneId: SCENE_IDS.DAY_TWO_ACCEPT,
      effects: {
        energy: -20,
        flags: { callChoice: 'accept' },
      },
    },
    {
      id: 'day_two_refuse',
      text: 'REFUSER',
      nextSceneId: SCENE_IDS.DAY_TWO_REFUSE,
      effects: {
        energy: 10,
        flags: { callChoice: 'refuse' },
      },
    },
  ],
}

export const dayTwoAccept: Scene = {
  id: SCENE_IDS.DAY_TWO_ACCEPT,
  day: 2,
  title: 'Appel',
  condition: { flag: 'callChoice', operator: 'equals', value: 'accept' },
  audio: 'experience/J02_S01_Appel_Oui.mp3',
  dialogues: [
    d('d2_5a', 'LUCIE', 'Ok, je passe.', {}),
    d('d2_6a', 'Mere', 'Super, a toute !', {}),
  ],
}

export const dayTwoRefuse: Scene = {
  id: SCENE_IDS.DAY_TWO_REFUSE,
  day: 2,
  title: 'Appel',
  condition: { flag: 'callChoice', operator: 'equals', value: 'refuse' },
  audio: 'experience/J02_S01_Appel_Non.mp3',
  dialogues: [
    d('d2_5b', 'LUCIE', "Deso, j'ai prevu un truc.", {
      color: 'green',
    }),
    d('d2_6b', 'Mere', 'Tant pis.', {
      color: 'blue',
    }),
  ],
}
