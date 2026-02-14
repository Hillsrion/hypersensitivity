import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { d, pensees } from "../../helpers";

export const dayTwoMountain: Scene = {
  id: SCENE_IDS.DAY_TWO_MOUNTAIN,
  day: 2,
  title: "Montagne",
  entryAnnotation: "Arrivée à la montagne",
  condition: { flag: "callChoice", operator: "equals", value: "refuse" },
  audio: "experience/J02_S02_Montagne_Intro.mp3",
  dialogues: [
    d(
      "d2_7",
      "LUCIE",
      "J'adore le bruit de la nature, je vais faire de la musique avec.",
      {
        annotation: "Bruit de vent, d'oiseaux, de pas dans l'herbe",
        timings: [
          { word: "J'adore", start: 14.199, end: 14.599 },
          { word: "le", start: 14.639, end: 14.739 },
          { word: "bruit", start: 14.779, end: 15 },
          { word: "de", start: 15.019, end: 15.079 },
          { word: "la", start: 15.099, end: 15.199 },
          { word: "nature,", start: 15.239, end: 15.8 },
          { word: "je", start: 16.039, end: 16.14 },
          { word: "vais", start: 16.179, end: 16.279 },
          { word: "faire", start: 16.299, end: 16.519 },
          { word: "de", start: 16.539, end: 16.639 },
          { word: "la", start: 16.639, end: 16.799 },
          { word: "musique", start: 16.799, end: 17.279 },
          { word: "avec.", start: 17.319, end: 17.899 },
        ],
      }
    ),
    d(
      "d2_8",
      "LUCIE",
      "Merde, y'a un groupe de vieux qui arrive, ils font trop de bruit.",
      {
        annotation: "Bruit de groupe de randonneurs qui approche",
        timings: [
          { word: "Merde,", start: 20.899, end: 21.259 },
          { word: "y'a", start: 21.319, end: 21.459 },
          { word: "un", start: 21.479, end: 21.539 },
          { word: "groupe", start: 21.579, end: 21.879 },
          { word: "de", start: 21.899, end: 21.959 },
          { word: "vieux", start: 21.979, end: 22.259 },
          { word: "qui", start: 22.299, end: 22.399 },
          { word: "arrive,", start: 22.42, end: 22.86 },
          { word: "ils", start: 22.92, end: 23.019 },
          { word: "font", start: 23.059, end: 23.239 },
          { word: "trop", start: 23.279, end: 23.479 },
          { word: "de", start: 23.479, end: 23.539 },
          { word: "bruit.", start: 23.579, end: 24.119 },
        ],
      }
    ),
    d(
      "d2_9",
      "Randonneur",
      "Bonjour ! Il fait beau hein ?",
      {
        timings: [
          { word: "Bonjour", start: 29.5, end: 29.879 },
          { word: "!", start: 29.899, end: 30.279 },
          { word: "Il", start: 30.659, end: 30.739 },
          { word: "fait", start: 30.779, end: 30.92 },
          { word: "beau", start: 30.939, end: 31.139 },
          { word: "hein", start: 31.159, end: 31.399 },
          { word: "?", start: 31.439, end: 31.579 },
        ],
      }
    ),
    pensees(
      "d2_10",
      "Vos gueules.",
      {
        timings: [
          { word: "Vos", start: 32.799, end: 33.159 },
          { word: "gueules.", start: 33.22, end: 33.68 },
        ],
      }
    ),
  ],
};
