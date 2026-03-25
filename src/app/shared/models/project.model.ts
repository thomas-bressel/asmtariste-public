export type DifficultyLevel = 'beginner' | 'beginner-plus' | 'intermediate' | 'intermediate-plus' | 'advanced' | 'expert';

export type MachineConfig = 'st-512k' | 'st-1mo' | 'ste' | 'emulator';

export type ProjectStatus = 'active' | 'abandoned';

export type FeltDifficulty = 'easy' | 'medium' | 'hard' | null;

export interface ProjectSkill {
  label: string;
}

export interface ProjectTask {
  id: string;
  label: string;
}

export interface ProjectPhase {
  id: string;
  title: string;
  deliverableLabel: string;
  tasks: ProjectTask[];
}

export interface ProjectTemplate {
  slug: string;
  title: string;
  reference: string;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  image: string;
  description: string;
  skills: ProjectSkill[];
  phases: ProjectPhase[];
}

// --- État utilisateur ---

export interface UserTaskState {
  taskId: string;
  checked: boolean;
}

export interface UserPhaseState {
  phaseId: string;
  tasks: UserTaskState[];
  deliverableUrl: string | null;
  unlocked: boolean;
  note: string | null;
  noteCreatedAt: string | null;
  noteUpdatedAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  feltDifficulty: FeltDifficulty;
}

export interface UserProject {
  id: string;
  templateSlug: string;
  title: string;
  machineConfig: MachineConfig;
  status: ProjectStatus;
  startedAt: string;
  phases: UserPhaseState[];
}
