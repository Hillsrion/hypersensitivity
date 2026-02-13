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
 * Routing pour le milestone "Trajet" (Jour 1)
 */
export const dayOneMetroRouting: Scene = {
  id: SCENE_IDS.DAY_ONE_METRO_ROUTING,
  day: 1,
  title: "Trajet",
  dialogues: [],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: SCENE_IDS.DAY_ONE_METRO_SEXY,
    elseSceneId: SCENE_IDS.DAY_ONE_METRO_COMFORT,
  },
};

/**
 * Routing pour le milestone "Soirée" (Jour 1)
 */
export const dayOnePartyRouting: Scene = {
  id: SCENE_IDS.DAY_ONE_PARTY_ROUTING,
  day: 1,
  title: "Soirée",
  dialogues: [],
  autoChoice: {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
    thenSceneId: SCENE_IDS.DAY_ONE_PARTY_SEXY,
    elseSceneId: SCENE_IDS.DAY_ONE_PARTY_COMFORT,
  },
};

/**
 * Routing pour le milestone "Retour" (Jour 1 - Entrée principale)
 * Redirige vers Crash ou Good selon le flag hadBreakdown.
 * Note: Le Good path a lui-même un sous-routing (dayOneEndGoodAssert) si nécessaire, 
 * mais ici on peut router vers les variantes principales.
 * On assume ici que RefuseAssert ou RefuseSubmit mènent potentiellement à GoodAssert/Reflect.
 * Pour simplifier, on assume que si pas breakdown, on va vers un bon retour.
 * Mais comme il y a plusieurs bon retours, on peut router vers dayOneEndGoodAssert 
 * (qui lui-même route vers Sexy/Comfort) ou dayOneEndGoodReflect.
 * Comme on ne track pas exactement "Reflect" vs "Assert" avec un flag unique mais le cheminement,
 * pour le RELANCE via milestone, on va assumer un par défaut ou vérifier d'autres flags.
 * 
 * Simplification: 
 * - Si hadBreakdown -> Crash
 * - Sinon -> Good Assert (qui dispatchera sexy/comfort)
 * (Le cas "Reflect" n'est accessible que via un chemin spécifique, diffcile à rejouer sans contexte complet,
 * on fallback sur Assert pour l'instant pour "Good Ending generic").
 */
export const dayOneEndRouting: Scene = {
  id: SCENE_IDS.DAY_ONE_END_ROUTING,
  day: 1,
  title: "Retour",
  dialogues: [],
  autoChoice: {
    condition: { flag: "hadBreakdown", operator: "equals", value: true },
    thenSceneId: SCENE_IDS.DAY_ONE_END_CRASH,
    elseSceneId: SCENE_IDS.DAY_ONE_END_GOOD_ASSERT, // Dispatchera ensuite vers Sexy/Comfort
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
