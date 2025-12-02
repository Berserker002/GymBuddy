export type Goal = 'Strength' | 'Hypertrophy' | 'Fat Loss';

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
  weights: number[];
}
