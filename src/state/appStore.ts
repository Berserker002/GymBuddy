import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Exercise,
  ExerciseSetLog,
  StrengthEstimate,
  TrainingProgram,
  TrainingProgramDay,
  UserProfile,
  WorkoutSession,
} from '../types/models';
import { updateProgramWithProgress } from '../utils/progression';

interface AppState {
  userProfile?: UserProfile;
  strengthEstimate?: StrengthEstimate;
  trainingProgram?: TrainingProgram;
  currentSession?: WorkoutSession;
  currentDayPlan?: TrainingProgramDay;
  pastSessions: WorkoutSession[];
  onboardingComplete: boolean;
  setUserProfile: (profile: UserProfile) => void;
  setStrengthEstimate: (estimate: StrengthEstimate) => void;
  setTrainingProgram: (program: TrainingProgram) => void;
  startSession: (dayPlan: TrainingProgramDay, workoutId?: string, fromBackend?: boolean) => void;
  logSet: (exerciseId: string, setIndex: number, repsCompleted: number, weightKg?: number) => void;
  finishSession: () => void;
  markOnboardingComplete: () => void;
  applyProgression: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userProfile: undefined,
      strengthEstimate: undefined,
      trainingProgram: undefined,
      currentSession: undefined,
      pastSessions: [],
      onboardingComplete: false,
      setUserProfile: (profile) => set({ userProfile: profile }),
      setStrengthEstimate: (estimate) => set({ strengthEstimate: estimate }),
      setTrainingProgram: (program) => set({ trainingProgram: program }),
      startSession: (dayPlan, workoutId, fromBackend) => {
        const now = new Date().toISOString();
        const session: WorkoutSession = {
          id: workoutId || `local-${Date.now()}`,
          date: now,
          dayLabel: dayPlan.label,
          fromBackend,
          exerciseLogs: dayPlan.exercises.flatMap((exercise) =>
            Array.from({ length: exercise.suggestedSets }).map((_, idx) => ({
              exerciseId: exercise.id,
              setIndex: idx,
              repsCompleted: 0,
              weightKg: exercise.suggestedWeightKg,
              timestamp: now,
            }))
          ),
          startedAt: now,
          finishedAt: now,
        };
        set({ currentSession: session, currentDayPlan: dayPlan });
      },
      logSet: (exerciseId, setIndex, repsCompleted, weightKg) => {
        set((state) => {
          if (!state.currentSession) return {} as AppState;
          const exerciseLogs = state.currentSession.exerciseLogs.map((log) =>
            log.exerciseId === exerciseId && log.setIndex === setIndex
              ? { ...log, repsCompleted, weightKg, timestamp: new Date().toISOString() }
              : log
          );
          return { currentSession: { ...state.currentSession, exerciseLogs } };
        });
      },
      finishSession: () => {
        const { currentSession, pastSessions, trainingProgram } = get();
        if (!currentSession) return;
        const finishedAt = new Date().toISOString();
        const completedSession: WorkoutSession = { ...currentSession, finishedAt };
        const updatedSessions = [...pastSessions, completedSession];
        set({ pastSessions: updatedSessions, currentSession: undefined, currentDayPlan: undefined });
        if (trainingProgram) {
          const progressed = updateProgramWithProgress(trainingProgram, updatedSessions);
          set({ trainingProgram: progressed });
        }
      },
      markOnboardingComplete: () => set({ onboardingComplete: true }),
      applyProgression: () => {
        const { trainingProgram, pastSessions } = get();
        if (!trainingProgram) return;
        const progressed = updateProgramWithProgress(trainingProgram, pastSessions);
        set({ trainingProgram: progressed });
      },
    }),
    {
      name: 'gymbuddy-app',
      storage: {
        getItem: async (name) => AsyncStorage.getItem(name),
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, value);
        },
        removeItem: async (name) => AsyncStorage.removeItem(name),
      },
      partialize: (state) => ({
        userProfile: state.userProfile,
        strengthEstimate: state.strengthEstimate,
        trainingProgram: state.trainingProgram,
        pastSessions: state.pastSessions,
        onboardingComplete: state.onboardingComplete,
      }),
    }
  )
);
