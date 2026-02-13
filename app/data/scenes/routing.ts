import type { Scene } from "../../types/game";
import { SCENE_IDS } from "../constants";

/**
 * Ces scènes ne contiennent pas de contenu direct (dialogues vides).
 * Elles servent de ponts logiques pour aiguiller automatiquement le joueur
 * vers la variante correcte d'une scène en fonction des flags du jeu.
 */

/** 
 * Point d'entrée du milestone "Retour" (Fin du Jour 1).
 * Redirige vers la version audio correspondante à la tenue choisie.
 */
export const dayOneEndGoodAssert: Scene = {
  id: SCENE_IDS.DAY_ONE_END_GOOD_ASSERT,
  day: 1,
  title: "Retour",
  dialogues: [],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_SEXY,
    elseSceneId: SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_COMFORT,
  },
};

/**
 * Transition vers le Jour 2.
 * Redirige vers le réveil difficile ou normal selon si le joueur a fait un burn-out (crash).
 */
export const dayTwoWakeup: Scene = {
  id: SCENE_IDS.DAY_TWO_WAKEUP,
  day: 2,
  title: "Reveil",
  dialogues: [],
  autoChoice: {
    condition: { flag: "hadBreakdown", operator: "equals", value: true },
    thenSceneId: SCENE_IDS.DAY_TWO_WAKEUP_CRASH,
    elseSceneId: SCENE_IDS.DAY_TWO_WAKEUP_GOOD,
  },
};
