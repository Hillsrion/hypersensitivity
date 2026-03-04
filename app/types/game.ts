// Types pour le serious game

export type OutfitChoice = 'sexy' | 'comfort' | null
export type ConflictOutcome = 'submit' | 'assert' | null
export type GameEventChoice = 'play' | 'refuse' | null

export type GameFlags = {
  outfitChoice: OutfitChoice
  conflictOutcome: ConflictOutcome
  gameEventChoice: GameEventChoice
  hadBreakdown: boolean
  callChoice: 'accept' | 'refuse' | null
  energy: number // 0-100
}

export type DialogueLine = {
  id: string
  speaker: string // "LUCIE", "AMI", "ANNONCE", "KAREN", "INES", etc.
  speakerType: 'thoughts' | 'normal' // Pour afficher \"(thoughts)\" apres le nom
  text: string
  annotation?: string // Texte en italique au-dessus (ex: "A la gare.", "Le telephone sonne...")
  timings?: Array<{
    word?: string
    annotation?: string
    showOnly?: boolean
    start: number
    end: number | 'end'
  }> // Timings pour animation mot par mot (en ms)
  color?: string // Trigger effet aurore boreale
  isChat?: boolean // Si c'est un échange textuel (Slack, SMS) - désactive l'animation mot par mot
  energyChange?: number // Changement d'énergie à appliquer au début du dialogue
}

export type ChoiceCondition = {
  flag: keyof GameFlags
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan'
  value: string | number | boolean | null
}

export type ChoiceEffects = {
  energy?: number
  flags?: Partial<GameFlags>
}

export type Choice = {
  id: string
  text: string
  nextSceneId: string
  effects?: ChoiceEffects
  condition?: ChoiceCondition // Condition pour que le choix soit disponible
  disabledReason?: string // Ex: "(Energie insuffisante)" si condition non remplie
}

export type Scene = {
  id: string
  day: 1 | 2
  title: string // "Reveil", "Trajet", "Appel", etc.
  dialogues: DialogueLine[]
  choices?: Choice[]
  nextSceneId?: string // Scene suivante si pas de choix
  condition?: ChoiceCondition // Condition pour jouer cette scene (si fausse, on passe a la suivante)
  conditions?: ChoiceCondition[] // Multiple conditions (AND logic)

  entryAnnotation?: string // Annotation s'affichant avant les dialogues (transition de scène)
  audio?: string // Audio global de la scene
  onEnter?: {
    energyChange?: number
    setFlags?: Partial<GameFlags>
  }
}

export type Milestone = {
  id: string
  label: string
  day: 1 | 2
}

export type GameData = {
  scenes: Record<string, Scene>
  initialSceneId: string
  initialFlags: GameFlags
}

// Phases de l'animation d'intro
export type IntroAnimationPhase =
  | 'hidden'
  | 'annotation'
  | 'milestoneAnnotation'
  | 'revealing'
  | 'complete'

export type MenuStatus = 'closed' | 'opening' | 'open' | 'closing'

export type GameState = {
  currentSceneId: string
  currentDialogueIndex: number
  flags: GameFlags
  reachedMilestones: string[]
  isTransitioning: boolean
  showChoices: boolean
  menuStatus: MenuStatus
  introPlayed: boolean
  introAnimationPhase: IntroAnimationPhase
  introBlurAmount: number
  isAutoScrolling: boolean
  selectedChoice: Choice | null
  showQuiz: boolean
  showFinalFooter: boolean
  forceShowUI: boolean
  isDayTransitioning: boolean
  pendingTransitionSceneId: string | null
  _annotationTimerId: ReturnType<typeof setTimeout> | null
  hasGameEnded: boolean
}

export type PersistedGameState = {
  version: 1
  currentSceneId: string
  currentDialogueIndex: number
  flags: GameFlags
  reachedMilestones: string[]
  introPlayed: boolean
  showQuiz: boolean
  forceShowUI: boolean
  hasGameEnded: boolean
}

export type RawAudioTiming = {
  word?: string
  annotation?: string
  showOnly?: boolean
  start: number | string
  end: number | string
  startOffset?: string
  endOffset?: string
}

export type AudioPreloadItem = {
  path: string
  transcript?: string
  timings?: RawAudioTiming[]
}
