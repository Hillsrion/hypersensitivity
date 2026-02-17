import type { ChoiceCondition, GameFlags, Scene } from "../../app/types/game";

export const evaluateCondition = (
  condition: ChoiceCondition,
  flags: GameFlags
): boolean => {
  const value = flags[condition.flag];

  switch (condition.operator) {
    case "equals":
      return value === condition.value;
    case "notEquals":
      return value !== condition.value;
    case "greaterThan":
      return typeof value === "number" && value > (condition.value as number);
    case "lessThan":
      return typeof value === "number" && value < (condition.value as number);
    default:
      return true;
  }
};

export const isSceneEligible = (
  scene: Pick<Scene, "condition" | "conditions"> | null | undefined,
  flags: GameFlags
): boolean => {
  if (!scene) return false;

  if (scene.condition && !evaluateCondition(scene.condition, flags)) {
    return false;
  }

  if (
    scene.conditions &&
    scene.conditions.some((condition) => !evaluateCondition(condition, flags))
  ) {
    return false;
  }

  return true;
};
