import type { Scene } from "../../../types/game";
import { SCENE_IDS } from "../../constants";
import { pensees } from "../../helpers";

export const dayOneEndCrash: Scene = {
  id: SCENE_IDS.DAY_ONE_END_CRASH,
  day: 1,
  title: "Retour",
  entryAnnotation: "De retour à la maison",
  condition: { flag: "hadBreakdown", operator: "equals", value: true },
  audio: "experience/J01_S06_Retour.mp3",
  dialogues: [
    pensees(
      "d1_47",
      "C'est sûr que j'ai cassé l'ambiance, ils m'inviteront plus maintenant. Pourquoi ? Pourquoi je craque là-dessus ? Pourquoi je suis pas normale ?",
      {
        color: "violet",
      }
    ),
    pensees(
      "d1_47_end",
      "Pourquoi je suis pas normale ?",
      {
        color: "violet",
        energyChange: -55,
      }
    ),
  ],
};

export const dayOneEndGoodAssertSexy: Scene = {
  id: SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_SEXY,
  day: 1,
  title: "Retour",
  entryAnnotation: "De retour à la maison",
  conditions: [
    { flag: "hadBreakdown", operator: "equals", value: false },
    { flag: "outfitChoice", operator: "equals", value: "sexy" },
    { flag: "conflictOutcome", operator: "equals", value: "assert" },
  ],
  audio: "experience/J01_S06_Retour_NoBreakdown_Raffinee.mp3",
  dialogues: [
    pensees(
      "d1_49s",
      "Je suis fière de moi, j'ai fait une bonne journée, je me suis pas laissée marcher dessus. J'étais canon ! La tenue m'allait super bien. J'ai su dire non quand j'avais pas envie. Et je suis trop heureuse d'avoir des amis comme ça, toujours là pour écouter mes galères. Ça peut être cent fois la même chose, ça peut être long comme un lundi avec mes vocaux d'une minute trente. Ça peut sembler insignifiant pour la plupart des gens et pourtant, elles sont toujours là pour m'écouter avec la même attention, pour me consoler, pour me donner les meilleurs conseils. Je suis tellement reconnaissante.",
      {
        color: "green",
      }
    )
  ],
};

export const dayOneEndGoodAssertComfort: Scene = {
  id: SCENE_IDS.DAY_ONE_END_GOOD_ASSERT_COMFORT,
  day: 1,
  title: "Retour",
  entryAnnotation: "De retour à la maison",
  conditions: [
    { flag: "hadBreakdown", operator: "equals", value: false },
    { flag: "outfitChoice", operator: "equals", value: "comfort" },
    { flag: "conflictOutcome", operator: "equals", value: "assert" },
  ],
  audio: "experience/J01_S06_Retour_NoBreakdown.mp3",
  dialogues: [
    pensees(
      "d1_49c",
      "J'suis fière de moi, j'ai fait une bonne journée. Je me suis pas laissée marcher dessus. J'ai su dire non quand j'avais pas envie. Et je suis trop heureuse d'avoir des amies comme ça, toujours là pour écouter mes galères. Ça peut être cent fois la même chose, ça peut être long comme un lundi avec mes vocaux d'une minute trente. Ça peut sembler insignifiant pour la plupart des gens et pourtant, elles sont toujours là pour m'écouter avec la même attention, pour me consoler, pour me donner les meilleurs conseils. Je suis tellement reconnaissante !",
      {
        color: "green",
      }
    )
  ],

};
export const dayOneEndGoodReflect: Scene = {
  id: SCENE_IDS.DAY_ONE_END_GOOD_REFLECT,
  day: 1,
  title: "Retour",
  conditions: [
    { flag: "hadBreakdown", operator: "equals", value: false },
    { flag: "conflictOutcome", operator: "notEquals", value: "assert" },
  ],
  audio: "experience/J01_S06_Retour_NoBreakdown.mp3",
  dialogues: [
    pensees(
      "d1_49r",
      "J'suis fière de moi, j'ai fait une bonne journée. Je me suis pas laissée marcher dessus. J'ai su dire non quand j'avais pas envie. Et je suis trop heureuse d'avoir des amies comme ça, toujours là pour écouter mes galères. Ça peut être cent fois la même chose, ça peut être long comme un lundi avec mes vocaux d'une minute trente. Ça peut sembler insignifiant pour la plupart des gens et pourtant, elles sont toujours là pour m'écouter avec la même attention, pour me consoler, pour me donner les meilleurs conseils. Je suis tellement reconnaissante !",
      {
        color: "green",
      }
    )
  ],

};
