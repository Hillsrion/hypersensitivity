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
      "T'inquiète, pas de soucis. Bon, du coup, presque consensus.",
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
      'd1_42a',
      'LUCIE',
      "Mais bien sur que je l'ai bougee de la, mais c'est pas dans l'aprem je recois un mail du responsable pour un truc rien a voir ? Elle est allee me balancer parceque la semaine derniere je suis partie plus tot mardi pour regler des trucs perso c'te sorciere"
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
      'd1_42b',
      'LUCIE',
      "J'ai pas eu la force de me battre encore, cette fois pour cette putain de cabine. Ces derniers temps, je suis usée. Le pire, c'est que ça me dégoûte. Je sais quoi faire. Mais tu sais pourquoi ces gens, ils font ça ? Parce qu'ils sont pas encore tombés sur quelqu'un qui va les choquer.",
      {
        color: 'blue',
        energyChange: -20,
      }
    ),
    d(
      'd1_43b',
      'Ines',
      "On peut pas gagner toutes les batailles. Vas-y step by step. Si tu veux, ce week-end, on t'aidera à trouver les mots pour mettre tes limites.",
      {
        color: 'green',
      }
    ),
    d(
      'd1_44b',
      'LUCIE',
      "Ah genre, tu vas la RP ? Trop bien, on fera ça. Merci d'être là.",
      {
        color: 'green',
      }
    ),
    d('d1_45b', 'Ines', "Mais c'est normal, avec plaisir !", {
      color: 'green',
    }),
  ],
}
