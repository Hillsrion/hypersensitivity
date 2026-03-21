import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayTwoWakeupCrash: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
  day: 2,
  title: 'Réveil',
  entryAnnotations: {
    items: [
      'Lucie se réveille',
      'Le réveil sonne, les oiseaux chantent, bruits de couette',
    ],
    transitionAtTime: 4000,
  },
  entryAudioEarlyStart: true,
  condition: { flag: 'hadBreakdown', operator: 'equals', value: true },
  audio: 'experience/J02_C01_ReveilAppel_Breakdown.mp3',
  dialogues: [
    thoughts(
      'd2_breakdown_1',
      "J'ai trop mal dormi. Je me sens lourde. Je vais aller à la montagne aujourd'hui, ça me fera du bien.",
      {
        color: 'blue',
      }
    ),
    d('d2_breakdown_1_allo', 'Lucie', 'Allô ?', {}),
    d(
      'd2_breakdown_2',
      'Jérémy',
      "Coucou, je suis désolé de te déranger si tôt. Je t'appelle parce qu'on a un souci. Tu te souviens que je t'avais dit que je déménageais aujourd'hui ? En fait, j'ai plus personne pour conduire le camion de loc et y'a So qui a une grippe carabinée là, il est couché. Est-ce que je pourrais venir tout à l'heure ? Y'a genre trois allers-retours à faire, je pense.",
      {}
    ),
  ],
  choices: [
    {
      id: 'day_two_accept',
      text: 'ACCEPTER',
      nextSceneId: SCENE_IDS.DAY_TWO_ACCEPT,
      condition: {
        flag: 'energy',
        operator: 'greaterThan',
        value: 0,
      },
      disabledReason: "Pas assez d'énergie",
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
  entryAnnotations: {
    items: ['Lucie se réveille', 'Le réveil sonne, les oiseaux chantent'],
    transitionAtTime: 4000,
  },
  entryAudioEarlyStart: true,
  condition: { flag: 'hadBreakdown', operator: 'equals', value: false },
  audio: 'experience/J02_C01_ReveilAppel_Good.mp3',
  dialogues: [
    thoughts(
      'd2_good_1',
      "C'est aujourd'hui que j'avais prévu d'aller à la montagne. J'ai pas vu la semaine passée. J'ai encore jamais fait la croix de Chamrousse.",
      {
        color: 'lime',
      }
    ),
    thoughts('d2_good_1_allo', 'Allô ?', {}),
    d(
      'd2_good_2',
      'Jérémy',
      "Coucou, je suis désolé de te déranger si tôt. Je t'appelle parce qu'on a un souci. Tu te souviens que je t'avais dit que je déménageais aujourd'hui ? En fait, j'ai plus personne pour conduire le camion de loc et y'a So qui a une grippe carabinée là, il est couché. Est-ce que je pourrais venir tout à l'heure ? Y'a genre trois allers-retours à faire, je pense.",
      {}
    ),
  ],
  choices: [
    {
      id: 'day_two_accept',
      text: 'ACCEPTER',
      nextSceneId: SCENE_IDS.DAY_TWO_ACCEPT,
      condition: {
        flag: 'energy',
        operator: 'greaterThan',
        value: 0,
      },
      disabledReason: "Pas assez d'énergie",
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
  audio: 'experience/J02_C01_Appel_Accepter.mp3',
  dialogues: [
    d(
      'd2a_1',
      'LUCIE',
      "Nonnnn, tu sais quoi ? Je devais aller à la montagne aujourd'hui. Ça fait deux semaines que je repousse.",
      {
        color: 'orange',
      }
    ),
    d(
      'd2a_2',
      'Jérémy',
      "Ah, pitié, pitié ! J'ai personne d'autre qui a le permis et qui est dispo aujourd'hui. J'ai fait le tour, t'es mon dernier espoir. Sinon, j'ai loué le camion et j'ai fait venir les gens pour rien. Je te jure, je te revaudrai ça.",
      {}
    ),
    d(
      'd2a_3',
      'LUCIE',
      "OK, OK, c'est bon. Je te rejoins chez toi tout à l'heure.",
      {}
    ),
    d(
      'd2a_4',
      'Jérémy',
      'Merci, vraiment. Tu sais quoi ? Je te paie resto la prochaine fois.',
      {}
    ),
  ],
}

export const dayTwoRefuse: Scene = {
  id: SCENE_IDS.DAY_TWO_REFUSE,
  day: 2,
  title: 'Appel',
  condition: { flag: 'callChoice', operator: 'equals', value: 'refuse' },
  audio: 'experience/J02_C01_Appel_Refuser.mp3',
  dialogues: [
    d(
      'd2b_1',
      'LUCIE',
      "Je suis désolée, je suis franchement pas en état de voir des gens et... j'ai vraiment besoin de prendre du temps pour moi. Mais demande à Lucas, il est dispo aujourd'hui.",
      {
        color: 'cyan',
      }
    ),
    d(
      'd2b_2',
      'Jérémy',
      'Ça marche. Prends soin de toi et on se voit bientôt pour la crémaillère alors. Gros bisous.',
      {}
    ),
    d(
      'd2b_3',
      'LUCIE',
      'Ça sera avec plaisir. Désolée encore. Gros bisous et bon courage.',
      {
        color: 'cyan',
      }
    ),
  ],
}
