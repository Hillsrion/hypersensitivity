import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayTwoMoving: Scene = {
  id: SCENE_IDS.DAY_TWO_MOVING,
  day: 2,
  title: 'Déménagement',
  entryAnnotation: 'Au déménagement',
  terminal: true,
  condition: { flag: 'callChoice', operator: 'equals', value: 'accept' },
  audio: 'experience/J02_S03_Demenagement.mp3',
  dialogues: [
    thoughts(
      'd2_12',
      'Trois allers-retours, quel menteur celui-là ! Il est déjà dix-huit heures.',
      {
        color: 'orange',
      }
    ),
    d(
      'd2_13',
      'Personne sans-abri',
      "Bonjour, excusez-moi. Est-ce que vous auriez un peu de monnaie pour qu'on puisse manger, ma fille et moi ?",
      {}
    ),
    d(
      'd2_14',
      'Amine',
      "Bien sûr, madame. On a tout ce qu'il vous faut, ne vous inquiétez pas. Avec le froid, en ce moment, on vient distribuer des couvertures et des petits colis alimentaires...",
      {}
    ),
    thoughts(
      'd2_15',
      "Il a une telle douceur dans sa façon de s'exprimer, dans ses gestes. Son regard est rempli de bienveillance. Ça fait tellement plaisir de voir des gens qui se donnent pour les autres. J'en reprends foi en l'humanité.",
      {
        color: 'cyan',
      }
    ),
    d('d2_16', 'Amine', 'Voilà, je vous pose tout ça là ?', {}),
    d('d2_17', 'LUCIE', 'Et voici de ma part.', {}),
    d(
      'd2_18',
      'Personne sans-abri',
      'Merci, merci, merci énormément. Passez une bonne journée.',
      {}
    ),
    d('d2_19', 'Amine', 'Excellente journée à vous, madame.', {}),
    d(
      'd2_20',
      'LUCIE',
      "C'est super ce que vous faites. Je m'appelle Lucie. Vous êtes une asso ?",
      {}
    ),
    d(
      'd2_21',
      'Amine',
      "Moi, c'est Amine. Ravi de te rencontrer. Eh oui, je travaille pour Envie de sourire. On fait des maraudes trois fois par semaine pendant la période hivernale.",
      {}
    ),
    d(
      'd2_22',
      'LUCIE',
      'Ah, je connaissais pas. Vous avez besoin de mains en ce moment ?',
      {}
    ),
    d(
      'd2_23',
      'Amine',
      "[rire] Un peu, oui. On a toujours besoin de mains. On t'accueillerait avec plaisir, d'ailleurs. Tiens, la carte de l'asso. Appelle ce numéro et on s'organise ça la semaine prochaine avec l'équipe.",
      {}
    ),
    d(
      'd2_24',
      'LUCIE',
      "Allez, ça marche, on s'appelle. Finissez bien la journée.",
      {}
    ),
    d('d2_25', 'Amine', 'Merci beaucoup. À bientôt, alors.', {}),
    thoughts(
      'd2_26',
      'Le coucher de soleil est beau. Les nuages qui reflètent la lumière et les oiseaux qui chantent, je pourrais regarder ça pendant des heures.',
      {
        color: 'violet',
      }
    ),
  ],
}
