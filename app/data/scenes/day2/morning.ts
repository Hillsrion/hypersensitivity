import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { d, pensees } from "../../helpers";

export const dayTwoWakeupCrash: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
  day: 2,
  title: "Reveil",
  entryAnnotation: "Lucie se réveille",
  dialogues: [
    pensees(
      "d2_1a",
      "J'ai trop mal dormi, je me sens lourde. je vais aller a la montagne aujourd'hui, ca me fera du bien.",
      {
        annotation:
          "Le reveil sonne, les oiseaux chantent, bruits de couette",
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_TWO_CALL,
};

export const dayTwoWakeupGood: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP_GOOD,
  day: 2,
  title: "Reveil",
  entryAnnotation: "Lucie se réveille",
  dialogues: [
    pensees(
      "d2_1b",
      "J'ai bien dormi. Je me sens d'attaque. Allez, montagne aujourd'hui !",
      {
        annotation:
          "Le reveil sonne, les oiseaux chantent, bruits de couette",
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_TWO_CALL,
};

export const dayTwoCall: Scene = {
  id: SCENE_IDS.DAY_TWO_CALL,
  day: 2,
  title: "Appel",
  audio: "experience/J02_S01_Appel.mp3",
  dialogues: [
    d("d2_2", "Mere", "Allo ma cherie? Ca va?", {
      annotation: "Sonnerie de telephone",
      timings: [
        { word: "Allo", start: 3.539, end: 3.84 },
        { word: "ma", start: 3.86, end: 3.96 },
        { word: "chérie?", start: 4.0, end: 4.419 },
        { word: "Ca", start: 4.639, end: 4.779 },
        { word: "va?", start: 4.819, end: 5.099 },
      ],
    }),
    d("d2_3", "LUCIE", "Oui, ca va bien et toi?", {
      timings: [
        { word: "Oui,", start: 5.46, end: 5.619 },
        { word: "ca", start: 5.639, end: 5.699 },
        { word: "va", start: 5.699, end: 5.8 },
        { word: "bien", start: 5.819, end: 5.959 },
        { word: "et", start: 5.979, end: 6.039 },
        { word: "toi?", start: 6.039, end: 6.279 },
      ],
    }),
    d(
      "d2_4",
      "Mere",
      "Ecoute, ton frere demenage aujourd'hui, il a besoin de bras, tu peux venir l'aider?",
      {
        timings: [
          { word: "Ecoute,", start: 6.639, end: 6.959 },
          { word: "ton", start: 6.979, end: 7.079 },
          { word: "frere", start: 7.079, end: 7.379 },
          { word: "demenage", start: 7.399, end: 7.899 },
          { word: "aujourd'hui,", start: 7.919, end: 8.359 },
          { word: "il", start: 8.399, end: 8.459 },
          { word: "a", start: 8.479, end: 8.539 },
          { word: "besoin", start: 8.539, end: 8.76 },
          { word: "de", start: 8.779, end: 8.84 },
          { word: "bras,", start: 8.879, end: 9.259 },
          { word: "tu", start: 9.38, end: 9.42 },
          { word: "peux", start: 9.44, end: 9.539 },
          { word: "venir", start: 9.579, end: 9.779 },
          { word: "l'aider?", start: 9.8, end: 10.159 },
        ],
      }
    ),
  ],
  choices: [
    {
      id: "day_two_accept",
      text: "ACCEPTER",
      nextSceneId: SCENE_IDS.DAY_TWO_ACCEPT,
      effects: {
        energy: -20,
      },
    },
    {
      id: "day_two_refuse",
      text: "REFUSER",
      nextSceneId: SCENE_IDS.DAY_TWO_REFUSE,
      effects: {
        energy: 10,
      },
    },
  ],
};

export const dayTwoAccept: Scene = {
  id: SCENE_IDS.DAY_TWO_ACCEPT,
  day: 2,
  title: "Appel",
  audio: "experience/J02_S01_Appel_Oui.mp3",
  dialogues: [
    d("d2_5a", "LUCIE", "Ok, je passe.", {
      timings: [
        { word: "Ok,", start: 0.359, end: 0.8 },
        { word: "je", start: 0.839, end: 1.059 },
        { word: "passe.", start: 1.099, end: 1.579 },
      ],
    }),
    d("d2_6a", "Mere", "Super, a toute !", {
      timings: [
        { word: "Super,", start: 2.159, end: 2.7 },
        { word: "a", start: 2.739, end: 2.899 },
        { word: "toute", start: 2.919, end: 3.239 },
        { word: "!", start: 3.279, end: 3.279 },
      ],
    }),
  ],
  nextSceneId: SCENE_IDS.DAY_TWO_MOVING,
};

export const dayTwoRefuse: Scene = {
  id: SCENE_IDS.DAY_TWO_REFUSE,
  day: 2,
  title: "Appel",
  audio: "experience/J02_S01_Appel_Non.mp3",
  dialogues: [
    d("d2_5b", "LUCIE", "Deso, j'ai prevu un truc.", {
      timings: [
        { word: "Deso,", start: 0.44, end: 0.899 },
        { word: "j'ai", start: 0.939, end: 1.059 },
        { word: "prevu", start: 1.079, end: 1.359 },
        { word: "un", start: 1.379, end: 1.459 },
        { word: "truc.", start: 1.479, end: 1.839 },
      ],
    }),
    d("d2_6b", "Mere", "Tant pis.", {
      timings: [
        { word: "Tant", start: 2.22, end: 2.539 },
        { word: "pis.", start: 2.539, end: 2.96 },
      ],
    }),
  ],
  nextSceneId: SCENE_IDS.DAY_TWO_MOUNTAIN,
};
