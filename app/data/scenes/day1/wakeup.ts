import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { pensees } from "../../helpers";

export const dayOneWakeup: Scene = {
  id: SCENE_IDS.DAY_ONE_WAKEUP,
  day: 1,
  title: "Réveil",
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
  nextSceneId: SCENE_IDS.DAY_ONE_BATHROOM,
};

export const dayOneBathroom: Scene = {
  id: SCENE_IDS.DAY_ONE_BATHROOM,
  day: 1,
  title: "Réveil",
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
      nextSceneId: SCENE_IDS.DAY_ONE_OUTFIT_SEXY,
      effects: {
        energy: -5,
        flags: { outfitChoice: "sexy" },
      },
    },
    {
      id: "outfit_comfort",
      text: "TENUE CONFORT",
      nextSceneId: SCENE_IDS.DAY_ONE_OUTFIT_COMFORT,
      effects: {
        flags: { outfitChoice: "comfort" },
      },
    },
  ],
};

export const dayOneOutfitSexy: Scene = {
  id: SCENE_IDS.DAY_ONE_OUTFIT_SEXY,
  day: 1,
  title: "Réveil",
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
  nextSceneId: SCENE_IDS.DAY_ONE_METRO_SEXY,
};

export const dayOneOutfitComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_OUTFIT_COMFORT,
  day: 1,
  title: "Réveil",
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
  nextSceneId: SCENE_IDS.DAY_ONE_METRO_COMFORT,
};
