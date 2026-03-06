import type { Scene } from '../../../types/game'
import { SCENE_IDS } from '../../constants'
import { d, thoughts } from '../../helpers'

export const dayOneGameEvent: Scene = {
  id: SCENE_IDS.DAY_ONE_GAME_EVENT,
  day: 1,
  title: 'Soiree',
  audio: 'experience/J01_C03A_Jeu_Base.mp3',
  dialogues: [
    d(
      'd1_22',
      'Lucas',
      'Lucie, tu veux jouer avec nous à Presque Consensus ?',
      {}
    ),
    thoughts(
      'd1_23',
      "Mon Dieu, la dernière fois, j'ai rien compris. Je me suis trompée quatre fois devant tout le monde et je sentais bien qu'ils étaient saoulés. Je me suis sentie trop conne..",
      {
        color: 'violet',
      }
    ),
  ],
  choices: [
    {
      id: 'game_play',
      text: 'JOUER',
      nextSceneId: SCENE_IDS.DAY_ONE_PLAY,
      effects: {
        flags: { gameEventChoice: 'play', hadBreakdown: true },
      },
    },
    {
      id: 'game_refuse',
      text: 'REFUSER',
      nextSceneId: SCENE_IDS.DAY_ONE_REFUSE,
      effects: {
        flags: { gameEventChoice: 'refuse' },
      },
    },
  ],
}

export const dayOnePlay: Scene = {
  id: SCENE_IDS.DAY_ONE_PLAY,
  day: 1,
  title: 'Soiree',
  audio: 'experience/J01_C03A_Jeu.mp3',
  dialogues: [
    d('d1_24', 'LUCIE', 'Vas-yyyyy', {
      color: 'yellow',
      energyChange: -5,
    }),
    d(
      'd1_25',
      'Lucas',
      "En gros, on discute tous ensemble. Et faut arriver à ce que la majorité du groupe soit d'accord sur une réponse donnée à une question parmi une liste. On gagne en trouvant les influenceurs qui doivent défendre une des options sur la carte.",
      {}
    ),
    d('d1_26', 'LUCIE', 'Ok !', {}),
    d(
      'd1_27',
      'Lucas',
      "Au début, tu pioches une carte rôle. Tu la regardes en discret. Ensuite, on révèle la question du tour et les cartes opinions que t'as en main, c'est les sous-sujets qui te font gagner des points si TU les abordes. T'es pas obligé de toutes les jouer. Par contre, si tu utilises d'autres axes d'argumentation, tu perds des points.",
      {}
    ),
    d(
      'd1_27_2',
      'Lucas',
      "'Fin, tu peux reformuler, t'as capté, mais il faut que ça reste fidèle à l'esprit de la carte. Il y a un GM qui va juger de ça et qui prend des notes. Il y a des jetons influence qu'on peut utiliser.",
      {
        energyChange: -5,
      }
    ),
    thoughts('d1_28', 'Je comprends rien.', {
      color: 'violet',
      energyChange: -10,
    }),
    d(
      'd1_29',
      'Lucas',
      "...Il les distribuera parmi les cartes bidon toutes les deux minutes, mais t'es pas obligé de toutes les utiliser. Que quand tu en as deux, tu as déjà validé une, mais tu gardes un et directement au tour deux.",
      {}
    ),
    d('d1_30', 'LUCIE', 'Je me sens pas bien. Je reviens.', {
      color: 'red',
      energyChange: -10,
    }),
    thoughts(
      'd1_31',
      "[respiration] Tout va bien. Ça va aller, c'est rien. C'est rien.",
      {
        color: 'red',
      }
    ),
    d('d1_32', 'Ines', 'Lucie ? Lucie ?', {}),
    d(
      'd1_32_bis',
      'Ines',
      "Luci.. Hey, t'es partie d'un coup et t'es toute pâle. Ça va ?",
      {
        color: 'blue',
      }
    ),
    d(
      'd1_33',
      'LUCIE',
      "Non, j'ai vraiment eu une sale journée. Je suis au bout, là. Je peux plus. Faut que je rentre.",
      {
        color: 'blue',
      }
    ),
    d(
      'd1_34',
      'Ines',
      "Ok, je comprends. Assieds-toi dans ma chambre, je t'appelle un Uber.",
      {
        color: 'green',
      }
    ),
    d('d1_35', 'LUCIE', 'Merci ma douce..', {
      color: 'green',
    }),
  ],
  nextSceneId: SCENE_IDS.DAY_ONE_END_CRASH,
}
