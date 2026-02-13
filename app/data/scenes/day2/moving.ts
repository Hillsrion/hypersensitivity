import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { d, pensees } from "../../helpers";

export const dayTwoMoving: Scene = {
  id: SCENE_IDS.DAY_TWO_MOVING,
  day: 2,
  title: "Demenagement",
  entryAnnotation: "Au déménagement",
  audio: "experience/J02_S02_Demenagement.mp3",
  dialogues: [
    d("d2_11", "Mere", "Allez, on se motive ! Il reste plus que le canapé !", {
      annotation: "Bruits de demenagement, cartons, pas",
      timings: [
        { word: "Allez,", start: 8.76, end: 9.14 },
        { word: "on", start: 9.18, end: 9.259 },
        { word: "se", start: 9.279, end: 9.399 },
        { word: "motive", start: 9.439, end: 9.92 },
        { word: "!", start: 9.94, end: 10.3 },
        { word: "Il", start: 10.319, end: 10.42 },
        { word: "reste", start: 10.46, end: 10.739 },
        { word: "plus", start: 10.759, end: 10.899 },
        { word: "que", start: 10.899, end: 10.98 },
        { word: "le", start: 11.019, end: 11.14 },
        { word: "canapé", start: 11.179, end: 11.699 },
        { word: "!", start: 11.72, end: 12.06 },
      ],
    }),
    d(
      "d2_12",
      "Frere",
      "Lucie, tu peux m'aider a porter le frigo apres ?",
      {
        timings: [
          { word: "Lucie,", start: 13.92, end: 14.34 },
          { word: "tu", start: 14.359, end: 14.42 },
          { word: "peux", start: 14.439, end: 14.539 },
          { word: "m'aider", start: 14.559, end: 14.899 },
          { word: "a", start: 14.92, end: 14.979 },
          { word: "porter", start: 15.019, end: 15.34 },
          { word: "le", start: 15.379, end: 15.46 },
          { word: "frigo", start: 15.479, end: 15.86 },
          { word: "apres", start: 15.899, end: 16.34 },
          { word: "?", start: 16.379, end: 16.699 },
        ],
      }
    ),
    d("d2_13", "LUCIE", "Attends, je fais une pause la, j'en peux plus.", {
      timings: [
        { word: "Attends,", start: 17.519, end: 17.899 },
        { word: "je", start: 17.919, end: 17.98 },
        { word: "fais", start: 18.019, end: 18.159 },
        { word: "une", start: 18.159, end: 18.239 },
        { word: "pause", start: 18.279, end: 18.68 },
        { word: "la,", start: 18.7, end: 18.899 },
        { word: "j'en", start: 19.34, end: 19.52 },
        { word: "peux", start: 19.539, end: 19.66 },
        { word: "plus.", start: 19.699, end: 20.259 },
      ],
    }),
    pensees(
      "d2_14",
      "J'ai mal partout, il y a trop de bruit, trop de monde. Je vais exploser.",
      {
        timings: [
          { word: "J'ai", start: 22.019, end: 22.18 },
          { word: "mal", start: 22.2, end: 22.46 },
          { word: "partout,", start: 22.479, end: 23.019 },
          { word: "il", start: 23.079, end: 23.199 },
          { word: "y", start: 23.22, end: 23.239 },
          { word: "a", start: 23.259, end: 23.299 },
          { word: "trop", start: 23.359, end: 23.539 },
          { word: "de", start: 23.539, end: 23.639 },
          { word: "bruit,", start: 23.659, end: 24.119 },
          { word: "trop", start: 24.18, end: 24.36 },
          { word: "de", start: 24.379, end: 24.46 },
          { word: "monde.", start: 24.479, end: 25.18 },
          { word: "Je", start: 25.439, end: 25.5 },
          { word: "vais", start: 25.539, end: 25.68 },
          { word: "exploser.", start: 25.7, end: 26.699 },
        ],
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_TWO_SUNSET,
};

export const dayTwoSunset: Scene = {
  id: SCENE_IDS.DAY_TWO_SUNSET,
  day: 2,
  title: "Coucher de soleil",
  audio: "experience/J02_S03_Coucher_Soleil.mp3",
  dialogues: [
    d("d2_15", "LUCIE", "C'est beau...", {
      annotation: "Musique douce et vent, Lucie regarde le coucher de soleil",
      timings: [
        { word: "C'est", start: 5.619, end: 5.86 },
        { word: "beau...", start: 5.899, end: 6.919 },
      ],
    }),
    pensees(
      "d2_16",
      "Finalement, c'est pas si mal d'être sensible. Je ressens tout plus fort, le moche comme le beau. C'est à moi de choisir ce que je garde.",
      {
        timings: [
          { word: "Finalement,", start: 9.34, end: 9.879 },
          { word: "c'est", start: 10.039, end: 10.159 },
          { word: "pas", start: 10.199, end: 10.319 },
          { word: "si", start: 10.34, end: 10.5 },
          { word: "mal", start: 10.539, end: 10.879 },
          { word: "d'être", start: 10.92, end: 11.239 },
          { word: "sensible.", start: 11.279, end: 12.26 },
          { word: "Je", start: 12.319, end: 12.38 },
          { word: "ressens", start: 12.42, end: 12.779 },
          { word: "tout", start: 12.8, end: 12.98 },
          { word: "plus", start: 13.019, end: 13.159 },
          { word: "fort,", start: 13.2, end: 13.84 },
          { word: "le", start: 13.9, end: 14.039 },
          { word: "moche", start: 14.1, end: 14.539 },
          { word: "comme", start: 14.599, end: 14.779 },
          { word: "le", start: 14.8, end: 14.92 },
          { word: "beau.", start: 14.979, end: 15.759 },
          { word: "C'est", start: 16.279, end: 16.379 },
          { word: "à", start: 16.42, end: 16.459 },
          { word: "moi", start: 16.5, end: 16.659 },
          { word: "de", start: 16.699, end: 16.799 },
          { word: "choisir", start: 16.819, end: 17.299 },
          { word: "ce", start: 17.439, end: 17.519 },
          { word: "que", start: 17.559, end: 17.659 },
          { word: "je", start: 17.7, end: 17.759 },
          { word: "garde.", start: 17.799, end: 18.239 },
        ],
      }
    ),
  ],
  nextSceneId: SCENE_IDS.GAME_END,
};
