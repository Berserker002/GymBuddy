import create from 'zustand';
import { ExercisePlan, WorkoutLog, WorkoutPlan } from '../types/workout';

type WorkoutState = {
  profile: {
    goal: string;
    experience: string;
    equipment: string;
  };
  plan: WorkoutPlan;
  logs: WorkoutLog[];
  toggleSetCompletion: (exerciseId: string, setIndex: number, weight: number) => void;
  updateExercise: (updated: ExercisePlan) => void;
  reset: () => void;
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

export const useWorkoutStore = create<WorkoutState>((set) => ({
  profile: {
    goal: 'Hypertrophy',
    experience: 'Intermediate',
    equipment: 'Full Gym',
  },
  plan: defaultPlan,
  logs: [],
  toggleSetCompletion: (exerciseId, setIndex, weight) =>
    set((state) => {
      const existingLog = state.logs.find((log) => log.exerciseId === exerciseId);
      if (existingLog) {
        const updatedWeights = [...existingLog.weights];
        updatedWeights[setIndex] = weight;
        return {
          logs: state.logs.map((log) =>
            log.exerciseId === exerciseId
              ? {
                  ...log,
                  completedSets: Math.max(log.completedSets, setIndex + 1),
                  weights: updatedWeights,
                }
              : log
          ),
        };
      }
      return {
        logs: [
          ...state.logs,
          {
            exerciseId,
            completedSets: setIndex + 1,
            totalSets: state.plan.exercises.find((ex) => ex.id === exerciseId)?.sets || 0,
            weights: Array(state.plan.exercises.find((ex) => ex.id === exerciseId)?.sets || 0)
              .fill(null)
              .map((_, idx) => (idx === setIndex ? weight : 0)),
          },
        ],
      };
    }),
  updateExercise: (updated) =>
    set((state) => ({
      plan: {
        ...state.plan,
        exercises: state.plan.exercises.map((ex) => (ex.id === updated.id ? updated : ex)),
      },
    })),
  reset: () => set({ plan: defaultPlan, logs: [] }),
}));
