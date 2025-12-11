export type EquipmentType = 'full_gym' | 'dumbbells' | 'bodyweight';

export interface UserProfile {
  gender: 'male' | 'female' | 'other';
  age: number;
  heightCm: number;
  weightKg?: number;
  equipment: EquipmentType;
  goal: 'muscle' | 'fat_loss' | 'strength' | 'fitness';
  trainingDaysPerWeek: number;
}

export interface StrengthEstimate {
  benchPressKg?: number;
  squatKg?: number;
  deadliftKg?: number;
  latPulldownKg?: number;
  dumbbellPressKg?: number;
  dumbbellRowKg?: number;
  gobletSquatKg?: number;
  maxPushups?: number;
  maxPullups?: number;
  plankSeconds?: number;
}

export interface Exercise {
  id: string;
  name: string;
  equipment: EquipmentType | 'any';
  suggestedWeightKg?: number;
  suggestedReps: number;
  suggestedSets: number;
  restSeconds: number;
}

export interface TrainingProgramDay {
  dayIndex: number;
  label: string;
  exercises: Exercise[];
}

export interface TrainingProgram {
  id: string;
  daysPerWeek: number;
  days: TrainingProgramDay[];
}

export interface ExerciseSetLog {
  exerciseId: string;
  setIndex: number;
  weightKg?: number;
  repsCompleted: number;
  timestamp: string;
}

export interface WorkoutSession {
  id: string;
  date: string;
  dayLabel: string;
  exerciseLogs: ExerciseSetLog[];
  startedAt: string;
  finishedAt: string;
  fromBackend?: boolean;
}
