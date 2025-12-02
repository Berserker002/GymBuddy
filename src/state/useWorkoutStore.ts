import create from 'zustand';
import { initProgram } from '../api/mockApi';
import { ExercisePlan, Profile, WorkoutLog, WorkoutPlan } from '../types/workout';

type WorkoutState = {
  profile: Profile;
  plan: WorkoutPlan;
  logs: WorkoutLog[];
  loadingPlan: boolean;
  toggleSetCompletion: (exerciseId: string, setIndex: number, weight: number) => void;
  updateExercise: (updated: ExercisePlan) => void;
  setProfile: (profile: Profile) => void;
  loadPlan: (profile?: Profile) => Promise<void>;
  reset: () => void;
};

const defaultProfile: Profile = {
  goal: 'Hypertrophy',
  experience: 'Intermediate',
  equipment: 'Full Gym',
  lifts: { bench: 60 },
};

const defaultPlan: WorkoutPlan = {
  day: 'Push Day',
  goal: 'Hypertrophy',
  exercises: [
    {
      id: 'bench_press',
      name: 'Bench Press',
      sets: 3,
      reps: '8',
      target_weight: 60,
      user_weight: 62.5,
      actions: { swap: false, edited: true, removed: false },
    },
    {
      id: 'incline_dumbbell_press',
      name: 'Incline Dumbbell Press',
      sets: 3,
      reps: '10',
      target_weight: 24,
      actions: { swap: false, edited: false, removed: false },
    },
    {
      id: 'tricep_pushdown',
      name: 'Tricep Pushdown',
      sets: 3,
      reps: '12',
      target_weight: 32,
      actions: { swap: false, edited: false, removed: false },
    },
  ],
  preferences: {
    avoid_exercises: ['barbell squat'],
    preferred_equipment: ['dumbbell'],
  },
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  profile: defaultProfile,
  plan: defaultPlan,
  logs: [],
  loadingPlan: false,
  toggleSetCompletion: (exerciseId, setIndex, weight) =>
    set((state) => {
      const exercise = state.plan.exercises.find((ex) => ex.id === exerciseId);
      if (!exercise) return state;

      const totalSets = exercise.sets;
      const existingLog = state.logs.find((log) => log.exerciseId === exerciseId);
      const weights = existingLog?.weights ? [...existingLog.weights] : Array(totalSets).fill(null);

      const isCompleted = weights[setIndex] !== null;
      weights[setIndex] = isCompleted ? null : weight;
      const completedSets = weights.filter((entry) => entry !== null).length;

      const newLog: WorkoutLog = {
        exerciseId,
        completedSets,
        totalSets,
        weights,
      };

      const updatedLogs = existingLog
        ? state.logs.map((log) => (log.exerciseId === exerciseId ? newLog : log))
        : [...state.logs, newLog];

      return { logs: updatedLogs };
    }),
  updateExercise: (updated) =>
    set((state) => ({
      plan: {
        ...state.plan,
        exercises: state.plan.exercises.map((ex) => (ex.id === updated.id ? updated : ex)),
      },
    })),
  setProfile: (profile) => set({ profile }),
  loadPlan: async (profileInput) => {
    const profile = profileInput ?? get().profile;
    set({ loadingPlan: true, profile });
    const plan = await initProgram(profile);
    set({ plan, loadingPlan: false, logs: [] });
  },
  reset: () => set({ plan: defaultPlan, logs: [], profile: defaultProfile, loadingPlan: false }),
}));
