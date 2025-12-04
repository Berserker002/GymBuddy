import create from 'zustand';
import { apiClient } from '../api/client';
import { ExercisePlan, FinishSummary, Profile, WorkoutLog, WorkoutPlan } from '../types/workout';

type WorkoutState = {
  profile: Profile;
  plan: WorkoutPlan;
  workoutId?: string;
  programId?: string;
  logs: WorkoutLog[];
  loadingPlan: boolean;
  savingChanges: boolean;
  finishing: boolean;
  planError?: string;
  summary?: FinishSummary | null;
  toggleSetCompletion: (exerciseId: string, setIndex: number, weight: number) => void;
  updateExercise: (updated: ExercisePlan) => void;
  setProfile: (profile: Profile) => void;
  loadPlan: (profile?: Profile) => Promise<void>;
  fetchTodayWorkout: () => Promise<void>;
  persistChanges: () => Promise<void>;
  completeWorkout: () => Promise<void>;
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
  workoutId: undefined,
  programId: undefined,
  logs: [],
  loadingPlan: false,
  savingChanges: false,
  finishing: false,
  summary: null,
  toggleSetCompletion: (exerciseId, setIndex, weight) => {
    const { workoutId, plan } = get();
    const exercise = plan.exercises.find((ex) => ex.id === exerciseId);
    if (!exercise) return;

    set((state) => {
      const existingLog = state.logs.find((log) => log.exerciseId === exerciseId);
      const weights = existingLog?.weights ? [...existingLog.weights] : Array(exercise.sets).fill(null);

      const isCompleted = weights[setIndex] !== null;
      weights[setIndex] = isCompleted ? null : weight;
      const completedSets = weights.filter((entry) => entry !== null).length;

      const newLog: WorkoutLog = {
        exerciseId,
        completedSets,
        totalSets: exercise.sets,
        weights,
      };

      const updatedLogs = existingLog
        ? state.logs.map((log) => (log.exerciseId === exerciseId ? newLog : log))
        : [...state.logs, newLog];

      return { logs: updatedLogs };
    });

    if (!workoutId) return;

    const updatedLog = get().logs.find((log) => log.exerciseId === exerciseId);
    const completed = (updatedLog?.weights || []).filter((value) => value !== null).length === exercise.sets;
    const repsString = Array.from({ length: exercise.sets })
      .map(() => exercise.reps)
      .join(',');

    apiClient
      .logWorkout({
        workout_id: workoutId,
        exercise_id: exerciseId,
        actual_weight: weight,
        target_weight: exercise.target_weight,
        sets: exercise.sets,
        reps: repsString,
        completed,
      })
      .catch((error) => set({ planError: error.message || 'Failed to log set' }));
  },
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
    set({ loadingPlan: true, profile, planError: undefined });
    try {
      const payload = {
        goal: profile.goal
          .toLowerCase()
          .replace(/\s+/g, '_') as 'hypertrophy' | 'strength' | 'fat_loss',
        experience: profile.experience.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
        equipment: [profile.equipment.toLowerCase()],
        lifts: profile.lifts,
      };
      const program = await apiClient.initializeProgram(payload);
      set({ programId: program.id });
      await get().fetchTodayWorkout();
    } catch (error: any) {
      set({ planError: error.message || 'Failed to generate program' });
    } finally {
      set({ loadingPlan: false });
    }
  },
  fetchTodayWorkout: async () => {
    set({ loadingPlan: true, planError: undefined, summary: null });
    try {
      const today = await apiClient.getTodaysWorkout();
      const profile = get().profile;
      const mapExercise = (exercise: ExercisePlan): ExercisePlan => ({
        ...exercise,
        name: exercise.name || exercise.id.replace(/_/g, ' '),
        actions: exercise.actions || { edited: false, removed: false, swap: false },
      });

      const plan: WorkoutPlan = {
        day: today.day,
        goal: profile.goal,
        exercises: today.exercises.map((exercise) =>
          mapExercise({
            ...exercise,
            actions: { edited: false, removed: false, swap: false },
          })
        ),
      };

      set({ plan, workoutId: today.workout_id, logs: [] });
    } catch (error: any) {
      set({ planError: error.message || 'Failed to load today\'s workout' });
    } finally {
      set({ loadingPlan: false });
    }
  },
  persistChanges: async () => {
    const { plan } = get();
    const changes = plan.exercises
      .filter((exercise) => exercise.actions.swap)
      .map((exercise) => ({
        exercise_id: exercise.id,
        action: 'swap' as const,
        new_exercise: `${exercise.id}_variation`,
      }));

    if (!changes.length) return;

    set({ savingChanges: true, planError: undefined });
    try {
      await apiClient.updateWorkout({ day: plan.day, changes });
      set({
        plan: {
          ...plan,
          exercises: plan.exercises.map((exercise) => ({
            ...exercise,
            actions: { ...exercise.actions, swap: false, edited: false, removed: false },
          })),
        },
      });
    } catch (error: any) {
      set({ planError: error.message || 'Failed to save changes' });
    } finally {
      set({ savingChanges: false });
    }
  },
  completeWorkout: async () => {
    const workoutId = get().workoutId;
    if (!workoutId) return;

    set({ finishing: true, planError: undefined });
    try {
      const result = await apiClient.finishWorkout(workoutId);
      set({ summary: { message: result.message, progress: result.progress } });
    } catch (error: any) {
      set({ planError: error.message || 'Failed to finish workout' });
    } finally {
      set({ finishing: false });
    }
  },
  reset: () =>
    set({
      plan: defaultPlan,
      logs: [],
      profile: defaultProfile,
      loadingPlan: false,
      savingChanges: false,
      planError: undefined,
      workoutId: undefined,
      programId: undefined,
      finishing: false,
      summary: null,
    }),
}));
