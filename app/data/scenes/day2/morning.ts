import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayTwoWakeupCrash: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
  day: 2,
  title: 'Réveil',
  entryAnnotation: 'Lucie se réveille',
  condition: { flag: 'hadBreakdown', operator: 'equals', value: true },
  audio: 'experience/J02_C01_ReveilAppel_Breakdown.mp3',
  dialogues: [
    thoughts(
      'd2_breakdown_1',
      "J'ai trop mal dormi. Je me sens lourde. Je vais aller à la montagne aujourd'hui, ça me fera du bien. [sonnerie de téléphone] Allô ?",
      {
        annotation: 'Le reveil sonne, les oiseaux chantent, bruits de couette',
        color: 'blue',
      }
    ),
    d(
      'd2_breakdown_2',
      'Jérémy',
      "Coucou, je suis désolé de te déranger si tôt. Je t'appelle parce qu'on a un souci. Tu te souviens que je t'avais dit que je déménageais aujourd'hui ? En fait, j'ai plus personne pour conduire le camion de loc et y a So qui a une grippe carabinée là, il est couché. Est-ce que je pourrais venir tout à l'heure ? Y a genre trois allers-retours à faire, je pense.",
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

export const dayTwoWakeupGood: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_GOOD,
  day: 2,
  title: 'Réveil',
  entryAnnotation: 'Lucie se réveille',
  condition: { flag: 'hadBreakdown', operator: 'equals', value: false },
  audio: 'experience/J02_C01_ReveilAppel_Good.mp3',
  dialogues: [
    thoughts(
      'd2_good_1',
      "C'est aujourd'hui que j'avais prévu d'aller à la montagne. J'ai pas vu la semaine passée. J'ai encore jamais fait la croix de Chamrousse. [sonnerie de téléphone] Allô ?",
      {
        annotation: 'Le reveil sonne, les oiseaux chantent, bruits de couette',
        color: 'green',
      }
    ),
    d(
      'd2_good_2',
      'Jérémy',
      "Coucou, je suis désolé de te déranger si tôt. Je t'appelle parce qu'on a un souci. Tu te souviens que je t'avais dit que je déménageais aujourd'hui ? En fait, j'ai plus personne pour conduire le camion de loc et y a So qui a une grippe carabinée là, il est couché. Est-ce que je pourrais venir tout à l'heure ? Y a genre trois allers-retours à faire, je pense.",
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
