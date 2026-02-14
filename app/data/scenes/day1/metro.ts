import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { d, pensees } from "../../helpers";

export const dayOneMetroSexy: Scene = {
  id: SCENE_IDS.DAY_ONE_METRO_SEXY,
  day: 1,
  title: "Trajet",
  entryAnnotation: "À la gare",
  condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
  audio: "experience/J01_S03_Trajet_A.mp3",
  dialogues: [
    d(
      "d1a_4",
      "Annonce",
      "En raison d'un bagage abandonné, les métros A et B-",
      {
        color: "red",
        timings: [
          { word: "En", start: 0.079, end: 1.24 },
          { word: "raison", start: 1.259, end: 1.499 },
          { word: "d'un", start: 1.5, end: 1.659 },
          { word: "bagage", start: 1.679, end: 2 },
          { word: "abandonné,", start: 2.019, end: 2.639 },
          { word: "les", start: 2.96, end: 3.119 },
          { word: "métros", start: 3.139, end: 3.479 },
          { word: "A", start: 3.6, end: 3.74 },
          { word: "et", start: 3.779, end: 3.899 },
          { word: "B-", start: 3.919, end: 4.139 },
        ],
      }
    ),
    pensees(
      "d1a_5",
      "Mais qu'est-ce que je fous là ? C'est trop !",
      {
        color: "red",
        timings: [
          { word: "Mais", start: 4.279, end: 4.42 },
          { word: "qu'est-ce", start: 4.5, end: 4.719 },
          { word: "que", start: 4.739, end: 4.819 },
          { word: "je", start: 4.819, end: 4.879 },
          { word: "fous", start: 4.96, end: 5.079 },
          { word: "là", start: 5.119, end: 5.439 },
          { word: "?", start: 5.539, end: 5.599 },
          { word: "C'est", start: 5.799, end: 5.939 },
          { word: "trop", start: 5.96, end: 6.419 },
          { word: "!", start: 6.48, end: 6.5 },
        ],
      }
    ),
    pensees(
      "d1a_6",
      "Je vais aller prendre un vélo et je vais me faire siffler cinq fois sur le chemin. Super.",
      {
        color: "blue",
        timings: [
          { word: "Je", start: 8.52, end: 8.559 },
          { word: "vais", start: 8.579, end: 8.659 },
          { word: "aller", start: 8.699, end: 8.84 },
          { word: "prendre", start: 8.9, end: 9.079 },
          { word: "un", start: 9.099, end: 9.179 },
          { word: "vélo", start: 9.199, end: 9.539 },
          { word: "et", start: 9.699, end: 9.759 },
          { word: "je", start: 9.779, end: 9.819 },
          { word: "vais", start: 9.82, end: 9.9 },
          { word: "me", start: 9.9, end: 9.98 },
          { word: "faire", start: 9.98, end: 10.119 },
          { word: "siffler", start: 10.139, end: 10.579 },
          { word: "cinq", start: 10.599, end: 10.779 },
          { word: "fois", start: 10.88, end: 11.02 },
          { word: "sur", start: 11.06, end: 11.159 },
          { word: "le", start: 11.179, end: 11.239 },
          { word: "chemin.", start: 11.279, end: 11.659 },
          { word: "Super.", start: 11.939, end: 12.44 },
        ],
      }
    ),
    d(
      "d1a_7",
      "Inconnue",
      "Coucou, je voulais juste te dire que t'es trop belle. C'est quoi la ref de ta robe ?",
      {
        color: "green",
        timings: [
          { word: "Coucou,", start: 13.14, end: 13.699 },
          { word: "je", start: 13.719, end: 13.779 },
          { word: "voulais", start: 13.799, end: 14 },
          { word: "juste", start: 14.039, end: 14.18 },
          { word: "te", start: 14.22, end: 14.299 },
          { word: "dire", start: 14.34, end: 14.479 },
          { word: "que", start: 14.539, end: 14.6 },
          { word: "t'es", start: 14.64, end: 14.699 },
          { word: "trop", start: 14.799, end: 15.019 },
          { word: "belle.", start: 15.079, end: 15.5 },
          { word: "C'est", start: 15.519, end: 15.64 },
          { word: "quoi", start: 15.659, end: 15.779 },
          { word: "la", start: 15.799, end: 15.879 },
          { word: "ref", start: 15.92, end: 16.1 },
          { word: "de", start: 16.14, end: 16.199 },
          { word: "ta", start: 16.26, end: 16.359 },
          { word: "robe", start: 16.42, end: 16.64 },
          { word: "?", start: 16.739, end: 16.78 },
        ],
      }
    ),
    d(
      "d1a_8",
      "LUCIE",
      "Oh, merci beaucoup ! C'est une robe Maje, la patineuse à col montant.",
      {
        color: "green",
        timings: [
          { word: "Oh,", start: 17.479, end: 17.679 },
          { word: "merci", start: 17.719, end: 17.98 },
          { word: "beaucoup !", start: 18.02, end: 18.62 },
          { word: "C'est", start: 18.899, end: 19 },
          { word: "une", start: 19.02, end: 19.12 },
          { word: "robe", start: 19.159, end: 19.34 },
          { word: "Maje,", start: 19.379, end: 19.879 },
          { word: "la", start: 19.92, end: 19.979 },
          { word: "patineuse", start: 20.059, end: 20.44 },
          { word: "à", start: 20.5, end: 20.52 },
          { word: "col", start: 20.559, end: 20.699 },
          { word: "montant.", start: 20.739, end: 21.2 },
        ],
      }
    ),
    d(
      "d1a_9",
      "Inconnue",
      "Merciii !",
      {
        timings: [
          { word: "Merciii", start: 21.899, end: 22.619 },
          { word: "!", start: 22.659, end: 22.979 },
        ],
      }
    ),
  ],
};

export const dayOneMetroComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_METRO_COMFORT,
  day: 1,
  title: "Trajet",
  entryAnnotation: "À la gare",
  condition: { flag: "outfitChoice", operator: "equals", value: "comfort" },
  audio: "experience/J01_S03_Trajet_B.mp3",
  dialogues: [
    d(
      "d1b_4",
      "Annonce",
      "En raison d'un bagage abandonné, le métro A et B-",
      {
        color: "red",
        timings: [
          { word: "En", start: 0.079, end: 1.24 },
          { word: "raison", start: 1.259, end: 1.519 },
          { word: "d'un", start: 1.519, end: 1.659 },
          { word: "bagage", start: 1.679, end: 2 },
          { word: "abandonné,", start: 2.019, end: 2.579 },
          { word: "le", start: 3, end: 3.079 },
          { word: "métro", start: 3.139, end: 3.599 },
          { word: "A", start: 3.619, end: 3.759 },
          { word: "et", start: 3.779, end: 3.899 },
          { word: "B-", start: 3.98, end: 4.26 },
        ],
      }
    ),
    pensees(
      "d1b_5",
      "Mais qu'est-ce que je fous là ? C'est trop !",
      {
        color: "red",
        timings: [
          { word: "Mais", start: 4.279, end: 4.48 },
          { word: "qu'est-ce", start: 4.5, end: 4.719 },
          { word: "que", start: 4.739, end: 4.799 },
          { word: "je", start: 4.839, end: 4.879 },
          { word: "fous", start: 4.96, end: 5.099 },
          { word: "là", start: 5.139, end: 5.439 },
          { word: "?", start: 5.539, end: 5.539 },
          { word: "C'est", start: 5.779, end: 5.96 },
          { word: "trop", start: 5.96, end: 6.419 },
          { word: "!", start: 6.419, end: 7.659 },
        ],
      }
    ),
    pensees(
      "d1b_6",
      "Bah, [souffle] vélo hein, ça aurait été relou avec la robe.",
      {
        color: "green",
        timings: [
          { word: "Bah,", start: 8.819, end: 9.1 },
          { word: "[souffle]", start: 9.619, end: 9.619 },
          { word: "vélo", start: 9.659, end: 10 },
          { word: "hein,", start: 10.059, end: 10.319 },
          { word: "ça", start: 10.76, end: 10.84 },
          { word: "aurait", start: 10.859, end: 11.059 },
          { word: "été", start: 11.119, end: 11.4 },
          { word: "relou", start: 11.46, end: 11.839 },
          { word: "avec", start: 11.9, end: 12.059 },
          { word: "la", start: 12.1, end: 12.219 },
          { word: "robe.", start: 12.239, end: 13.979 },
        ],
      }
    ),
  ],
};
