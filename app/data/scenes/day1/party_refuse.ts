import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d } from '../../helpers'

export const dayOneRefuse: Scene = {
  id: SCENE_IDS.DAY_ONE_REFUSE,
  day: 1,
  title: 'Soiree',
  audio: 'experience/J01_C03B_Discussion.mp3',
  dialogues: [
    d(
      'd1_36',
      'LUCIE',
      'Je vais plutôt en profiter pour discuter avec Inès. Ça fait longtemps.',
      {}
    ),
    d(
      'd1_37',
      'Lucas',
      "T'inquiète, pas de souci. Bon, du coup, presque consensus.",
      {}
    ),
    d(
      'd1_38',
      'LUCIE',
      "Non, mais il faut que je te raconte un truc là, qui s'est passé tout à l'heure avec la vieille meuf aigrie de mon taf.",
      {
        color: 'red',
      }
    ),
    d('d1_39', 'Ines', 'Vas-y, raconte.', {}),
  ],
}

export const dayOneRefuseAssert: Scene = {
  id: SCENE_IDS.DAY_ONE_REFUSE_ASSERT,
  day: 1,
  title: 'Soiree',
  condition: { flag: 'conflictOutcome', operator: 'equals', value: 'assert' },
  dialogues: [
    d(
      'd1_40',
      'LUCIE',
      "J'avais une réu ce matin. Vu que c'est toujours le bordel dans l'open space, j'ai réservé une des petites cabanes à isolation phonique. Ce pas, je la vois dans la cabane et elle veut pas bouger."
    ),
    d('d1_41', 'Ines', "Waouh, dis-moi que tu l'as bougée de là."),
    d(
      'd1_42',
      'LUCIE',
      "Bien sûr que je l'ai bougée de là. Mais c'est pas dans l'aprèm, je reçois un mail du responsable pour un truc rien à voir. Elle allait me balancer parce que je suis partie un peu plus tôt mardi dernier. Elle a rien d'autre à faire, sérieux."
    ),
  ],
}

export const dayOneRefuseSubmit: Scene = {
  id: SCENE_IDS.DAY_ONE_REFUSE_SUBMIT,
  day: 1,
  title: 'Soiree',
  condition: { flag: 'conflictOutcome', operator: 'equals', value: 'submit' },
  audio: 'experience/J01_C03B_Discussion_Calme.mp3',
  dialogues: [
    d(
      'd1_43',
      'LUCIE',
      "J'ai pas eu la force de me battre encore. Cette fois pour cette putain de cabine. Ces derniers temps, je suis usée. Le pire, c'est que ça me dégoûte. Je sais quoi faire. Et tu sais pourquoi ces gens, ils font ça ? Parce qu'ils sont pas encore tombés sur quelqu'un qui va les remettre à leur place.",
      {
        color: 'blue',
        energyChange: -20,
      }
    ),
    d(
      'd1_44',
      'Ines',
      "On peut pas gagner toutes les batailles. Vas-y step by step. Si tu veux, ce week-end, on t'aidera à trouver les mots pour mettre tes limites.",
      {
        color: 'green',
      }
    ),
    d('d1_45', 'LUCIE', "Trop bien, on fera ça. Merci d'être là.", {
      color: 'green',
    }),
    d('d1_46', 'Ines', "Mais c'est normal, avec plaisir.", {
      color: 'green',
    }),
  ],
}
