import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { d } from "../../helpers";

export const dayOnePartySexy: Scene = {
  id: SCENE_IDS.DAY_ONE_PARTY_SEXY,
  day: 1,
  title: "Soiree",
  milestone: "soiree",
  entryAnnotation: "Lucie arrive à la soirée",
  audio: "experience/J01_S05_Soiree_Tenue_Sexy.mp3",
  dialogues: [
    d(
      "d1_20a",
      "Ines",
      "Hey! Ça fait plaisir de te voir. En plus, tu viens en re-sta. Epouse-moi.",
      {
        timings: [
          { word: "Hey!", start: 7.46, end: 8.819 },
          { word: "Ça", start: 8.88, end: 8.96 },
          { word: "fait", start: 9.019, end: 9.18 },
          { word: "plaisir", start: 9.22, end: 9.64 },
          { word: "de", start: 9.659, end: 9.739 },
          { word: "te", start: 9.779, end: 9.84 },
          { word: "voir.", start: 9.859, end: 10.099 },
          { word: "En", start: 10.159, end: 10.259 },
          { word: "plus,", start: 10.279, end: 10.5 },
          { word: "tu", start: 10.519, end: 10.619 },
          { word: "viens", start: 10.659, end: 10.8 },
          { word: "en", start: 10.819, end: 10.88 },
          { word: "re-sta.", start: 11.039, end: 12.38 },
          { word: "Epouse-moi.", start: 12.399, end: 13.1 },
        ],
      }
    ),
    d(
      "d1_21a",
      "LUCIE",
      "Mais c'est à moi de te dire ça. Regarde-toi, t'es toute mimi.",
      {
        timings: [
          { word: "Mais", start: 14.039, end: 14.159 },
          { word: "c'est", start: 14.179, end: 14.26 },
          { word: "à", start: 14.34, end: 14.36 },
          { word: "moi", start: 14.4, end: 14.579 },
          { word: "de", start: 14.599, end: 14.659 },
          { word: "te", start: 14.699, end: 14.779 },
          { word: "dire", start: 14.799, end: 15.02 },
          { word: "ça.", start: 15.06, end: 15.3 },
          { word: "Regarde-toi,", start: 15.319, end: 15.8 },
          { word: "t'es", start: 15.819, end: 15.98 },
          { word: "toute", start: 15.98, end: 16.158 },
          { word: "mimi.", start: 16.18, end: 17.319 },
        ],
      }
    ),
    d(
      "d1_22a",
      "Ines",
      "Bah tiens, pose ta veste et va prendre un verre. Je te rejoins dans le salon.",
      {
        timings: [
          { word: "Bah", start: 17.34, end: 17.44 },
          { word: "tiens,", start: 17.52, end: 17.76 },
          { word: "pose", start: 17.799, end: 17.979 },
          { word: "ta", start: 18, end: 18.079 },
          { word: "veste", start: 18.139, end: 18.34 },
          { word: "et", start: 18.34, end: 18.399 },
          { word: "va", start: 18.42, end: 18.52 },
          { word: "prendre", start: 18.54, end: 18.719 },
          { word: "un", start: 18.739, end: 18.78 },
          { word: "verre.", start: 18.84, end: 18.979 },
          { word: "Je", start: 19, end: 19.02 },
          { word: "te", start: 19.059, end: 19.139 },
          { word: "rejoins", start: 19.139, end: 19.299 },
          { word: "dans", start: 19.319, end: 19.379 },
          { word: "le", start: 19.399, end: 19.459 },
          { word: "salon.", start: 19.479, end: 20.079 },
        ],
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_ONE_GAME_EVENT,
};

export const dayOnePartyComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_PARTY_COMFORT,
  day: 1,
  title: "Soiree",
  milestone: "soiree",
  entryAnnotation: "Lucie arrive à la soirée",
  audio: "experience/J01_S05_Soiree_Tenue_Confort.mp3",
  dialogues: [
    d(
      "d1_19b",
      "Ines",
      "Hey, ça fait plaisir de te voir !",
      {
        timings: [
          { word: "Hey,", start: 7.199, end: 7.579 },
          { word: "ça", start: 7.619, end: 7.739 },
          { word: "fait", start: 7.759, end: 7.899 },
          { word: "plaisir", start: 7.919, end: 8.18 },
          { word: "de", start: 8.18, end: 8.28 },
          { word: "te", start: 8.34, end: 8.439 },
          { word: "voir", start: 8.46, end: 8.719 },
          { word: "!", start: 9.099, end: 9.14 },
        ],
      }
    ),
    d(
      "d1_20b",
      "LUCIE",
      "Mais moi aussi, ça me fait plaisir.",
      {
        timings: [
          { word: "Mais", start: 9.159, end: 9.28 },
          { word: "moi", start: 9.32, end: 9.42 },
          { word: "aussi,", start: 9.439, end: 9.68 },
          { word: "ça", start: 9.699, end: 9.779 },
          { word: "me", start: 9.8, end: 9.86 },
          { word: "fait", start: 9.86, end: 10 },
          { word: "plaisir.", start: 10.019, end: 10.84 },
        ],
      }
    ),
    d(
      "d1_21b",
      "Ines",
      "Comment il va, le petit monstre? Ça fait longtemps que je ne l'ai pas vu, lui non plus.",
      {
        timings: [
          { word: "Comment", start: 10.859, end: 11.1 },
          { word: "il", start: 11.14, end: 11.239 },
          { word: "va,", start: 11.259, end: 11.36 },
          { word: "le", start: 11.4, end: 11.46 },
          { word: "petit", start: 11.46, end: 11.639 },
          { word: "monstre?", start: 11.72, end: 12.199 },
          { word: "Ça", start: 12.239, end: 12.38 },
          { word: "fait", start: 12.38, end: 12.5 },
          { word: "longtemps", start: 12.539, end: 12.779 },
          { word: "que", start: 12.799, end: 12.839 },
          { word: "je", start: 12.84, end: 12.88 },
          { word: "ne", start: 12.88, end: 12.88 },
          { word: "l'ai", start: 12.899, end: 13 },
          { word: "pas", start: 13.019, end: 13.159 },
          { word: "vu,", start: 13.179, end: 13.26 },
          { word: "lui", start: 13.279, end: 13.38 },
          { word: "non", start: 13.399, end: 13.539 },
          { word: "plus.", start: 13.559, end: 13.76 },
        ],
      }
    ),
    d(
      "d1_22b",
      "LUCIE",
      "Ben, ça va, il va bien hein.",
      {
        timings: [
          { word: "Ben,", start: 14.359, end: 14.52 },
          { word: "ça", start: 14.56, end: 14.639 },
          { word: "va,", start: 14.699, end: 14.8 },
          { word: "il", start: 14.84, end: 14.9 },
          { word: "va", start: 14.94, end: 15.079 },
          { word: "bien", start: 15.139, end: 15.319 },
          { word: "hein.", start: 15.339, end: 15.539 },
        ],
      }
    ),
    d(
      "d1_23b",
      "Ines",
      "Ah bah super alors. Bah viens, rentre, prends un verre et je te rejoins dans le salon.",
      {
        timings: [
          { word: "Ah", start: 16.039, end: 16.158 },
          { word: "bah", start: 16.219, end: 16.318 },
          { word: "super", start: 16.42, end: 16.719 },
          { word: "alors.", start: 16.799, end: 17.18 },
          { word: "Bah", start: 17.2, end: 17.3 },
          { word: "viens,", start: 17.359, end: 17.659 },
          { word: "rentre,", start: 17.699, end: 17.979 },
          { word: "prends", start: 18.0, end: 18.159 },
          { word: "un", start: 18.18, end: 18.219 },
          { word: "verre", start: 18.299, end: 18.44 },
          { word: "et", start: 18.46, end: 18.479 },
          { word: "je", start: 18.479, end: 18.52 },
          { word: "te", start: 18.54, end: 18.62 },
          { word: "rejoins", start: 18.64, end: 18.799 },
          { word: "dans", start: 18.819, end: 18.879 },
          { word: "le", start: 18.879, end: 18.959 },
          { word: "salon.", start: 18.979, end: 20.979 },
        ],
      }
    ),
  ],
  nextSceneId: SCENE_IDS.DAY_ONE_GAME_EVENT,
};
