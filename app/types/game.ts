// Types pour le serious game

export type OutfitChoice = "sexy" | "comfort" | null;
export type ConflictOutcome = "submit" | "assert" | null;
export type GameEventChoice = "play" | "refuse" | null;

export interface GameFlags {
  outfitChoice: OutfitChoice;
  conflictOutcome: ConflictOutcome;
  gameEventChoice: GameEventChoice;
  hadBreakdown: boolean;
  energy: number; // 0-100
}

export interface DialogueLine {
  id: string;
  speaker: string; // "LUCIE", "AMI", "ANNONCE", "KAREN", "INES", etc.
  speakerType: "pensees" | "normal"; // Pour afficher "(pensees)" apres le nom
  text: string;
  annotation?: string; // Texte en italique au-dessus (ex: "A la gare.", "Le telephone sonne...")
  audio?: string; // Chemin audio (placeholder)
  timings?: Array<{ start: number; end: number }>; // Timings pour animation mot par mot
  color?: string; // Trigger effet aurore boreale
}

export interface ChoiceCondition {
  flag: keyof GameFlags;
  operator: "equals" | "notEquals" | "greaterThan" | "lessThan";
  value: string | number | boolean | null;
}

export interface ChoiceEffects {
  energy?: number;
  flags?: Partial<GameFlags>;
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  effects?: ChoiceEffects;
  condition?: ChoiceCondition; // Condition pour que le choix soit disponible
  disabledReason?: string; // Ex: "(Energie insuffisante)" si condition non remplie
}

export interface AutoChoice {
  condition: ChoiceCondition;
  thenSceneId: string;
  elseSceneId: string;
}

export interface Scene {
  id: string;
  day: 1 | 2;
  title: string; // "Reveil", "Trajet", "Appel", etc.
  milestone?: string; // ID milestone pour navigation (ex: "trajet", "bureau")
  dialogues: DialogueLine[];
  choices?: Choice[];
  nextSceneId?: string; // Scene suivante si pas de choix
  autoChoice?: AutoChoice; // Choix automatique base sur les flags
  onEnter?: {
    energyChange?: number;
    setFlags?: Partial<GameFlags>;
  };
}

export interface Milestone {
  id: string;
  label: string;
  sceneId: string;
  day: 1 | 2;
}

export interface GameData {
  scenes: Record<string, Scene>;
  initialSceneId: string;
  initialFlags: GameFlags;
  milestones: Milestone[];
}

// Phases de l'animation d'intro
export type IntroAnimationPhase = "hidden" | "annotation" | "revealing" | "complete";

export interface GameState {
  currentSceneId: string;
  currentDialogueIndex: number;
  flags: GameFlags;
  reachedMilestones: string[];
  isTransitioning: boolean;
  showChoices: boolean;
  isMenuOpen: boolean;
  introPlayed: boolean;
  introAnimationPhase: IntroAnimationPhase;
}
