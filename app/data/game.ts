import type { GameData, Scene, DialogueLine } from "../types/game";

// Helper pour creer des dialogues
const d = (
  id: string,
  speaker: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => ({
  id,
  speaker,
  speakerType: "normal",
  text,
  ...options,
});

const pensees = (
  id: string,
  text: string,
  options?: Partial<DialogueLine>
): DialogueLine => ({
  id,
  speaker: "Lucie",
  speakerType: "pensees",
  text,
  ...options,
});

// ============================================
// SCENES JOUR 1
// ============================================

const dayOneWakeup: Scene = {
  id: "dayOneWakeup",
  day: 1,
  title: "Reveil",
  milestone: "reveil",
  audio: "experience/J01_S01_Reveil.mp3",
  dialogues: [
    pensees("d1_1", "Oh purée, un autre jour dans la France de Macron..", {
      annotation: "Le réveil sonne, les oiseaux chantent, bruits de couette qui bouge, bruits de pas",
      timings: [
        { word: "Oh", start: 7.279, end: 7.46 },
        { word: "purée,", start: 7.5, end: 7.98 },
        { word: "un", start: 8.319, end: 8.42 },
        { word: "autre", start: 8.46, end: 8.679 },
        { word: "jour", start: 8.739, end: 8.859 },
        { word: "dans", start: 8.899, end: 8.98 },
        { word: "la", start: 9.019, end: 9.06 },
        { word: "France", start: 9.099, end: 9.34 },
        { word: "de", start: 9.38, end: 9.42 },
        { word: "Macron..", start: 9.519, end: 10.079 },
        { annotation: "Lucie se prépare pour sa journée", start: 11, end: "end", showOnly: true },
      ],
    }),
  ],
  nextSceneId: "dayOneBathroom",
};

const dayOneBathroom: Scene = {
  id: "dayOneBathroom",
  day: 1,
  title: "Reveil",
  audio: "experience/J01_C01_Tenue_base.mp3",
  dialogues: [
    pensees(
      "d1_2",
      "OK, alors soit la robe qui me serre avec cette foutue étiquette dedans, mais je suis maxi fraîche, soit je mets pantalon oversize avec une chemise, mais je suis maxi confort pour la journée de taf",
      {
        timings: [
          { word: "OK,", start: 0.219, end: 0.8 },
          { word: "alors", start: 0.839, end: 1.018 },
          { word: "soit", start: 1.08, end: 1.239 },
          { word: "la", start: 1.259, end: 1.34 },
          { word: "robe", start: 1.379, end: 1.559 },
          { word: "qui", start: 1.579, end: 1.679 },
          { word: "me", start: 1.679, end: 1.799 },
          { word: "serre", start: 1.819, end: 2.039 },
          { word: "avec", start: 2.059, end: 2.239 },
          { word: "cette", start: 2.24, end: 2.439 },
          { word: "foutue", start: 2.46, end: 2.679 },
          { word: "étiquette", start: 2.7, end: 3.079 },
          { word: "dedans,", start: 3.079, end: 3.619 },
          { word: "mais", start: 3.639, end: 3.719 },
          { word: "je", start: 3.759, end: 3.839 },
          { word: "suis", start: 3.839, end: 3.959 },
          { word: "maxi", start: 3.98, end: 4.219 },
          { word: "fraîche,", start: 4.339, end: 4.98 },
          { word: "soit", start: 5.059, end: 5.179 },
          { word: "je", start: 5.219, end: 5.259 },
          { word: "mets", start: 5.299, end: 5.459 },
          { word: "pantalon", start: 5.48, end: 5.879 },
          { word: "oversize", start: 5.9, end: 6.439 },
          { word: "avec", start: 6.48, end: 6.639 },
          { word: "une", start: 6.699, end: 6.839 },
          { word: "chemise,", start: 6.859, end: 7.299 },
          { word: "mais", start: 7.339, end: 7.419 },
          { word: "je", start: 7.46, end: 7.519 },
          { word: "suis", start: 7.519, end: 7.699 },
          { word: "maxi", start: 7.719, end: 8.058 },
          { word: "confort", start: 8.14, end: 8.479 },
          { word: "pour", start: 8.48, end: 8.579 },
          { word: "la", start: 8.599, end: 8.679 },
          { word: "journée", start: 8.739, end: 9.0 },
          { word: "de", start: 9.019, end: 9.139 },
          { word: "taf", start: 9.14, end: 9.48 },
        ],
      }
    ),
  ],
  choices: [
    {
      id: "outfit_sexy",
      text: "TENUE SEXY / RAFFINEE",
      nextSceneId: "dayOneOutfitSexy",
      effects: {
        energy: -5,
        flags: { outfitChoice: "sexy" },
      },
    },
    {
      id: "outfit_comfort",
      text: "TENUE CONFORT",
      nextSceneId: "dayOneOutfitComfort",
      effects: {
        flags: { outfitChoice: "comfort" },
      },
    },
  ],
};

const dayOneOutfitSexy: Scene = {
  id: "dayOneOutfitSexy",
  day: 1,
  title: "Reveil",
  audio: "experience/J01_C01_TenueA.mp3",
  dialogues: [
    pensees(
      "d1_3a",
      "Vas-y, one life, ça va le faire ! Je coupe les étiquettes et c'est carré.",
      {
        timings: [
          { word: "Vas-y,", start: 0.079, end: 0.56 },
          { word: "one", start: 0.659, end: 0.879 },
          { word: "life,", start: 0.879, end: 1.339 },
          { word: "ça", start: 1.399, end: 1.519 },
          { word: "va", start: 1.559, end: 1.639 },
          { word: "le", start: 1.659, end: 1.759 },
          { word: "faire", start: 1.799, end: 2.119 },
          { word: "!", start: 2.219, end: 2.22 },
          { word: "Je", start: 2.46, end: 2.539 },
          { word: "coupe", start: 2.559, end: 2.719 },
          { word: "les", start: 2.72, end: 2.819 },
          { word: "étiquettes", start: 2.859, end: 3.279 },
          { word: "et", start: 3.279, end: 3.359 },
          { word: "c'est", start: 3.359, end: 3.519 },
          { word: "carré.", start: 3.539, end: 3.979 },
        ],
      }
    ),
  ],
  nextSceneId: "dayOneMetro",
};

const dayOneOutfitComfort: Scene = {
  id: "dayOneOutfitComfort",
  day: 1,
  title: "Reveil",
  audio: "experience/J01_C01_TenueB.mp3",
  dialogues: [
    pensees(
      "d1_3b",
      "déjà que j'ai c'te réu de deux heures trente qui va me faire mal à la tête, autant être confort.",
      {
        timings: [
          { word: "déjà", start: 0.099, end: 0.239 },
          { word: "que", start: 0.259, end: 0.319 },
          { word: "j'ai", start: 0.359, end: 0.439 },
          { word: "c'te", start: 0.479, end: 0.519 },
          { word: "réu", start: 0.659, end: 0.98 },
          { word: "de", start: 0.98, end: 1.12 },
          { word: "deux", start: 1.12, end: 1.199 },
          { word: "heures", start: 1.299, end: 1.5 },
          { word: "trente", start: 1.519, end: 1.759 },
          { word: "qui", start: 1.84, end: 1.899 },
          { word: "va", start: 1.919, end: 2.019 },
          { word: "me", start: 2.019, end: 2.099 },
          { word: "faire", start: 2.119, end: 2.34 },
          { word: "mal", start: 2.359, end: 2.519 },
          { word: "à", start: 2.539, end: 2.599 },
          { word: "la", start: 2.619, end: 2.699 },
          { word: "tête,", start: 2.819, end: 3.519 },
          { word: "autant", start: 3.539, end: 3.779 },
          { word: "être", start: 3.799, end: 3.939 },
          { word: "confort.", start: 3.959, end: 4.379 },
        ],
      }
    ),
  ],
  nextSceneId: "dayOneMetro",
};

const dayOneMetro: Scene = {
  id: "dayOneMetro",
  day: 1,
  title: "Trajet",
  milestone: "trajet",
  dialogues: [
    d(
      "d1_4",
      "Annonce",
      "En raison d'un bagage abandonne, les metros A et B sont suspendus pour une duree indeterminee, nous vous prions de nous excuser pour la gene occasionnee.",
      { annotation: "A la gare." }
    ),
    pensees("d1_5", "Mais QUI m'a envoyee ? C'est troooop"),
  ],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: "dayOneMetroSexy",
    elseSceneId: "dayOneMetroComfort",
  },
};

const dayOneMetroSexy: Scene = {
  id: "dayOneMetroSexy",
  day: 1,
  title: "Trajet",
  audio: "experience/J01_S03_Trajet_A.mp3",
  dialogues: [
    pensees(
      "d1_6a",
      "Je vais aller prendre un vélo et je vais me faire siffler cinq fois sur le chemin. Super !",
      {
        timings: [
          { word: "Je", start: 0.5, end: 0.56 },
          { word: "vais", start: 0.579, end: 0.659 },
          { word: "aller", start: 0.68, end: 0.879 },
          { word: "prendre", start: 0.899, end: 1.099 },
          { word: "un", start: 1.1, end: 1.159 },
          { word: "vélo", start: 1.199, end: 1.539 },
          { word: "et", start: 1.679, end: 1.739 },
          { word: "je", start: 1.779, end: 1.819 },
          { word: "vais", start: 1.839, end: 1.899 },
          { word: "me", start: 1.899, end: 1.98 },
          { word: "faire", start: 2.0, end: 2.159 },
          { word: "siffler", start: 2.18, end: 2.579 },
          { word: "cinq", start: 2.619, end: 2.84 },
          { word: "fois", start: 2.879, end: 3.019 },
          { word: "sur", start: 3.059, end: 3.159 },
          { word: "le", start: 3.159, end: 3.259 },
          { word: "chemin.", start: 3.279, end: 3.899 },
          { word: "Super", start: 3.919, end: 4.319 },
          { word: "!", start: 5.079, end: 5.119 },
        ],
      }
    ),
    d(
      "d1_7a",
      "Inconnue",
      "Coucou, je voulais juste te dire que t'es trop belle. C'est quoi la ref de ta robe ?",
      {
        timings: [
          { word: "Coucou,", start: 5.139, end: 5.519 },
          { word: "je", start: 5.739, end: 5.799 },
          { word: "voulais", start: 5.799, end: 6.019 },
          { word: "juste", start: 6.059, end: 6.199 },
          { word: "te", start: 6.219, end: 6.279 },
          { word: "dire", start: 6.359, end: 6.519 },
          { word: "que", start: 6.539, end: 6.599 },
          { word: "t'es", start: 6.639, end: 6.699 },
          { word: "trop", start: 6.799, end: 7.039 },
          { word: "belle.", start: 7.059, end: 7.48 },
          { word: "C'est", start: 7.539, end: 7.659 },
          { word: "quoi", start: 7.679, end: 7.779 },
          { word: "la", start: 7.799, end: 7.859 },
          { word: "ref", start: 7.919, end: 8.1 },
          { word: "de", start: 8.119, end: 8.239 },
          { word: "ta", start: 8.26, end: 8.4 },
          { word: "robe", start: 8.42, end: 8.659 },
          { word: "?", start: 8.659, end: 9.439 },
        ],
      }
    ),
    d(
      "d1_8a",
      "LUCIE",
      "Oh, merci beaucoup ! C'est une robe Maje, la patineuse à col montant.",
      {
        timings: [
          { word: "Oh,", start: 9.5, end: 9.68 },
          { word: "merci", start: 9.72, end: 10.0 },
          { word: "beaucoup", start: 10.019, end: 10.38 },
          { word: "!", start: 10.439, end: 10.859 },
          { word: "C'est", start: 10.92, end: 11.0 },
          { word: "une", start: 11.039, end: 11.099 },
          { word: "robe", start: 11.18, end: 11.359 },
          { word: "Maje,", start: 11.38, end: 11.879 },
          { word: "la", start: 11.92, end: 11.98 },
          { word: "patineuse", start: 12.039, end: 12.44 },
          { word: "à", start: 12.52, end: 12.539 },
          { word: "col", start: 12.559, end: 12.699 },
          { word: "montant.", start: 12.739, end: 13.579 },
        ],
      }
    ),
    d("d1_9a", "Inconnue", "Merciii.", {
      timings: [{ word: "Merciii.", start: 13.619, end: 15.479 }],
    }),
  ],
  nextSceneId: "dayOneOffice",
};

const dayOneMetroComfort: Scene = {
  id: "dayOneMetroComfort",
  day: 1,
  title: "Trajet",
  dialogues: [
    pensees(
      "d1_6b",
      "Bah velo hein. Ca aurait ete relou avec la robe"
    ),
  ],
  nextSceneId: "dayOneOffice",
};

const dayOneOffice: Scene = {
  id: "dayOneOffice",
  day: 1,
  title: "Bureau",
  milestone: "bureau",
  dialogues: [
    d(
      "d1_10",
      "Collegue",
      "Tu nous rejoins sur Meet ?",
      { annotation: "Open space, bruits de clavier" }
    ),
    d(
      "d1_11",
      "LUCIE",
      "Mince je n'ai pas vu l'heure, j'arrive tout de suite, je vais juste m'installer dans la box de reu"
    ),
    d(
      "d1_12",
      "LUCIE",
      "Salut Karen, je suis desolee, j'avais reserve la salle et j'ai une reu importante avec le produit, tu pourrais me laisser la bulle ?",
      { annotation: "Lucie arrive et voit Karen s'installer dans la box" }
    ),
    d(
      "d1_13",
      "Karen",
      "Ah j'ai encore oublie, la mienne va commencer la, mais y'en a d'autres de libres !"
    ),
  ],
  choices: [
    {
      id: "conflict_submit",
      text: "SE SOUMETTRE",
      nextSceneId: "dayOneConflictSubmit",
      effects: {
        energy: -10,
        flags: { conflictOutcome: "submit" },
      },
    },
    {
      id: "conflict_assert",
      text: "S'AFFIRMER",
      nextSceneId: "dayOneConflictAssert",
      effects: {
        flags: { conflictOutcome: "assert" },
      },
    },
  ],
};

const dayOneConflictSubmit: Scene = {
  id: "dayOneConflictSubmit",
  day: 1,
  title: "Bureau",
  dialogues: [
    d("d1_14a", "LUCIE", "Oui oui, pas de soucis..."),
    pensees(
      "d1_15a",
      "Tu sais tres bien que c'est tout rempli a cette heure la, c'est la 3eme fois que tu me fais le coup."
    ),
    d(
      "d1_16a",
      "Team",
      "Oui, on comprend le point. Apres, l'objectif reste quand meme de tenir le sprint tel qu'il est prevu aujourd'hui...",
      { annotation: "Lucie retourne a son bureau dans l'open space plein de bruit. La reunion commence..." }
    ),
    d(
      "d1_17a",
      "LUCIE",
      "Mais allez jouer ailleurs, j'arrive deja pas a me concentrer !",
      { annotation: "Bruits de nerf, projectiles qui stoppent le dialogue" }
    ),
  ],
  nextSceneId: "dayOneParty",
};

const dayOneConflictAssert: Scene = {
  id: "dayOneConflictAssert",
  day: 1,
  title: "Bureau",
  dialogues: [
    d(
      "d1_14b",
      "LUCIE",
      "Ecoute, y'en a pas d'autres a cette heure la et tu le sais tres bien. On a pas mis les resa des bulles en place pour rien, donc tu vas faire comme moi les deux dernieres fois et tu vas aller faire ta reu dans l'open-space."
    ),
    d("d1_15b", "Karen", "Ca y est ca va, ca va, pas besoin de taper une crise."),
    pensees("d1_16b", "Puis quoi encore ?"),
    d(
      "d1_17b",
      "LUCIE",
      "Je pense que c'est juste pas realisable qu'on boucle ce sprint dans les temps, je comprends qu'on doive avancer sur la roadmap mais les equipes vont se cramer, autant assumer l'echec maintenant pour pouvoir assurer la suite plutot que de communiquer dans l'urgence parce qu'on se sera lances dans un plan deraisonnable.",
      { annotation: "La reunion commence, Lucie participe activement." }
    ),
  ],
  nextSceneId: "dayOneParty",
};

const dayOneParty: Scene = {
  id: "dayOneParty",
  day: 1,
  title: "Soiree",
  milestone: "soiree",
  dialogues: [
    d("d1_18", "Lucie + Ines", "Heyyyyy", { annotation: "Lucie toque a la porte." }),
  ],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: "dayOnePartySexy",
    elseSceneId: "dayOnePartyComfort",
  },
};

const dayOnePartySexy: Scene = {
  id: "dayOnePartySexy",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_19a",
      "Ines",
      "Ca fait plaisir de te voir ! En plus tu viens en resta, epouse moi"
    ),
    d(
      "d1_20a",
      "LUCIE",
      "Ca serait a moi de te dire ca, regarde toi, t'es toute mimi !"
    ),
  ],
  nextSceneId: "dayOneGameEvent",
};

const dayOnePartyComfort: Scene = {
  id: "dayOnePartyComfort",
  day: 1,
  title: "Soiree",
  dialogues: [
    d("d1_19b", "Ines", "Heyyyyy, ca fait plaisir de te voir !"),
    d("d1_20b", "LUCIE", "Moi aussi je suis grave contente, il va bien"),
    d(
      "d1_21b",
      "Ines",
      "Comment il va le petit monstre ? Ca fait longtemps je l'ai pas vu lui non plus !"
    ),
  ],
  nextSceneId: "dayOneGameEvent",
};

const dayOneGameEvent: Scene = {
  id: "dayOneGameEvent",
  day: 1,
  title: "Soiree",
  dialogues: [
    d("d1_22", "Lucas", "Lucie, tu veux jouer avec nous a Presque Consensus ?"),
    pensees(
      "d1_23",
      "Mon Dieu, la derniere fois j'ai rien compris, je me suis trompee 4 fois devant tout le monde et je sentais bien qu'ils etaient soules, je me suis sentie trop conne..."
    ),
  ],
  choices: [
    {
      id: "game_play",
      text: "ESSAYER DE JOUER",
      nextSceneId: "dayOnePlay",
      effects: {
        energy: -100,
        flags: { gameEventChoice: "play", hadBreakdown: true },
      },
    },
    {
      id: "game_refuse",
      text: "REFUSER / DISCUTER",
      nextSceneId: "dayOneRefuse",
      effects: {
        flags: { gameEventChoice: "refuse" },
      },
    },
  ],
};

const dayOnePlay: Scene = {
  id: "dayOnePlay",
  day: 1,
  title: "Soiree",
  audio: "experience/J01_C03A_Jeu.mp3",
  dialogues: [
    d(
      "d1_24",
      "LUCIE",
      "Vas-yyyyy",
      {
        timings: [
          { word: "Vas-yyyyy", start: 0.62, end: 1.499 },
        ],
      }
    ),
    d(
      "d1_25",
      "Lucas",
      "En gros, on discute tous ensemble. Et faut arriver à ce que la majorité du groupe soit d'accord sur une réponse donnée à une question parmi une liste. On gagne en trouvant les influenceurs qui doivent défendre une des options sur la carte.",
      {
        timings: [
          { word: "En", start: 2.539, end: 2.599 },
          { word: "gros,", start: 2.659, end: 2.819 },
          { word: "on", start: 2.819, end: 2.899 },
          { word: "discute", start: 2.939, end: 3.239 },
          { word: "tous", start: 3.259, end: 3.399 },
          { word: "ensemble.", start: 3.419, end: 4.019 },
          { word: "Et", start: 4.019, end: 4.059 },
          { word: "faut", start: 4.139, end: 4.239 },
          { word: "arriver", start: 4.279, end: 4.48 },
          { word: "à", start: 4.48, end: 4.539 },
          { word: "ce", start: 4.559, end: 4.599 },
          { word: "que", start: 4.619, end: 4.679 },
          { word: "la", start: 4.699, end: 4.759 },
          { word: "majorité", start: 4.859, end: 5.239 },
          { word: "du", start: 5.259, end: 5.339 },
          { word: "groupe", start: 5.359, end: 5.559 },
          { word: "soit", start: 5.619, end: 5.719 },
          { word: "d'accord", start: 5.739, end: 6.0 },
          { word: "sur", start: 6.059, end: 6.219 },
          { word: "une", start: 6.239, end: 6.379 },
          { word: "réponse", start: 6.399, end: 6.719 },
          { word: "donnée", start: 6.779, end: 7.0 },
          { word: "à", start: 7.019, end: 7.059 },
          { word: "une", start: 7.059, end: 7.119 },
          { word: "question", start: 7.179, end: 7.639 },
          { word: "parmi", start: 7.639, end: 7.919 },
          { word: "une", start: 7.919, end: 8.02 },
          { word: "liste.", start: 8.06, end: 8.759 },
          { word: "On", start: 8.8, end: 8.88 },
          { word: "gagne", start: 8.96, end: 9.119 },
          { word: "en", start: 9.139, end: 9.199 },
          { word: "trouvant", start: 9.26, end: 9.519 },
          { word: "les", start: 9.539, end: 9.619 },
          { word: "influenceurs", start: 9.659, end: 10.099 },
          { word: "qui", start: 10.119, end: 10.199 },
          { word: "doivent", start: 10.219, end: 10.42 },
          { word: "défendre", start: 10.46, end: 10.779 },
          { word: "une", start: 10.8, end: 10.9 },
          { word: "des", start: 10.9, end: 11.0 },
          { word: "options", start: 11.039, end: 11.299 },
          { word: "sur", start: 11.34, end: 11.42 },
          { word: "la", start: 11.439, end: 11.519 },
          { word: "carte.", start: 11.56, end: 12.0 },
        ],
      }
    ),
    d(
      "d1_26",
      "LUCIE",
      "Ok.",
      {
        timings: [
          { word: "Ok.", start: 12.42, end: 12.819 },
        ],
      }
    ),
    d(
      "d1_27",
      "Lucas",
      "Au début, tu pioches une carte rôle. Tu la regardes en discret. Ensuite, on révèle la question du tour et les cartes opinions que t'as en main, c'est les sous-sujets qui te font gagner des points si TU les abordes. T'es pas obligé de toutes les jouer. Par contre, si tu utilises d'autres axes d'argumentation, tu perds des points.",
      {
        timings: [
          { word: "Au", start: 13.819, end: 13.88 },
          { word: "début,", start: 13.92, end: 14.159 },
          { word: "tu", start: 14.219, end: 14.3 },
          { word: "pioches", start: 14.34, end: 14.539 },
          { word: "une", start: 14.559, end: 14.639 },
          { word: "carte", start: 14.68, end: 14.899 },
          { word: "rôle.", start: 14.96, end: 15.22 },
          { word: "Tu", start: 15.38, end: 15.44 },
          { word: "la", start: 15.48, end: 15.539 },
          { word: "regardes", start: 15.559, end: 15.8 },
          { word: "en", start: 15.8, end: 15.899 },
          { word: "discret.", start: 15.96, end: 16.899 },
          { word: "Ensuite,", start: 16.92, end: 17.459 },
          { word: "on", start: 17.5, end: 17.559 },
          { word: "révèle", start: 17.6, end: 17.819 },
          { word: "la", start: 17.84, end: 17.899 },
          { word: "question", start: 17.94, end: 18.159 },
          { word: "du", start: 18.219, end: 18.299 },
          { word: "tour", start: 18.359, end: 18.939 },
          { word: "et", start: 19.039, end: 19.1 },
          { word: "les", start: 19.1, end: 19.219 },
          { word: "cartes", start: 19.239, end: 19.399 },
          { word: "opinions", start: 19.42, end: 19.659 },
          { word: "que", start: 19.68, end: 19.739 },
          { word: "t'as", start: 19.76, end: 19.799 },
          { word: "en", start: 19.879, end: 19.96 },
          { word: "main,", start: 19.979, end: 20.159 },
          { word: "c'est", start: 20.18, end: 20.26 },
          { word: "les", start: 20.26, end: 20.34 },
          { word: "sous-sujets", start: 20.379, end: 20.76 },
          { word: "qui", start: 20.78, end: 20.859 },
          { word: "te", start: 20.88, end: 20.94 },
          { word: "font", start: 20.94, end: 21.04 },
          { word: "gagner", start: 21.06, end: 21.2 },
          { word: "des", start: 21.219, end: 21.299 },
          { word: "points", start: 21.359, end: 21.5 },
          { word: "si", start: 21.559, end: 21.679 },
          { word: "TU", start: 21.68, end: 21.76 },
          { word: "les", start: 21.899, end: 22.04 },
          { word: "abordes.", start: 22.1, end: 22.5 },
          { word: "T'es", start: 22.659, end: 22.8 },
          { word: "pas", start: 22.819, end: 22.899 },
          { word: "obligé", start: 22.92, end: 23.079 },
          { word: "de", start: 23.1, end: 23.159 },
          { word: "toutes", start: 23.18, end: 23.319 },
          { word: "les", start: 23.319, end: 23.399 },
          { word: "jouer.", start: 23.439, end: 24.1 },
          { word: "Par", start: 24.1, end: 24.22 },
          { word: "contre,", start: 24.279, end: 24.54 },
          { word: "si", start: 24.579, end: 24.639 },
          { word: "tu", start: 24.699, end: 24.78 },
          { word: "utilises", start: 24.88, end: 25.18 },
          { word: "d'autres", start: 25.18, end: 25.459 },
          { word: "axes", start: 25.519, end: 25.7 },
          { word: "d'argumentation,", start: 25.72, end: 26.439 },
          { word: "tu", start: 26.46, end: 26.559 },
          { word: "perds", start: 26.6, end: 26.719 },
          { word: "des", start: 26.76, end: 26.819 },
          { word: "points.", start: 26.879, end: 27.42 },
        ],
      }
    ),
    d(
      "d1_27_2",
      "Lucas",
      "'Fin, tu peux reformuler, t'as capté, mais il faut que ça reste fidèle à l'esprit de la carte. Il y a un GM qui va juger de ça et qui prend des notes. Il y a des jetons influence qu'on peut utiliser.",
      {
        timings: [
          { word: "'Fin,", start: 28.899, end: 29.039 },
          { word: "tu", start: 29.079, end: 29.139 },
          { word: "peux", start: 29.179, end: 29.26 },
          { word: "reformuler,", start: 29.28, end: 29.68 },
          { word: "t'as", start: 29.7, end: 29.819 },
          { word: "capté,", start: 29.819, end: 30.079 },
          { word: "mais", start: 30.1, end: 30.159 },
          { word: "il", start: 30.159, end: 30.219 },
          { word: "faut", start: 30.219, end: 30.299 },
          { word: "que", start: 30.299, end: 30.36 },
          { word: "ça", start: 30.399, end: 30.44 },
          { word: "reste", start: 30.479, end: 30.619 },
          { word: "fidèle", start: 30.679, end: 30.96 },
          { word: "à", start: 31.0, end: 31.02 },
          { word: "l'esprit", start: 31.04, end: 31.28 },
          { word: "de", start: 31.3, end: 31.34 },
          { word: "la", start: 31.36, end: 31.42 },
          { word: "carte.", start: 31.479, end: 31.86 },
          { word: "Il", start: 31.86, end: 31.959 },
          { word: "y", start: 31.959, end: 31.959 },
          { word: "a", start: 31.959, end: 32.0 },
          { word: "un", start: 32.0, end: 32.06 },
          { word: "GM", start: 32.119, end: 32.299 },
          { word: "qui", start: 32.34, end: 32.4 },
          { word: "va", start: 32.439, end: 32.52 },
          { word: "juger", start: 32.58, end: 32.759 },
          { word: "de", start: 32.779, end: 32.84 },
          { word: "ça", start: 32.88, end: 33.0 },
          { word: "et", start: 33.099, end: 33.2 },
          { word: "qui", start: 33.22, end: 33.359 },
          { word: "prend", start: 33.4, end: 33.52 },
          { word: "des", start: 33.54, end: 33.619 },
          { word: "notes.", start: 33.639, end: 34.719 },
          { word: "Il", start: 34.759, end: 34.84 },
          { word: "y", start: 34.84, end: 34.84 },
          { word: "a", start: 34.86, end: 34.88 },
          { word: "des", start: 34.92, end: 34.979 },
          { word: "jetons", start: 35.04, end: 35.299 },
          { word: "influence", start: 35.36, end: 35.819 },
          { word: "qu'on", start: 35.86, end: 36.0 },
          { word: "peut", start: 36.02, end: 36.119 },
          { word: "utiliser.", start: 36.18, end: 36.52 },
        ],
      }
    ),
    pensees(
      "d1_28",
      "Je comprends rien.",
      {
        timings: [
          { word: "Je", start: 39.34, end: 39.399 },
          { word: "comprends", start: 39.439, end: 39.88 },
          { word: "rien.", start: 39.959, end: 40.699 },
        ],
      }
    ),
    d(
      "d1_29",
      "Lucas",
      "...Il les distribuera parmi les cartes bidon toutes les deux minutes, mais t'es pas obligé de toutes les utiliser. Que quand tu en as deux, tu as déjà validé une, mais tu gardes un et directement au tour deux.",
      {
        timings: [
          { word: "...Il", start: 40.7, end: 40.739 },
          { word: "les", start: 40.759, end: 40.84 },
          { word: "distribuera", start: 40.88, end: 41.42 },
          { word: "parmi", start: 41.459, end: 41.639 },
          { word: "les", start: 41.7, end: 41.759 },
          { word: "cartes", start: 41.799, end: 41.88 },
          { word: "bidon", start: 41.959, end: 42.22 },
          { word: "toutes", start: 42.259, end: 42.399 },
          { word: "les", start: 42.419, end: 42.479 },
          { word: "deux", start: 42.52, end: 42.579 },
          { word: "minutes,", start: 42.619, end: 43.279 },
          { word: "mais", start: 43.299, end: 43.36 },
          { word: "t'es", start: 43.38, end: 43.52 },
          { word: "pas", start: 43.54, end: 43.599 },
          { word: "obligé", start: 43.659, end: 43.88 },
          { word: "de", start: 43.899, end: 43.959 },
          { word: "toutes", start: 43.979, end: 44.139 },
          { word: "les", start: 44.159, end: 44.239 },
          { word: "utiliser.", start: 44.36, end: 44.799 },
          { word: "Que", start: 44.84, end: 44.899 },
          { word: "quand", start: 44.939, end: 45.059 },
          { word: "tu", start: 45.099, end: 45.119 },
          { word: "en", start: 45.139, end: 45.18 },
          { word: "as", start: 45.26, end: 45.319 },
          { word: "deux,", start: 45.38, end: 45.599 },
          { word: "tu", start: 45.7, end: 45.72 },
          { word: "as", start: 45.739, end: 45.84 },
          { word: "déjà", start: 45.84, end: 46.02 },
          { word: "validé", start: 46.06, end: 46.34 },
          { word: "une,", start: 46.42, end: 46.54 },
          { word: "mais", start: 46.54, end: 46.659 },
          { word: "tu", start: 46.68, end: 47.02 },
          { word: "gardes", start: 47.04, end: 47.159 },
          { word: "un", start: 47.18, end: 47.279 },
          { word: "et", start: 47.379, end: 47.439 },
          { word: "directement", start: 47.5, end: 47.86 },
          { word: "au", start: 47.88, end: 47.959 },
          { word: "tour", start: 47.979, end: 48.099 },
          { word: "deux.", start: 48.159, end: 48.419 },
        ],
      }
    ),
    d(
      "d1_30",
      "LUCIE",
      "Je me sens pas bien. Je reviens.",
      {
        timings: [
          { word: "Je", start: 48.68, end: 48.72 },
          { word: "me", start: 48.76, end: 48.819 },
          { word: "sens", start: 48.88, end: 49.0 },
          { word: "pas", start: 49.06, end: 49.2 },
          { word: "bien.", start: 49.24, end: 49.52 },
          { word: "Je", start: 49.819, end: 49.86 },
          { word: "reviens.", start: 49.92, end: 53.7 },
        ],
      }
    ),
    pensees(
      "d1_31",
      "[respiration] Tout va bien. Ça va aller, c'est rien. C'est rien.",
      {
        timings: [
          { word: "[respiration]", start: 55.939, end: 56.2 },
          { word: "Tout", start: 56.219, end: 56.319 },
          { word: "va", start: 56.36, end: 56.459 },
          { word: "bien.", start: 56.54, end: 56.88 },
          { word: "Ça", start: 57.659, end: 57.719 },
          { word: "va", start: 57.799, end: 57.86 },
          { word: "aller,", start: 57.92, end: 58.299 },
          { word: "c'est", start: 58.319, end: 58.459 },
          { word: "rien.", start: 58.5, end: 59.319 },
          { word: "C'est", start: 59.4, end: 59.5 },
          { word: "rien.", start: 59.56, end: 62.239 },
        ],
      }
    ),
    d(
      "d1_32",
      "Ines",
      "Lucie ? Lucie ? Luci.. Hey, t'es partie d'un coup et t'es toute pâle. Ça va ?",
      {
        timings: [
          { word: "Lucie", start: 62.259, end: 63.639 },
          { word: "?", start: 63.659, end: 63.68 },
          { word: "Lucie ?", start: 63.72, end: 64.259 },
          { word: "Luci..", start: 64.919, end: 65.199 },
          { word: "Hey,", start: 66.799, end: 67.019 },
          { word: "t'es", start: 67.059, end: 67.179 },
          { word: "partie", start: 67.22, end: 67.439 },
          { word: "d'un", start: 67.479, end: 67.62 },
          { word: "coup", start: 67.659, end: 67.739 },
          { word: "et", start: 67.76, end: 67.819 },
          { word: "t'es", start: 67.86, end: 67.959 },
          { word: "toute", start: 68.0, end: 68.179 },
          { word: "pâle.", start: 68.22, end: 68.799 },
          { word: "Ça", start: 68.879, end: 68.939 },
          { word: "va", start: 69.04, end: 69.22 },
          { word: "?", start: 69.239, end: 69.259 },
        ],
      }
    ),
    d(
      "d1_33",
      "LUCIE",
      "Non, j'ai vraiment eu une sale journée. Je suis au bout, là. Je peux plus. Faut que je rentre.",
      {
        timings: [
          { word: "Non,", start: 69.879, end: 70.039 },
          { word: "j'ai", start: 70.08, end: 70.179 },
          { word: "vraiment", start: 70.22, end: 70.44 },
          { word: "eu", start: 70.459, end: 70.519 },
          { word: "une", start: 70.54, end: 70.639 },
          { word: "sale", start: 70.68, end: 70.859 },
          { word: "journée.", start: 70.919, end: 71.319 },
          { word: "Je", start: 71.339, end: 71.4 },
          { word: "suis", start: 71.419, end: 71.519 },
          { word: "au", start: 71.54, end: 71.639 },
          { word: "bout,", start: 71.68, end: 71.859 },
          { word: "là.", start: 71.879, end: 72.439 },
          { word: "Je", start: 72.479, end: 72.559 },
          { word: "peux", start: 72.599, end: 72.739 },
          { word: "plus.", start: 72.779, end: 73.12 },
          { word: "Faut", start: 73.379, end: 73.479 },
          { word: "que", start: 73.5, end: 73.54 },
          { word: "je", start: 73.559, end: 73.62 },
          { word: "rentre.", start: 73.659, end: 74.899 },
        ],
      }
    ),
    d(
      "d1_34",
      "Ines",
      "Ok, je comprends. Assieds-toi dans ma chambre, je t'appelle un Uber.",
      {
        timings: [
          { word: "Ok,", start: 74.98, end: 75.199 },
          { word: "je", start: 75.22, end: 75.259 },
          { word: "comprends.", start: 75.299, end: 75.94 },
          { word: "Assieds-toi", start: 75.979, end: 76.299 },
          { word: "dans", start: 76.339, end: 76.44 },
          { word: "ma", start: 76.479, end: 76.539 },
          { word: "chambre,", start: 76.62, end: 76.779 },
          { word: "je", start: 76.779, end: 76.819 },
          { word: "t'appelle", start: 76.839, end: 77.08 },
          { word: "un", start: 77.099, end: 77.159 },
          { word: "Uber.", start: 77.22, end: 78.359 },
        ],
      }
    ),
    d(
      "d1_35",
      "LUCIE",
      "Merci ma douce..",
      {
        timings: [
          { word: "Merci", start: 78.379, end: 78.639 },
          { word: "ma", start: 78.72, end: 78.799 },
          { word: "douce..", start: 78.9, end: 79.459 },
        ],
      }
    ),
  ],
  nextSceneId: "dayOneEndCrash",
};



const dayOneRefuse: Scene = {
  id: "dayOneRefuse",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_36",
      "LUCIE",
      "Je vais plutot en profiter pour discuter avec Ines, ca fait longtemps"
    ),
    d("d1_37", "Lucas", "T'inquietes pas de soucis ! Bon du coup Presque Consensus..."),
    d(
      "d1_38",
      "LUCIE",
      "Nan mais faut que je te raconte un truc qui s'est passe tout a l'heure avec la vieille meuf aigrie de mon taff"
    ),
    d("d1_39", "Ines", "Let's gooooooo"),
    d(
      "d1_40",
      "LUCIE",
      "J'avais une reu ce matin, et vu que c'est toujours le bordel dans l'open-space j'ai reserve une des petites cabanes a isolation phonique, c'est pas je la vois dans la cabane et elle veut pas bouger ?"
    ),
    d("d1_41", "Ines", "he pitie, dis moi que tu l'as bougee de la"),
  ],
  autoChoice: {
    condition: { flag: "conflictOutcome", operator: "equals", value: "assert" },
    thenSceneId: "dayOneRefuseAssert",
    elseSceneId: "dayOneRefuseSubmit",
  },
};

const dayOneRefuseAssert: Scene = {
  id: "dayOneRefuseAssert",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_42a",
      "LUCIE",
      "Mais bien sur que je l'ai bougee de la, mais c'est pas dans l'aprem je recois un mail du responsable pour un truc rien a voir ? Elle est allee me balancer parceque la semaine derniere je suis partie plus tot mardi pour regler des trucs perso c'te sorciere"
    ),
  ],
  nextSceneId: "dayOneEndGood",
};

const dayOneRefuseSubmit: Scene = {
  id: "dayOneRefuseSubmit",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_42b",
      "LUCIE",
      "J'ai pas eu la force de me battre encore, cette fois pour cette putain de cabine, ces derniers temps je suis usee. Le pire c'est que ca me degoute, je sais quoi faire. Et tu sais pourquoi ces gens ils font ca ? parce qu'ils sont pas encore tombes sur quelqu'un qui va les choquer"
    ),
    d(
      "d1_43b",
      "Ines",
      "On peut pas gagner toutes les batailles, vas y step by step, si tu veux ce week-end on t'aidera a trouver les mots pour mettre tes limites"
    ),
    d(
      "d1_44b",
      "LUCIE",
      "Ah genre tu vas la RP ? Hahaha trop bien, on fera ca, merci d'etre la"
    ),
    d("d1_45b", "Ines", "Toujours"),
  ],
  nextSceneId: "dayOneEndGood",
};

const dayOneEndCrash: Scene = {
  id: "dayOneEndCrash",
  day: 1,
  title: "Retour",
  milestone: "retour",
  dialogues: [
    d(
      "d1_46",
      "Message",
      "Je suis bien arrivee, merci pour la soiree et de m'avoir fait ramener",
      { annotation: "Bruits de cles, porte qui s'ouvre, lumiere qui s'allume." }
    ),
    d(
      "d1_47",
      "LUCIE",
      "Je gache toujours tout, pourquoi je suis pas normale ?",
      { annotation: "Eau qui coule. Pots qui s'ouvrent, bruits de sachets... Debut de pleurs." }
    ),
  ],
  nextSceneId: "dayTwoWakeup",
};

const dayOneEndGood: Scene = {
  id: "dayOneEndGood",
  day: 1,
  title: "Retour",
  milestone: "retour",
  dialogues: [
    d(
      "d1_48",
      "Message",
      "Je suis bien arrivee, merci pour la soiree",
      { annotation: "Bruits de cles, porte qui s'ouvre, lumiere qui s'allume." }
    ),
  ],
  autoChoice: {
    condition: { flag: "conflictOutcome", operator: "equals", value: "assert" },
    thenSceneId: "dayOneEndGoodAssert",
    elseSceneId: "dayOneEndGoodReflect",
  },
};

const dayOneEndGoodAssert: Scene = {
  id: "dayOneEndGoodAssert",
  day: 1,
  title: "Retour",
  dialogues: [
    pensees(
      "d1_49a",
      "Je suis fiere de moi, j'ai fait une bonne journee, je me suis pas laissee marcher dessus, j'ai su dire non quand j'avais pas envie."
    ),
    pensees(
      "d1_50a",
      "Je suis trop heureuse d'avoir des amis comme ca, toujours la pour ecouter mes galeres. Ca peut etre 100x la meme chose, ca peut etre long comme un lundi avec mes vocaux d'une minute 30, ca peut sembler insignifiant pour la plupart des gens, et pourtant, elles sont toujours la pour m'ecouter avec la meme attention, pour me consoler, pour me donner les meilleurs conseils. Je suis tellement reconnaissante."
    ),
  ],
  nextSceneId: "dayTwoWakeup",
};

const dayOneEndGoodReflect: Scene = {
  id: "dayOneEndGoodReflect",
  day: 1,
  title: "Retour",
  dialogues: [
    pensees(
      "d1_49b",
      "Je suis trop heureuse d'avoir des amis comme ca, toujours la pour ecouter mes galeres. Ca peut etre 100x la meme chose, ca peut etre long comme un lundi avec mes vocaux d'une minute 30, ca peut sembler insignifiant pour la plupart des gens, et pourtant, elles sont toujours la pour m'ecouter avec la meme attention, pour me consoler, pour me donner les meilleurs conseils. Je suis tellement reconnaissante."
    ),
  ],
  nextSceneId: "dayTwoWakeup",
};

// ============================================
// SCENES JOUR 2
// ============================================

const dayTwoWakeup: Scene = {
  id: "dayTwoWakeup",
  day: 2,
  title: "Reveil",
  dialogues: [],
  autoChoice: {
    condition: { flag: "hadBreakdown", operator: "equals", value: true },
    thenSceneId: "dayTwoWakeupCrash",
    elseSceneId: "dayTwoWakeupGood",
  },
};

const dayTwoWakeupCrash: Scene = {
  id: "dayTwoWakeupCrash",
  day: 2,
  title: "Reveil",
  dialogues: [
    pensees(
      "d2_1a",
      "J'ai trop mal dormi, je me sens lourde. je vais aller a la montagne aujourd'hui, ca me fera du bien.",
      { annotation: "Le reveil sonne, les oiseaux chantent, bruits de couette" }
    ),
  ],
  nextSceneId: "dayTwoCall",
};

const dayTwoWakeupGood: Scene = {
  id: "dayTwoWakeupGood",
  day: 2,
  title: "Reveil",
  dialogues: [
    pensees(
      "d2_1b",
      "C'est aujourd'hui que j'avais prevu d'aller a la montagne, j'avais pas vu la semaine passer, j'ai encore jamais fait la croix de Chamrousse.",
      { annotation: "Le reveil sonne, les oiseaux chantent, bruits de couette" }
    ),
  ],
  nextSceneId: "dayTwoCall",
};

const dayTwoCall: Scene = {
  id: "dayTwoCall",
  day: 2,
  title: "Appel",
  dialogues: [
    d(
      "d2_2",
      "Ami",
      "Coucou, je suis desole de deranger si tot, je t'appelle parcequ'on a un souci, tu te souviens je t'avais dit que je demenageais aujourd'hui et j'ai plus personne pour conduire le camion de loc, y'a So qui a une grippe carabinee il est couche la, est-ce que tu pourrais venir tout a l'heure, y'a 3 allers-retours a faire je pense.",
      { annotation: "Le telephone sonne..." }
    ),
  ],
  choices: [
    {
      id: "accept_move",
      text: "ACCEPTER",
      nextSceneId: "dayTwoAccept",
      condition: { flag: "energy", operator: "greaterThan", value: 0 },
      disabledReason: "(Energie insuffisante)",
    },
    {
      id: "refuse_move",
      text: "REFUSER",
      nextSceneId: "dayTwoRefuse",
    },
  ],
};

const dayTwoAccept: Scene = {
  id: "dayTwoAccept",
  day: 2,
  title: "Appel",
  dialogues: [
    d(
      "d2_3a",
      "LUCIE",
      "Nooooooon, t'sais quoi je devais aller a la montagne aujourd'hui ca fait 2 semaines que je repousse."
    ),
    d(
      "d2_4a",
      "Ami",
      "Ah pitie pitie pitie, j'ai personne d'autre qui a le permis qui est dispo aujourd'hui, j'ai fait le tour t'es mon dernier espoir, sinon j'ai loue le camion et fait venir les gens pour rien, j'te jure que je te revaudrai ca."
    ),
    d(
      "d2_5a",
      "LUCIE",
      "Okay okay, ca y est, je te rejoins chez toi tout a l'heure."
    ),
    d(
      "d2_6a",
      "Ami",
      "Merci vraiment, t'sais quoi je te paye resto la prochaine fois"
    ),
    d("d2_7a", "LUCIE", "Y'a interet d'avoir du homard hein !"),
  ],
  nextSceneId: "dayTwoMoving",
};

const dayTwoRefuse: Scene = {
  id: "dayTwoRefuse",
  day: 2,
  title: "Appel",
  dialogues: [
    d(
      "d2_3b",
      "LUCIE",
      "... Je suis desolee, je suis franchement pas en etat de voir des gens et j'ai vraiment besoin de prendre du temps pour moi, mais demande a Lucas, il est dispo ajd"
    ),
    d(
      "d2_4b",
      "Ami",
      "Ca marche, prends soin de toi et on se voit bientot pour la cremaillere alors, gros bisous"
    ),
    d(
      "d2_5b",
      "LUCIE",
      "Avec plaisir, desolee encore, gros bisous et bon courage !"
    ),
  ],
  nextSceneId: "dayTwoMountain",
};

const dayTwoMountain: Scene = {
  id: "dayTwoMountain",
  day: 2,
  title: "Montagne",
  milestone: "montagne",
  audio: "experience/J02_S02_Montagne.mp3",
  dialogues: [
    d(
      "d2_6",
      "LUCIE",
      "C'est une mésange boréale, ça, elles sont magnifiques !",
      {
        annotation: "Bruits d'oiseaux",
        timings: [
          { word: "C'est", start: 5.38, end: 5.5 },
          { word: "une", start: 5.539, end: 5.599 },
          { word: "mésange", start: 5.639, end: 6 },
          { word: "boréale,", start: 6.019, end: 6.48 },
          { word: "ça,", start: 6.519, end: 6.699 },
          { word: "e", start: 7.119, end: 7.139 },
          { word: "lles", start: 7.139, end: 7.219 },
          { word: "sont", start: 7.279, end: 7.519 },
          { word: "magnifiques", start: 7.579, end: 8.4 },
          { word: "!", start: 8.539, end: 9.119 },
        ],
      }
    ),
    d(
      "d2_7",
      "LUCIE",
      "J'ai pas l'habitude de venir en Belledonne et on ose me dire qu'il en faut beaucoup pour m'impressionner, alors qu'il suffit littéralement d'un tas de cailloux, des arbres et des beaux nuages. Ça fait tellement de bien, je retrouve mon oxygène.",
      {
        timings: [
          { word: "J'ai", start: 10.599, end: 10.759 },
          { word: "pas", start: 10.779, end: 10.859 },
          { word: "l'habitude", start: 10.88, end: 11.42 },
          { word: "de", start: 11.439, end: 11.539 },
          { word: "venir", start: 11.539, end: 11.779 },
          { word: "en", start: 11.779, end: 11.88 },
          { word: "Belledonne", start: 11.899, end: 12.119 },
          { word: "et", start: 12.84, end: 12.92 },
          { word: "on", start: 12.939, end: 13.099 },
          { word: "ose", start: 13.18, end: 13.359 },
          { word: "me", start: 13.4, end: 13.479 },
          { word: "dire", start: 13.56, end: 13.719 },
          { word: "qu'il", start: 13.76, end: 13.88 },
          { word: "en", start: 13.92, end: 13.979 },
          { word: "faut", start: 14.02, end: 14.179 },
          { word: "beaucoup", start: 14.22, end: 14.5 },
          { word: "pour", start: 14.519, end: 14.619 },
          { word: "m'impressionner,", start: 14.639, end: 15.399 },
          { word: "alors", start: 15.46, end: 15.619 },
          { word: "qu'il", start: 15.619, end: 15.739 },
          { word: "suffit", start: 15.84, end: 16.059 },
          { word: "littéralement", start: 16.1, end: 16.579 },
          { word: "d'un", start: 16.579, end: 16.759 },
          { word: "tas", start: 16.76, end: 16.88 },
          { word: "de", start: 16.899, end: 16.979 },
          { word: "cailloux,", start: 17.02, end: 17.68 },
          { word: "des", start: 17.719, end: 17.859 },
          { word: "arbres", start: 17.94, end: 18.319 },
          { word: "et", start: 18.359, end: 18.44 },
          { word: "des", start: 18.46, end: 18.579 },
          { word: "beaux", start: 18.619, end: 18.78 },
          { word: "nuages.", start: 18.819, end: 20.78 },
          { word: "Ça", start: 20.859, end: 20.96 },
          { word: "fait", start: 21.02, end: 21.18 },
          { word: "tellement", start: 21.239, end: 21.599 },
          { word: "de", start: 21.64, end: 21.739 },
          { word: "bien,", start: 21.779, end: 22.42 },
          { word: "je", start: 22.44, end: 22.519 },
          { word: "retrouve", start: 22.559, end: 22.84 },
          { word: "mon", start: 22.86, end: 22.96 },
          { word: "oxygène.", start: 23.039, end: 24.559 },
        ],
      }
    ),
    pensees(
      "d2_8",
      "Trop longtemps que je décale, que je prends pas de temps pour moi, mais je suis importante aussi. Je vous aime, mais j'ai aussi besoin de temps pour me retrouver. Je vous écoute, je vous donne, je ressens vos émotions plus que vous ne pourriez l'imaginer. Et c'est ma bénédiction en réalité. Ça m'a donné des amis, des liens, des relations, des aventures véritables que je suis vraiment reconnaissante d'avoir. Viendra un jour où j'aurai le courage, où je leur raconterai que je vois la vie en mille couleurs, en mille sons, la forme et la profondeur de leur voix et de leurs expressions. Je leur raconterai que parfois, le silence résonne fort comme un cri. Et je leur raconterai, je vous raconterai, le plaisir d'être réellement comprise, de ne pas se sentir anormale, mais simplement différente, d'avoir la tête et le cœur qui s'emballent tout le temps. La vie a plus de goût, même s'il est parfois amer.",
      {
        annotation: "Bruits d'oiseaux",
        timings: [
          { word: "Trop", start: 26, end: 26.119 },
          { word: "longtemps", start: 26.139, end: 26.459 },
          { word: "que", start: 26.5, end: 26.54 },
          { word: "je", start: 26.539, end: 26.6 },
          { word: "décale,", start: 26.639, end: 27.319 },
          { word: "que", start: 27.34, end: 27.419 },
          { word: "je", start: 27.44, end: 27.519 },
          { word: "prends", start: 27.54, end: 27.68 },
          { word: "pas", start: 27.72, end: 27.799 },
          { word: "de", start: 27.84, end: 27.899 },
          { word: "temps", start: 27.92, end: 28.079 },
          { word: "pour", start: 28.119, end: 28.239 },
          { word: "moi,", start: 28.299, end: 28.739 },
          { word: "mais", start: 28.739, end: 28.84 },
          { word: "je", start: 28.86, end: 28.899 },
          { word: "suis", start: 28.92, end: 29.02 },
          { word: "importante", start: 29.04, end: 29.479 },
          { word: "aussi.", start: 29.52, end: 30.479 },
          { word: "Je", start: 30.5, end: 30.539 },
          { word: "vous", start: 30.599, end: 30.76 },
          { word: "aime,", start: 30.819, end: 31.299 },
          { word: "mais", start: 31.34, end: 31.42 },
          { word: "j'ai", start: 31.44, end: 31.559 },
          { word: "aussi", start: 31.559, end: 31.739 },
          { word: "besoin", start: 31.799, end: 32 },
          { word: "de", start: 32.02, end: 32.119 },
          { word: "temps", start: 32.139, end: 32.299 },
          { word: "pour", start: 32.34, end: 32.418 },
          { word: "me", start: 32.459, end: 32.52 },
          { word: "retrouver.", start: 32.54, end: 33.939 },
          { word: "Je", start: 33.979, end: 34.02 },
          { word: "vous", start: 34.08, end: 34.2 },
          { word: "écoute,", start: 34.36, end: 34.919 },
          { word: "je", start: 34.979, end: 35.02 },
          { word: "vous", start: 35.08, end: 35.18 },
          { word: "donne,", start: 35.24, end: 35.72 },
          { word: "je", start: 35.74, end: 35.779 },
          { word: "ressens", start: 35.84, end: 36.079 },
          { word: "vos", start: 36.119, end: 36.22 },
          { word: "émotions", start: 36.319, end: 36.699 },
          { word: "plus", start: 36.76, end: 36.88 },
          { word: "que", start: 36.979, end: 37.06 },
          { word: "vous", start: 37.1, end: 37.159 },
          { word: "ne", start: 37.18, end: 37.279 },
          { word: "pourriez", start: 37.299, end: 37.52 },
          { word: "l'imaginer.", start: 37.54, end: 38.159 },
          { word: "Et", start: 38.559, end: 38.619 },
          { word: "c'est", start: 38.659, end: 38.739 },
          { word: "ma", start: 38.779, end: 38.84 },
          { word: "bénédiction", start: 38.9, end: 39.419 },
          { word: "en", start: 39.479, end: 39.54 },
          { word: "réalité.", start: 39.6, end: 40.699 },
          { word: "Ça", start: 40.76, end: 40.84 },
          { word: "m'a", start: 40.86, end: 40.939 },
          { word: "donné", start: 41, end: 41.18 },
          { word: "des", start: 41.22, end: 41.34 },
          { word: "amis,", start: 41.439, end: 41.88 },
          { word: "des", start: 41.919, end: 42.02 },
          { word: "liens,", start: 42.08, end: 42.599 },
          { word: "des", start: 42.659, end: 42.739 },
          { word: "relations,", start: 42.779, end: 43.7 },
          { word: "des", start: 43.76, end: 43.88 },
          { word: "aventures", start: 43.92, end: 44.299 },
          { word: "véritables", start: 44.34, end: 44.84 },
          { word: "que", start: 44.9, end: 44.959 },
          { word: "je", start: 44.979, end: 45.04 },
          { word: "suis", start: 45.079, end: 45.18 },
          { word: "vraiment", start: 45.24, end: 45.459 },
          { word: "reconnaissante", start: 45.479, end: 46.02 },
          { word: "d'avoir.", start: 46.04, end: 48.259 },
          { word: "Viendra", start: 48.84, end: 49.139 },
          { word: "un", start: 49.18, end: 49.299 },
          { word: "jour", start: 49.36, end: 49.52 },
          { word: "où", start: 49.56, end: 49.619 },
          { word: "j'aurai", start: 49.619, end: 49.84 },
          { word: "le", start: 49.86, end: 49.939 },
          { word: "courage,", start: 50, end: 50.819 },
          { word: "où", start: 50.86, end: 50.919 },
          { word: "je", start: 50.959, end: 51 },
          { word: "leur", start: 51.04, end: 51.2 },
          { word: "raconterai", start: 51.219, end: 51.86 },
          { word: "que", start: 51.9, end: 51.959 },
          { word: "je", start: 52.02, end: 52.06 },
          { word: "vois", start: 52.099, end: 52.2 },
          { word: "la", start: 52.22, end: 52.279 },
          { word: "vie", start: 52.36, end: 52.459 },
          { word: "en", start: 52.479, end: 52.56 },
          { word: "mille", start: 52.599, end: 52.759 },
          { word: "couleurs,", start: 52.819, end: 53.339 },
          { word: "en", start: 53.4, end: 53.5 },
          { word: "mille", start: 53.56, end: 53.779 },
          { word: "sons,", start: 53.86, end: 54.419 },
          { word: "la", start: 54.479, end: 54.6 },
          { word: "forme", start: 54.68, end: 54.939 },
          { word: "et", start: 54.979, end: 55.04 },
          { word: "la", start: 55.06, end: 55.139 },
          { word: "profondeur", start: 55.2, end: 55.639 },
          { word: "de", start: 55.68, end: 55.739 },
          { word: "leur", start: 55.779, end: 55.919 },
          { word: "voix", start: 55.979, end: 56.279 },
          { word: "et", start: 56.36, end: 56.439 },
          { word: "de", start: 56.479, end: 56.52 },
          { word: "leurs", start: 56.56, end: 56.7 },
          { word: "expressions.", start: 56.759, end: 57.979 },
          { word: "Je", start: 58.02, end: 58.059 },
          { word: "leur", start: 58.099, end: 58.2 },
          { word: "raconterai", start: 58.259, end: 58.639 },
          { word: "que", start: 58.68, end: 58.779 },
          { word: "parfois,", start: 58.84, end: 59.54 },
          { word: "le", start: 59.599, end: 59.68 },
          { word: "silence", start: 59.74, end: 59.979 },
          { word: "résonne", start: 60.02, end: 60.38 },
          { word: "fort", start: 60.459, end: 60.619 },
          { word: "comme", start: 60.68, end: 60.799 },
          { word: "un", start: 60.84, end: 60.919 },
          { word: "cri.", start: 60.979, end: 62 },
          { word: "Et", start: 62.06, end: 62.119 },
          { word: "je", start: 62.159, end: 62.22 },
          { word: "leur", start: 62.259, end: 62.399 },
          { word: "raconterai,", start: 62.439, end: 63.119 },
          { word: "je", start: 63.219, end: 63.319 },
          { word: "vous", start: 63.4, end: 63.5 },
          { word: "raconterai,", start: 63.58, end: 64.659 },
          { word: "le", start: 64.739, end: 64.779 },
          { word: "plaisir", start: 64.839, end: 65.099 },
          { word: "d'être", start: 65.138, end: 65.399 },
          { word: "réellement", start: 65.479, end: 65.76 },
          { word: "comprise,", start: 65.8, end: 66.62 },
          { word: "de", start: 66.659, end: 66.699 },
          { word: "ne", start: 66.739, end: 66.819 },
          { word: "pas", start: 66.86, end: 66.919 },
          { word: "se", start: 66.959, end: 66.999 },
          { word: "sentir", start: 67.04, end: 67.319 },
          { word: "anormale,", start: 67.379, end: 67.819 },
          { word: "mais", start: 67.839, end: 67.979 },
          { word: "simplement", start: 68.019, end: 68.44 },
          { word: "différente,", start: 68.5, end: 69.439 },
          { word: "d'avoir", start: 69.439, end: 69.679 },
          { word: "la", start: 69.699, end: 69.779 },
          { word: "tête", start: 69.88, end: 70.039 },
          { word: "et", start: 70.08, end: 70.139 },
          { word: "le", start: 70.159, end: 70.279 },
          { word: "cœur", start: 70.339, end: 70.8 },
          { word: "qui", start: 70.86, end: 70.919 },
          { word: "s'emballent", start: 70.959, end: 71.319 },
          { word: "tout", start: 71.339, end: 71.419 },
          { word: "le", start: 71.419, end: 71.499 },
          { word: "temps.", start: 71.54, end: 72.4 },
          { word: "La", start: 72.44, end: 72.499 },
          { word: "vie", start: 72.559, end: 72.659 },
          { word: "a", start: 72.68, end: 72.779 },
          { word: "plus", start: 72.8, end: 72.979 },
          { word: "de", start: 73.019, end: 73.099 },
          { word: "goût,", start: 73.2, end: 73.559 },
          { word: "même", start: 73.58, end: 73.739 },
          { word: "s'il", start: 73.799, end: 73.919 },
          { word: "est", start: 73.939, end: 74.039 },
          { word: "parfois", start: 74.059, end: 74.319 },
          { word: "amer.", start: 74.379, end: 77.86 },
        ],
      }
    ),
  ],
  nextSceneId: "gameEnd",
};

const dayTwoMoving: Scene = {
  id: "dayTwoMoving",
  day: 2,
  title: "Demenagement",
  milestone: "demenagement",
  dialogues: [
    pensees(
      "d2_13",
      "3 allers retours, quel menteur celui la, il est deja 18h"
    ),
  ],
  nextSceneId: "dayTwoSdf",
};

const dayTwoSdf: Scene = {
  id: "dayTwoSdf",
  day: 2,
  title: "Demenagement",
  dialogues: [
    d(
      "d2_14",
      "Femme sdf",
      "Bonjour, excusez-moi, est-ce que auriez un peu de monnaie pour qu'on puisse manger ma fille et moi ?"
    ),
    d(
      "d2_15",
      "Inconnu",
      "On a tout ce qu'il faut, vous inquietez pas ! Avec le froid en ce moment on vient distribuer des couvertures et des petits colis alimentaires. Avec un peu de soupe pour vous rechauffer, des pates de fruits..."
    ),
    pensees(
      "d2_16",
      "Il a une telle douceur dans sa facon de s'exprimer, dans ses gestes, son regard est rempli de bienveillance. Ca fait tellement plaisir de voir des gens qui se donnent pour les autres, j'en reprends foi en l'humanite."
    ),
    pensees("d2_17", "he mais il sent super bon, on dirait du Santal ou du Musc"),
    d("d2_18", "Inconnu", "Tenez, je vous pose tout ca la."),
    d("d2_19", "LUCIE", "Et voici de ma part."),
    d(
      "d2_20",
      "Femme sdf",
      "Merci, merci, merci enormement. Passez une bonne journee"
    ),
    d("d2_21", "Inconnu", "Excellente journee !"),
    d(
      "d2_22",
      "LUCIE",
      "C'est super ce que vous faites, je m'appelle Lucie, vous etes une asso ?"
    ),
    d(
      "d2_23",
      "Amine",
      "Je m'appelle Amine, ravi de te connaitre, et oui je travaille pour Envie de Sourire, on fait des maraudes 3x/semaine en periode hivernale."
    ),
    d(
      "d2_24",
      "LUCIE",
      "Je connaissais pas. Vous avez besoin de mains en ce moment ?"
    ),
    d(
      "d2_25",
      "Amine",
      "Hahaha oui on a toujours besoin de mains, on vous accueillerait avec plaisir, tenez, voila une carte, appelez ce numero et on s'organise ca la semaine prochaine avec l'equipe."
    ),
    d(
      "d2_26",
      "LUCIE",
      "Allez ca marche, on s'appelle, finissez bien la journee !"
    ),
    d("d2_27", "Amine", "Merci beaucoup, aurevoir !"),
  ],
  nextSceneId: "dayTwoSunset",
};

const dayTwoSunset: Scene = {
  id: "dayTwoSunset",
  day: 2,
  title: "Coucher de soleil",
  dialogues: [
    pensees(
      "d2_28",
      "Le coucher de soleil est si beau, les cumulus qui refletent la lumiere et les etourneaux qui chantent, je pourrais regarder ca pendant des heures."
    ),
  ],
  nextSceneId: "gameEnd",
};

const gameEnd: Scene = {
  id: "gameEnd",
  day: 2,
  title: "Fin",
  dialogues: [],
  choices: [
    {
      id: "evaluate_yes",
      text: "OUI",
      nextSceneId: "gameEnd", // Stay here, handeled by component
    },
    {
      id: "evaluate_no",
      text: "NON",
      nextSceneId: "gameEnd",
    },
  ],
};

// ============================================
// EXPORT
// ============================================

export const gameData: GameData = {
  initialSceneId: "dayOneWakeup",
  initialFlags: {
    outfitChoice: null,
    conflictOutcome: null,
    gameEventChoice: null,
    hadBreakdown: false,
    energy: 75,
  },
  milestones: [
    { id: "reveil", label: "Reveil", sceneId: "dayOneWakeup", day: 1 },
    { id: "trajet", label: "Trajet", sceneId: "dayOneMetro", day: 1 },
    { id: "bureau", label: "Bureau", sceneId: "dayOneOffice", day: 1 },
    { id: "soiree", label: "Soiree", sceneId: "dayOneParty", day: 1 },
    { id: "retour", label: "Retour", sceneId: "dayOneEndGood", day: 1 },
    { id: "montagne", label: "Montagne", sceneId: "dayTwoMountain", day: 2 },
    { id: "demenagement", label: "Demenagement", sceneId: "dayTwoMoving", day: 2 },
  ],
  scenes: {
    dayOneWakeup,
    dayOneBathroom,
    dayOneOutfitSexy,
    dayOneOutfitComfort,
    dayOneMetro,
    dayOneMetroSexy,
    dayOneMetroComfort,
    dayOneOffice,
    dayOneConflictSubmit,
    dayOneConflictAssert,
    dayOneParty,
    dayOnePartySexy,
    dayOnePartyComfort,
    dayOneGameEvent,
    dayOnePlay,
    dayOneRefuse,
    dayOneRefuseAssert,
    dayOneRefuseSubmit,
    dayOneEndCrash,
    dayOneEndGood,
    dayOneEndGoodAssert,
    dayOneEndGoodReflect,
    dayTwoWakeup,
    dayTwoWakeupCrash,
    dayTwoWakeupGood,
    dayTwoCall,
    dayTwoAccept,
    dayTwoRefuse,
    dayTwoMountain,
    dayTwoMoving,
    dayTwoSdf,
    dayTwoSunset,
    gameEnd,
  },
};
