import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayOneOffice: Scene = {
  id: SCENE_IDS.DAY_ONE_OFFICE,
  day: 1,
  title: 'Bureau',
  entryAnnotation: 'Au bureau',
  audio: 'experience/J01_C02_Bureau_Base.mp3',
  dialogues: [
    d('d1_10', 'Collègue', 'Tu nous rejoins sur Meet ?', {
      annotation: 'Lucie échange avec son collègue sur Slack',
      isChat: true,
    }),
    d(
      'd1_11',
      'LUCIE',
      "Mince je n'ai pas vu l'heure, j'arrive tout de suite, je vais juste m'installer dans la box de reu",
      {
        isChat: true,
      }
    ),
    d(
      'd1_12',
      'LUCIE',
      "Ah, salut Karen ! Je suis désolée, j'avais réservé la salle et j'ai une réunion importante avec le produit. Tu pourrais me laisser la bulle ?",
      {
        annotation: "Lucie arrive et voit Karen s'installer dans la box",
        color: 'red',
      }
    ),
    d(
      'd1_13',
      'Karen',
      "Ah, j'ai encore oublié... La mienne va commencer là. Il y en a d'autres de libres.",
      {
        color: 'red',
      }
    ),
  ],
  choices: [
    {
      id: 'conflict_submit',
      text: 'Se résigner',
      nextSceneId: SCENE_IDS.DAY_ONE_CONFLICT_SUBMIT,
      effects: {
        energy: -10,
        flags: { conflictOutcome: 'submit' },
      },
    },
    {
      id: 'conflict_assert',
      text: "S'AFFIRMER",
      nextSceneId: SCENE_IDS.DAY_ONE_CONFLICT_ASSERT,
      effects: {
        flags: { conflictOutcome: 'assert' },
      },
    },
  ],
}

export const dayOneConflictSubmit: Scene = {
  id: SCENE_IDS.DAY_ONE_CONFLICT_SUBMIT,
  day: 1,
  title: 'Bureau',
  condition: { flag: 'conflictOutcome', operator: 'equals', value: 'submit' },
  audio: 'experience/J01_C02_Bureau_A.mp3',
  dialogues: [
    d('d1_14a', 'LUCIE', 'Oui, oui, pas de souci.', {
      color: 'blue',
    }),
    thoughts(
      'd1_15a',
      "Tu sais très bien que c'est tout rempli à cette heure-là. C'est la troisième fois que tu me fais le coup.",
      {
        color: 'red',
      }
    ),
    d(
      'd1_16a',
      'Équipe',
      "Oui, on comprend le point. Après, l'objectif reste quand même de tenir le sprint tel qu'il est prévu aujourd'hui. On est conscient que ça va demander un effort, mais on a besoin d'avancer et de montrer qu'on est capable d'absorber la charge. On fera un point d'avancement en milieu de sprint, on va voir si...",
      {
        annotation:
          "Lucie retourne à son bureau dans l'open space plein de bruit. La réunion commence...",
        color: 'blue',
      }
    ),
    d(
      'd1_17a',
      'LUCIE',
      "Mais allez jouer ailleurs ! J'arrive même pas à me concentrer.",
      {
        annotation: 'Bruits de nerf, projectiles qui stoppent le dialogue',
        color: 'red',
      }
    ),
  ],
}

export const dayOneConflictAssert: Scene = {
  id: SCENE_IDS.DAY_ONE_CONFLICT_ASSERT,
  day: 1,
  title: 'Bureau',
  condition: { flag: 'conflictOutcome', operator: 'equals', value: 'assert' },
  audio: 'experience/J01_C02_Bureau_B.mp3',
  dialogues: [
    d(
      'd1_14b',
      'LUCIE',
      "Écoute, il y en a pas d'autres à cette heure-là et tu le sais très bien. On n'a pas mis les résas des bulles en place pour rien, donc tu vas faire comme moi les deux dernières fois et tu vas aller faire ta réu dans l'open space.",
      {
        color: 'red',
      }
    ),
    d(
      'd1_15b',
      'Karen',
      'Ça y est, ça y est, ça va, Pas besoin de taper une crise.',
      {
        color: 'red',
      }
    ),
    thoughts('d1_16b', 'Et puis quoi encore ?', {
      color: 'red',
    }),
    d(
      'd1_17b',
      'LUCIE',
      "Je pense que c'est juste pas réalisable qu'on boucle ce sprint dans les temps. Je comprends qu'on doive avancer sur la roadmap..",
      {
        annotation: 'La reunion commence, Lucie participe activement.',
        color: 'blue',
      }
    ),
  ],
}
