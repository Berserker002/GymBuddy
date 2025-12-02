export type Goal = 'Strength' | 'Hypertrophy' | 'Fat Loss';
export type Experience = 'Beginner' | 'Intermediate' | 'Advanced';
export type Equipment = 'Full Gym' | 'Home' | 'Minimal';

export interface Profile {
  goal: Goal;
  experience: Experience;
  equipment: Equipment;
  lifts?: Partial<Record<'bench' | 'squat' | 'deadlift' | 'ohp', number>>;
}

export interface ExerciseActions {
  swap: boolean;
  edited: boolean;
  removed: boolean;
}

export interface ExercisePlan {
  id: string;
  name: string;
  sets: number;
  reps: string;
  target_weight: number;
  user_weight?: number;
  actions: ExerciseActions;
}

export interface WorkoutPlan {
  day: string;
  goal: Goal;
  exercises: ExercisePlan[];
  preferences?: {
    avoid_exercises?: string[];
    preferred_equipment?: string[];
  };
}

export interface WorkoutLog {
  exerciseId: string;
  completedSets: number;
  totalSets: number;
  weights: (number | null)[];
}

export interface HistoryEntry {
  date: string;
  lift: string;
  weight: number;
}

export interface ExerciseGuideEntry {
  name: string;
  muscles: string[];
  setup: string;
  execution: string;
  mistakes: string;
  safety: string;
}
