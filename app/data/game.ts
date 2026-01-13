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
  speaker: "LUCIE",
  speakerType: "pensees",
  text,
  ...options,
});

// ============================================
// SCENES JOUR 1
// ============================================

const day1_wakeup: Scene = {
  id: "day1_wakeup",
  day: 1,
  title: "Reveil",
  milestone: "reveil",
  dialogues: [
    pensees("d1_1", "Ah puree, un autre jour dans la France de M le Maudit", {
      annotation: "Le reveil sonne, les oiseaux chantent, bruits de couette qui bouge",
    }),
  ],
  nextSceneId: "day1_bathroom",
};

const day1_bathroom: Scene = {
  id: "day1_bathroom",
  day: 1,
  title: "Reveil",
  dialogues: [
    pensees(
      "d1_2",
      "Ok, alors soit la robe qui me serre avec cette foutue etiquette dedans, mais je suis maxi fraiche, merci ma go Clara pour les travaux. Soit je mets pantalon oversize avec une chemise mais j'suis maxi confort pour la journee de taff.",
      { annotation: "Lucie rentre dans la douche, ouvre un pot de creme..." }
    ),
  ],
  choices: [
    {
      id: "outfit_sexy",
      text: "TENUE SEXY / RAFFINEE",
      nextSceneId: "day1_outfit_sexy",
      effects: {
        energy: -5,
        flags: { outfitChoice: "sexy" },
      },
    },
    {
      id: "outfit_comfort",
      text: "TENUE CONFORT",
      nextSceneId: "day1_outfit_comfort",
      effects: {
        flags: { outfitChoice: "comfort" },
      },
    },
  ],
};

const day1_outfit_sexy: Scene = {
  id: "day1_outfit_sexy",
  day: 1,
  title: "Reveil",
  dialogues: [
    pensees(
      "d1_3a",
      "Vas y, one-life. Ca va le faire, je coupe les etiquettes et c'est carre."
    ),
  ],
  nextSceneId: "day1_metro",
};

const day1_outfit_comfort: Scene = {
  id: "day1_outfit_comfort",
  day: 1,
  title: "Reveil",
  dialogues: [
    pensees(
      "d1_3b",
      "Deja que j'ai c'te reu de 2h30 qui va m'faire mal a la tete, autant etre confort."
    ),
  ],
  nextSceneId: "day1_metro",
};

const day1_metro: Scene = {
  id: "day1_metro",
  day: 1,
  title: "Trajet",
  milestone: "trajet",
  dialogues: [
    d(
      "d1_4",
      "ANNONCE",
      "En raison d'un bagage abandonne, les metros A et B sont suspendus pour une duree indeterminee, nous vous prions de nous excuser pour la gene occasionnee.",
      { annotation: "A la gare." }
    ),
    pensees("d1_5", "Mais QUI m'a envoyee ? C'est troooop"),
  ],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: "day1_metro_sexy",
    elseSceneId: "day1_metro_comfort",
  },
};

const day1_metro_sexy: Scene = {
  id: "day1_metro_sexy",
  day: 1,
  title: "Trajet",
  dialogues: [
    pensees(
      "d1_6a",
      "Je vais aller prendre un velo, et j'vais me faire siffler 5x sur le chemin, top ca"
    ),
    d(
      "d1_7a",
      "INCONNUE",
      "Coucou, je voulais juste te dire que t'es trop belle, c'est quoi la ref de la robe ?"
    ),
    d(
      "d1_8a",
      "LUCIE",
      "Oh merci beaucoup, c'est une robe Maje, la patineuse a col montant !"
    ),
    d("d1_9a", "INCONNUE", "Merciiiii"),
  ],
  nextSceneId: "day1_office",
};

const day1_metro_comfort: Scene = {
  id: "day1_metro_comfort",
  day: 1,
  title: "Trajet",
  dialogues: [
    pensees(
      "d1_6b",
      "Bah velo hein. Ca aurait ete relou avec la robe"
    ),
  ],
  nextSceneId: "day1_office",
};

const day1_office: Scene = {
  id: "day1_office",
  day: 1,
  title: "Bureau",
  milestone: "bureau",
  dialogues: [
    d(
      "d1_10",
      "COLLEGUE",
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
      "KAREN",
      "Ah j'ai encore oublie, la mienne va commencer la, mais y'en a d'autres de libres !"
    ),
  ],
  choices: [
    {
      id: "conflict_submit",
      text: "SE SOUMETTRE",
      nextSceneId: "day1_conflict_submit",
      effects: {
        energy: -10,
        flags: { conflictOutcome: "submit" },
      },
    },
    {
      id: "conflict_assert",
      text: "S'AFFIRMER",
      nextSceneId: "day1_conflict_assert",
      effects: {
        flags: { conflictOutcome: "assert" },
      },
    },
  ],
};

const day1_conflict_submit: Scene = {
  id: "day1_conflict_submit",
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
      "TEAM",
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
  nextSceneId: "day1_party",
};

const day1_conflict_assert: Scene = {
  id: "day1_conflict_assert",
  day: 1,
  title: "Bureau",
  dialogues: [
    d(
      "d1_14b",
      "LUCIE",
      "Ecoute, y'en a pas d'autres a cette heure la et tu le sais tres bien. On a pas mis les resa des bulles en place pour rien, donc tu vas faire comme moi les deux dernieres fois et tu vas aller faire ta reu dans l'open-space."
    ),
    d("d1_15b", "KAREN", "Ca y est ca va, ca va, pas besoin de taper une crise."),
    pensees("d1_16b", "Puis quoi encore ?"),
    d(
      "d1_17b",
      "LUCIE",
      "Je pense que c'est juste pas realisable qu'on boucle ce sprint dans les temps, je comprends qu'on doive avancer sur la roadmap mais les equipes vont se cramer, autant assumer l'echec maintenant pour pouvoir assurer la suite plutot que de communiquer dans l'urgence parce qu'on se sera lances dans un plan deraisonnable.",
      { annotation: "La reunion commence, Lucie participe activement." }
    ),
  ],
  nextSceneId: "day1_party",
};

const day1_party: Scene = {
  id: "day1_party",
  day: 1,
  title: "Soiree",
  milestone: "soiree",
  dialogues: [
    d("d1_18", "LUCIE + INES", "Heyyyyy", { annotation: "Lucie toque a la porte." }),
  ],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: "day1_party_sexy",
    elseSceneId: "day1_party_comfort",
  },
};

const day1_party_sexy: Scene = {
  id: "day1_party_sexy",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_19a",
      "INES",
      "Ca fait plaisir de te voir ! En plus tu viens en resta, epouse moi"
    ),
    d(
      "d1_20a",
      "LUCIE",
      "Ca serait a moi de te dire ca, regarde toi, t'es toute mimi !"
    ),
  ],
  nextSceneId: "day1_game_event",
};

const day1_party_comfort: Scene = {
  id: "day1_party_comfort",
  day: 1,
  title: "Soiree",
  dialogues: [
    d("d1_19b", "INES", "Heyyyyy, ca fait plaisir de te voir !"),
    d("d1_20b", "LUCIE", "Moi aussi je suis grave contente, il va bien"),
    d(
      "d1_21b",
      "INES",
      "Comment il va le petit monstre ? Ca fait longtemps je l'ai pas vu lui non plus !"
    ),
  ],
  nextSceneId: "day1_game_event",
};

const day1_game_event: Scene = {
  id: "day1_game_event",
  day: 1,
  title: "Soiree",
  dialogues: [
    d("d1_22", "LUCAS", "Lucie, tu veux jouer avec nous a Presque Consensus ?"),
    pensees(
      "d1_23",
      "Mon Dieu, la derniere fois j'ai rien compris, je me suis trompee 4 fois devant tout le monde et je sentais bien qu'ils etaient soules, je me suis sentie trop conne..."
    ),
  ],
  choices: [
    {
      id: "game_play",
      text: "ESSAYER DE JOUER",
      nextSceneId: "day1_play",
      effects: {
        energy: -100,
        flags: { gameEventChoice: "play", hadBreakdown: true },
      },
    },
    {
      id: "game_refuse",
      text: "REFUSER / DISCUTER",
      nextSceneId: "day1_refuse",
      effects: {
        flags: { gameEventChoice: "refuse" },
      },
    },
  ],
};

const day1_play: Scene = {
  id: "day1_play",
  day: 1,
  title: "Soiree",
  dialogues: [
    d("d1_24", "LUCIE", "Vas yyyyy"),
    d(
      "d1_25",
      "LUCAS",
      "En gros, on discute tous ensemble, et faut arriver a ce que la majorite du groupe soit d'accord sur une reponse donnee a une question parmi une liste. On gagne en trouvant les influenceurs qui doivent defendre une des options sur la carte."
    ),
    d("d1_26", "LUCIE", "Okay !"),
    d(
      "d1_27",
      "LUCAS",
      "Au debut, tu pioches une carte role. Tu la regardes en discret. Ensuite, on revele la question du tour. Les cartes opinion que t'as en main, c'est les sous-sujets qui te font gagner des points si tu les abordes..."
    ),
    pensees("d1_28", "Putain, je capte rien"),
    d(
      "d1_29",
      "LUCAS",
      "Y'a des jetons influence qu'on peut utiliser pour te forcer a aborder certains arguments et faire penser que t'es un influenceur..."
    ),
    d(
      "d1_30",
      "LUCIE",
      "Je me sens pas bien, j'reviens !",
      { annotation: "On met une image de bruit sourd qui devient de plus en plus fort" }
    ),
  ],
  nextSceneId: "day1_crash",
};

const day1_crash: Scene = {
  id: "day1_crash",
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
      "INES",
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
      "INES",
      "D'accord, je comprends, assieds toi dans ma chambre, je t'appeler un Uber"
    ),
    d("d1_35", "LUCIE", "Merci ma douce."),
  ],
  nextSceneId: "day1_end_crash",
};

const day1_refuse: Scene = {
  id: "day1_refuse",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_36",
      "LUCIE",
      "Je vais plutot en profiter pour discuter avec Ines, ca fait longtemps"
    ),
    d("d1_37", "LUCAS", "T'inquietes pas de soucis ! Bon du coup Presque Consensus..."),
    d(
      "d1_38",
      "LUCIE",
      "Nan mais faut que je te raconte un truc qui s'est passe tout a l'heure avec la vieille meuf aigrie de mon taff"
    ),
    d("d1_39", "INES", "Let's gooooooo"),
    d(
      "d1_40",
      "LUCIE",
      "J'avais une reu ce matin, et vu que c'est toujours le bordel dans l'open-space j'ai reserve une des petites cabanes a isolation phonique, c'est pas je la vois dans la cabane et elle veut pas bouger ?"
    ),
    d("d1_41", "INES", "he pitie, dis moi que tu l'as bougee de la"),
  ],
  autoChoice: {
    condition: { flag: "conflictOutcome", operator: "equals", value: "assert" },
    thenSceneId: "day1_refuse_assert",
    elseSceneId: "day1_refuse_submit",
  },
};

const day1_refuse_assert: Scene = {
  id: "day1_refuse_assert",
  day: 1,
  title: "Soiree",
  dialogues: [
    d(
      "d1_42a",
      "LUCIE",
      "Mais bien sur que je l'ai bougee de la, mais c'est pas dans l'aprem je recois un mail du responsable pour un truc rien a voir ? Elle est allee me balancer parceque la semaine derniere je suis partie plus tot mardi pour regler des trucs perso c'te sorciere"
    ),
  ],
  nextSceneId: "day1_end_good",
};

const day1_refuse_submit: Scene = {
  id: "day1_refuse_submit",
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
      "INES",
      "On peut pas gagner toutes les batailles, vas y step by step, si tu veux ce week-end on t'aidera a trouver les mots pour mettre tes limites"
    ),
    d(
      "d1_44b",
      "LUCIE",
      "Ah genre tu vas la RP ? Hahaha trop bien, on fera ca, merci d'etre la"
    ),
    d("d1_45b", "INES", "Toujours"),
  ],
  nextSceneId: "day1_end_good",
};

const day1_end_crash: Scene = {
  id: "day1_end_crash",
  day: 1,
  title: "Retour",
  milestone: "retour",
  dialogues: [
    d(
      "d1_46",
      "MESSAGE",
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
  nextSceneId: "day2_wakeup",
};

const day1_end_good: Scene = {
  id: "day1_end_good",
  day: 1,
  title: "Retour",
  milestone: "retour",
  dialogues: [
    d(
      "d1_48",
      "MESSAGE",
      "Je suis bien arrivee, merci pour la soiree",
      { annotation: "Bruits de cles, porte qui s'ouvre, lumiere qui s'allume." }
    ),
  ],
  autoChoice: {
    condition: { flag: "conflictOutcome", operator: "equals", value: "assert" },
    thenSceneId: "day1_end_good_assert",
    elseSceneId: "day1_end_good_reflect",
  },
};

const day1_end_good_assert: Scene = {
  id: "day1_end_good_assert",
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
  nextSceneId: "day2_wakeup",
};

const day1_end_good_reflect: Scene = {
  id: "day1_end_good_reflect",
  day: 1,
  title: "Retour",
  dialogues: [
    pensees(
      "d1_49b",
      "Je suis trop heureuse d'avoir des amis comme ca, toujours la pour ecouter mes galeres. Ca peut etre 100x la meme chose, ca peut etre long comme un lundi avec mes vocaux d'une minute 30, ca peut sembler insignifiant pour la plupart des gens, et pourtant, elles sont toujours la pour m'ecouter avec la meme attention, pour me consoler, pour me donner les meilleurs conseils. Je suis tellement reconnaissante."
    ),
  ],
  nextSceneId: "day2_wakeup",
};

// ============================================
// SCENES JOUR 2
// ============================================

const day2_wakeup: Scene = {
  id: "day2_wakeup",
  day: 2,
  title: "Reveil",
  dialogues: [],
  autoChoice: {
    condition: { flag: "hadBreakdown", operator: "equals", value: true },
    thenSceneId: "day2_wakeup_crash",
    elseSceneId: "day2_wakeup_good",
  },
};

const day2_wakeup_crash: Scene = {
  id: "day2_wakeup_crash",
  day: 2,
  title: "Reveil",
  dialogues: [
    pensees(
      "d2_1a",
      "J'ai trop mal dormi, je me sens lourde. je vais aller a la montagne aujourd'hui, ca me fera du bien.",
      { annotation: "Le reveil sonne, les oiseaux chantent, bruits de couette" }
    ),
  ],
  nextSceneId: "day2_call",
};

const day2_wakeup_good: Scene = {
  id: "day2_wakeup_good",
  day: 2,
  title: "Reveil",
  dialogues: [
    pensees(
      "d2_1b",
      "C'est aujourd'hui que j'avais prevu d'aller a la montagne, j'avais pas vu la semaine passer, j'ai encore jamais fait la croix de Chamrousse.",
      { annotation: "Le reveil sonne, les oiseaux chantent, bruits de couette" }
    ),
  ],
  nextSceneId: "day2_call",
};

const day2_call: Scene = {
  id: "day2_call",
  day: 2,
  title: "Appel",
  dialogues: [
    d(
      "d2_2",
      "AMI",
      "Coucou, je suis desole de deranger si tot, je t'appelle parcequ'on a un souci, tu te souviens je t'avais dit que je demenageais aujourd'hui et j'ai plus personne pour conduire le camion de loc, y'a So qui a une grippe carabinee il est couche la, est-ce que tu pourrais venir tout a l'heure, y'a 3 allers-retours a faire je pense.",
      { annotation: "Le telephone sonne...", color: "#87CEEB" }
    ),
  ],
  choices: [
    {
      id: "accept_move",
      text: "ACCEPTER",
      nextSceneId: "day2_accept",
      condition: { flag: "energy", operator: "greaterThan", value: 0 },
      disabledReason: "(Energie insuffisante)",
    },
    {
      id: "refuse_move",
      text: "REFUSER",
      nextSceneId: "day2_refuse",
    },
  ],
};

const day2_accept: Scene = {
  id: "day2_accept",
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
      "AMI",
      "Ah pitie pitie pitie, j'ai personne d'autre qui a le permis qui est dispo aujourd'hui, j'ai fait le tour t'es mon dernier espoir, sinon j'ai loue le camion et fait venir les gens pour rien, j'te jure que je te revaudrai ca."
    ),
    d(
      "d2_5a",
      "LUCIE",
      "Okay okay, ca y est, je te rejoins chez toi tout a l'heure."
    ),
    d(
      "d2_6a",
      "AMI",
      "Merci vraiment, t'sais quoi je te paye resto la prochaine fois"
    ),
    d("d2_7a", "LUCIE", "Y'a interet d'avoir du homard hein !"),
  ],
  nextSceneId: "day2_moving",
};

const day2_refuse: Scene = {
  id: "day2_refuse",
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
      "AMI",
      "Ca marche, prends soin de toi et on se voit bientot pour la cremaillere alors, gros bisous"
    ),
    d(
      "d2_5b",
      "LUCIE",
      "Avec plaisir, desolee encore, gros bisous et bon courage !"
    ),
  ],
  nextSceneId: "day2_mountain",
};

const day2_mountain: Scene = {
  id: "day2_mountain",
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
  nextSceneId: "game_end",
};

const day2_moving: Scene = {
  id: "day2_moving",
  day: 2,
  title: "Demenagement",
  milestone: "demenagement",
  dialogues: [
    pensees(
      "d2_13",
      "3 allers retours, quel menteur celui la, il est deja 18h"
    ),
  ],
  nextSceneId: "day2_sdf",
};

const day2_sdf: Scene = {
  id: "day2_sdf",
  day: 2,
  title: "Demenagement",
  dialogues: [
    d(
      "d2_14",
      "FEMME SDF",
      "Bonjour, excusez-moi, est-ce que auriez un peu de monnaie pour qu'on puisse manger ma fille et moi ?"
    ),
    d(
      "d2_15",
      "INCONNU",
      "On a tout ce qu'il faut, vous inquietez pas ! Avec le froid en ce moment on vient distribuer des couvertures et des petits colis alimentaires. Avec un peu de soupe pour vous rechauffer, des pates de fruits..."
    ),
    pensees(
      "d2_16",
      "Il a une telle douceur dans sa facon de s'exprimer, dans ses gestes, son regard est rempli de bienveillance. Ca fait tellement plaisir de voir des gens qui se donnent pour les autres, j'en reprends foi en l'humanite."
    ),
    pensees("d2_17", "he mais il sent super bon, on dirait du Santal ou du Musc"),
    d("d2_18", "INCONNU", "Tenez, je vous pose tout ca la."),
    d("d2_19", "LUCIE", "Et voici de ma part."),
    d(
      "d2_20",
      "FEMME SDF",
      "Merci, merci, merci enormement. Passez une bonne journee"
    ),
    d("d2_21", "INCONNU", "Excellente journee !"),
    d(
      "d2_22",
      "LUCIE",
      "C'est super ce que vous faites, je m'appelle Lucie, vous etes une asso ?"
    ),
    d(
      "d2_23",
      "AMINE",
      "Je m'appelle Amine, ravi de te connaitre, et oui je travaille pour Envie de Sourire, on fait des maraudes 3x/semaine en periode hivernale."
    ),
    d(
      "d2_24",
      "LUCIE",
      "Je connaissais pas. Vous avez besoin de mains en ce moment ?"
    ),
    d(
      "d2_25",
      "AMINE",
      "Hahaha oui on a toujours besoin de mains, on vous accueillerait avec plaisir, tenez, voila une carte, appelez ce numero et on s'organise ca la semaine prochaine avec l'equipe."
    ),
    d(
      "d2_26",
      "LUCIE",
      "Allez ca marche, on s'appelle, finissez bien la journee !"
    ),
    d("d2_27", "AMINE", "Merci beaucoup, aurevoir !"),
  ],
  nextSceneId: "day2_sunset",
};

const day2_sunset: Scene = {
  id: "day2_sunset",
  day: 2,
  title: "Coucher de soleil",
  dialogues: [
    pensees(
      "d2_28",
      "Le coucher de soleil est si beau, les cumulus qui refletent la lumiere et les etourneaux qui chantent, je pourrais regarder ca pendant des heures."
    ),
  ],
  nextSceneId: "game_end",
};

const game_end: Scene = {
  id: "game_end",
  day: 2,
  title: "Fin",
  dialogues: [],
};

// ============================================
// EXPORT
// ============================================

export const gameData: GameData = {
  initialSceneId: "day1_wakeup",
  initialFlags: {
    outfitChoice: null,
    conflictOutcome: null,
    gameEventChoice: null,
    hadBreakdown: false,
    energy: 75,
  },
  milestones: [
    { id: "reveil", label: "Reveil", sceneId: "day1_wakeup", day: 1 },
    { id: "trajet", label: "Trajet", sceneId: "day1_metro", day: 1 },
    { id: "bureau", label: "Bureau", sceneId: "day1_office", day: 1 },
    { id: "soiree", label: "Soiree", sceneId: "day1_party", day: 1 },
    { id: "retour", label: "Retour", sceneId: "day1_end_good", day: 1 },
    { id: "montagne", label: "Montagne", sceneId: "day2_mountain", day: 2 },
    { id: "demenagement", label: "Demenagement", sceneId: "day2_moving", day: 2 },
  ],
  scenes: {
    day1_wakeup,
    day1_bathroom,
    day1_outfit_sexy,
    day1_outfit_comfort,
    day1_metro,
    day1_metro_sexy,
    day1_metro_comfort,
    day1_office,
    day1_conflict_submit,
    day1_conflict_assert,
    day1_party,
    day1_party_sexy,
    day1_party_comfort,
    day1_game_event,
    day1_play,
    day1_crash,
    day1_refuse,
    day1_refuse_assert,
    day1_refuse_submit,
    day1_end_crash,
    day1_end_good,
    day1_end_good_assert,
    day1_end_good_reflect,
    day2_wakeup,
    day2_wakeup_crash,
    day2_wakeup_good,
    day2_call,
    day2_accept,
    day2_refuse,
    day2_mountain,
    day2_moving,
    day2_sdf,
    day2_sunset,
    game_end,
  },
};
