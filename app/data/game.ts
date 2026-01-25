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
  dialogues: [
    pensees("d1_1", "Oh purée, un autre jour dans la France de Macron..", {
      annotation: "Le réveil sonne, les oiseaux chantent, bruits de couette qui bouge, bruits de pas",
      audio: "experience/J01_S01_Reveil.mp3",
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
  dialogues: [
    pensees(
      "d1_2",
      "OK, alors soit la robe qui me serre avec cette foutue étiquette dedans, mais je suis maxi fraîche, soit je mets pantalon oversize avec une chemise, mais je suis maxi confort pour la journée de taf",
      {
        audio: "experience/J01_C01_Tenue_base.mp3",
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
  dialogues: [
    pensees(
      "d1_3a",
      "Vas-y, one life, ça va le faire ! Je coupe les étiquettes et c'est carré.",
      {
        audio: "experience/J01_C01_TenueA.mp3",
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
  dialogues: [
    pensees(
      "d1_3b",
      "déjà que j'ai c'te réu de deux heures trente qui va me faire mal à la tête, autant être confort.",
      {
        audio: "experience/J01_C01_TenueB.mp3",
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
  dialogues: [
    pensees(
      "d1_6a",
      "Je vais aller prendre un vélo et je vais me faire siffler cinq fois sur le chemin. Super !",
      {
        audio: "experience/J01_S03_Trajet_A.mp3",
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
        audio: "experience/J01_S03_Trajet_A.mp3",
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
        audio: "experience/J01_S03_Trajet_A.mp3",
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
      audio: "experience/J01_S03_Trajet_A.mp3",
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
  dialogues: [
    d("d1_24", "LUCIE", "Vas yyyyy"),
    d(
      "d1_25",
      "Lucas",
      "En gros, on discute tous ensemble, et faut arriver a ce que la majorite du groupe soit d'accord sur une reponse donnee a une question parmi une liste. On gagne en trouvant les influenceurs qui doivent defendre une des options sur la carte."
    ),
    d("d1_26", "LUCIE", "Okay !"),
    d(
      "d1_27",
      "Lucas",
      "Au debut, tu pioches une carte role. Tu la regardes en discret. Ensuite, on revele la question du tour. Les cartes opinion que t'as en main, c'est les sous-sujets qui te font gagner des points si tu les abordes..."
    ),
    pensees("d1_28", "Putain, je capte rien"),
    d(
      "d1_29",
      "Lucas",
      "Y'a des jetons influence qu'on peut utiliser pour te forcer a aborder certains arguments et faire penser que t'es un influenceur..."
    ),
    d(
      "d1_30",
      "LUCIE",
      "Je me sens pas bien, j'reviens !",
      { annotation: "On met une image de bruit sourd qui devient de plus en plus fort" }
    ),
  ],
  nextSceneId: "dayOneCrash",
};

const dayOneCrash: Scene = {
  id: "dayOneCrash",
  day: 1,
  title: "Soiree",
  dialogues: [
    pensees(
      "d1_31",
      "C'est rien, c'est rien, c'est rien",
      { annotation: "Bruit de deplacement, porte des toilettes qui s'ouvre et se ferme. Lucie prend des inspirations, renifle..." }
    ),
    d(
      "d1_32",
      "Ines",
      "hey, t'es partie d'un coup et t'es toute pale, ca va ?",
      { annotation: "Porte qui s'ouvre. Elle se cogne contre Ines." }
    ),
    d(
      "d1_33",
      "LUCIE",
      "Non, vraiment, j'ai eu une sale journee et je suis au bout la, je peux plus, il faut que je rentre."
    ),
    d(
      "d1_34",
      "Ines",
      "D'accord, je comprends, assieds toi dans ma chambre, je t'appeler un Uber"
    ),
    d("d1_35", "LUCIE", "Merci ma douce."),
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
  dialogues: [
    d(
      "d2_6",
      "LUCIE",
      "C'est une mesange boreale ca ! Elles sont magnifiques.",
      { annotation: "Bruits d'oiseaux" }
    ),
    d(
      "d2_7",
      "LUCIE",
      "J'ai pas l'habitude de venir en Belledonne. Et on ose me dire qu'il en faut beaucoup pour m'impressionner alors qu'il suffit litteralement d'un tas de cailloux, des arbres et des beaux nuages"
    ),
    d("d2_8", "LUCIE", "Ca fait tellement de bien, je retrouve mon oxygene."),
    pensees(
      "d2_9",
      "Trop longtemps que je decale, que je prends pas de temps pour moi mais je suis importante aussi. Je vous aime, mais j'ai aussi besoin de temps pour me retrouver."
    ),
    pensees(
      "d2_10",
      "Je vous ecoute, je vous donne, je ressens vos emotions plus que vous ne pourriez l'imaginer, et c'est ma benediction en realite. Ca m'a donne des amis, des liens, des relations, des aventures veritables que je suis reconnaissante d'avoir."
    ),
    pensees(
      "d2_11",
      "Viendra un jour ou j'aurai le courage, ou je leur raconterai que je vois la vie en 1000 couleurs, en 1000 sons, la forme et la profondeur de leurs voix et de leurs expressions. Je leur raconterai que parfois le silence raisonne fort comme un cri."
    ),
    pensees(
      "d2_12",
      "Et je leur raconterai, je VOUS raconterai, le plaisir d'etre reellement compris, de pas se sentir anormale mais simplement different, d'avoir la tete et le coeur qui s'emballent tout le temps. La vie a plus de gout, meme il est parfois amer."
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
    dayOneCrash,
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
