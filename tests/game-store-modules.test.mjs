import assert from "node:assert/strict";
import test from "node:test";
import { evaluateCondition, isSceneEligible } from "../app/stores/game/conditions.ts";
import {
  clampEnergy,
  applyDialogueEnergyChange,
  applyChoiceEffects,
} from "../app/stores/game/effects.ts";
import {
  resolveNextProgressionStep,
  findFirstValidSceneIdInMilestone,
} from "../app/stores/game/progression.ts";
import { getToggleTargetMenuStatus, finalizeClosingStatus } from "../app/stores/game/menu.ts";
import {
  toPersistedGameState,
  normalizePersistedSnapshot,
  saveSnapshot,
  loadSnapshot,
} from "../app/stores/game/persistence.ts";
import { getEntryAnnotationPhase, computeAnnotationDelayMs } from "../app/stores/game/intro.ts";

const baseFlags = {
  outfitChoice: null,
  conflictOutcome: null,
  gameEventChoice: null,
  hadBreakdown: false,
  callChoice: null,
  refuseOutcome: null,
  energy: 50,
};

test("evaluateCondition handles all operators", () => {
  const flags = { ...baseFlags, energy: 42, outfitChoice: "comfort" };

  assert.equal(
    evaluateCondition(
      { flag: "outfitChoice", operator: "equals", value: "comfort" },
      flags
    ),
    true
  );
  assert.equal(
    evaluateCondition(
      { flag: "outfitChoice", operator: "notEquals", value: "sexy" },
      flags
    ),
    true
  );
  assert.equal(
    evaluateCondition(
      { flag: "energy", operator: "greaterThan", value: 30 },
      flags
    ),
    true
  );
  assert.equal(
    evaluateCondition(
      { flag: "energy", operator: "lessThan", value: 30 },
      flags
    ),
    false
  );
});

test("isSceneEligible supports condition and conditions", () => {
  const sceneA = {
    condition: { flag: "outfitChoice", operator: "equals", value: "sexy" },
  };
  const sceneB = {
    conditions: [
      { flag: "energy", operator: "greaterThan", value: 10 },
      { flag: "energy", operator: "lessThan", value: 90 },
    ],
  };

  assert.equal(isSceneEligible(sceneA, baseFlags), false);
  assert.equal(isSceneEligible(sceneB, baseFlags), true);
});

test("effects clamp and apply dialogue/choice changes", () => {
  assert.equal(clampEnergy(120), 100);
  assert.equal(clampEnergy(-5), 0);

  const afterDialogue = applyDialogueEnergyChange(baseFlags, { energyChange: -20 });
  assert.equal(afterDialogue.energy, 30);

  const afterChoice = applyChoiceEffects(baseFlags, {
    energy: 15,
    flags: { hadBreakdown: true, conflictOutcome: "assert" },
  });

  assert.equal(afterChoice.energy, 65);
  assert.equal(afterChoice.hadBreakdown, true);
  assert.equal(afterChoice.conflictOutcome, "assert");
});

test("progression finds next scene in milestone", () => {
  const scenes = {
    s1: { id: "s1", day: 1, title: "A", dialogues: [] },
    s2: {
      id: "s2",
      day: 1,
      title: "B",
      dialogues: [],
      condition: { flag: "energy", operator: "greaterThan", value: 20 },
    },
    s3: {
      id: "s3",
      day: 1,
      title: "C",
      dialogues: [],
      condition: { flag: "energy", operator: "greaterThan", value: 90 },
    },
    s4: { id: "s4", day: 1, title: "D", dialogues: [] },
  };

  const milestones = {
    m1: { id: "m1", label: "M1", day: 1, scenes: ["s1", "s2", "s3"] },
    m2: { id: "m2", label: "M2", day: 1, scenes: ["s4"] },
  };

  const getMilestoneForScene = (sceneId) =>
    Object.values(milestones).find((m) => m.scenes.includes(sceneId));

  const next = resolveNextProgressionStep({
    currentSceneId: "s1",
    flags: baseFlags,
    scenes,
    milestones,
    milestoneOrder: ["m1", "m2"],
    getMilestoneForScene,
  });

  assert.deepEqual(next, { type: "scene", sceneId: "s2" });
});

test("progression falls back to next milestone", () => {
  const scenes = {
    s1: { id: "s1", day: 1, title: "A", dialogues: [] },
    s2: {
      id: "s2",
      day: 1,
      title: "B",
      dialogues: [],
      condition: { flag: "energy", operator: "greaterThan", value: 80 },
    },
    s3: { id: "s3", day: 1, title: "C", dialogues: [] },
  };

  const milestones = {
    m1: { id: "m1", label: "M1", day: 1, scenes: ["s1", "s2"] },
    m2: { id: "m2", label: "M2", day: 1, scenes: ["s3"] },
  };

  const getMilestoneForScene = (sceneId) =>
    Object.values(milestones).find((m) => m.scenes.includes(sceneId));

  const next = resolveNextProgressionStep({
    currentSceneId: "s1",
    flags: baseFlags,
    scenes,
    milestones,
    milestoneOrder: ["m1", "m2"],
    getMilestoneForScene,
  });

  assert.deepEqual(next, { type: "milestone", milestoneId: "m2" });
});

test("findFirstValidSceneIdInMilestone returns first eligible scene", () => {
  const scenes = {
    a: {
      id: "a",
      day: 1,
      title: "A",
      dialogues: [],
      condition: { flag: "energy", operator: "greaterThan", value: 80 },
    },
    b: { id: "b", day: 1, title: "B", dialogues: [] },
  };

  const milestones = {
    m: { id: "m", label: "M", day: 1, scenes: ["a", "b"] },
  };

  assert.equal(findFirstValidSceneIdInMilestone("m", milestones, scenes, baseFlags), "b");
});

test("menu state helpers keep expected transitions", () => {
  assert.equal(getToggleTargetMenuStatus("open"), "closing");
  assert.equal(getToggleTargetMenuStatus("closed"), "opening");
  assert.equal(finalizeClosingStatus("closing"), "closed");
  assert.equal(finalizeClosingStatus("open"), "open");
});

test("intro helpers compute stable phase and delays", () => {
  assert.equal(getEntryAnnotationPhase(true), "milestoneAnnotation");
  assert.equal(getEntryAnnotationPhase(false), "annotation");
  assert.equal(computeAnnotationDelayMs(undefined), 2500);
  assert.equal(computeAnnotationDelayMs(0.1), 1000);
});

test("persistence serializes only whitelisted data", () => {
  const persisted = toPersistedGameState({
    currentSceneId: "sceneA",
    currentDialogueIndex: 3,
    flags: baseFlags,
    reachedMilestones: ["reveil", "bureau"],
    introPlayed: true,
    menuStatus: "closed",
    showQuestionnaire: false,
    forceShowUI: false,
  });

  assert.equal(persisted.version, 1);
  assert.deepEqual(persisted.reachedMilestones, ["reveil", "bureau"]);
  assert.equal(Object.prototype.hasOwnProperty.call(persisted, "_annotationTimerId"), false);
});

test("persistence normalization is robust", () => {
  const normalized = normalizePersistedSnapshot({
    currentSceneId: 42,
    currentDialogueIndex: -1,
    flags: { energy: 250, callChoice: "accept" },
    reachedMilestones: ["trajet"],
    menuStatus: "invalid",
  });

  assert.equal(normalized.currentDialogueIndex, 0);
  assert.equal(normalized.flags.energy, 100);
  assert.equal(normalized.flags.callChoice, "accept");
  assert.deepEqual(normalized.reachedMilestones, ["reveil", "trajet"]);
  assert.equal(normalized.menuStatus, "closed");
});

test("saveSnapshot/loadSnapshot roundtrip with injected storage", () => {
  const backing = new Map();
  const storage = {
    setItem: (key, value) => backing.set(key, value),
    getItem: (key) => backing.get(key) ?? null,
  };

  saveSnapshot(
    "game-key",
    {
      currentSceneId: "sceneA",
      currentDialogueIndex: 1,
      flags: baseFlags,
      reachedMilestones: ["reveil"],
      introPlayed: false,
      menuStatus: "closed",
      showQuestionnaire: false,
      forceShowUI: false,
    },
    storage
  );

  const loaded = loadSnapshot("game-key", storage);
  assert.equal(loaded.currentSceneId, "sceneA");
  assert.equal(loaded.currentDialogueIndex, 1);
  assert.deepEqual(loaded.reachedMilestones, ["reveil"]);
});

test("loadSnapshot throws on invalid JSON", () => {
  const storage = {
    getItem: () => "{invalid-json",
  };

  assert.throws(() => loadSnapshot("game-key", storage));
});
