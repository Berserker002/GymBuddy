import { ExerciseGuideEntry, HistoryEntry, Profile, WorkoutPlan } from '../types/workout';

const baseExercises = [
  {
    id: 'bench_press',
    name: 'Bench Press',
    sets: 3,
    reps: '8',
    target_weight: 60,
    actions: { swap: false, edited: false, removed: false },
  },
  {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    sets: 3,
    reps: '10',
    target_weight: 22.5,
    actions: { swap: false, edited: false, removed: false },
  },
  {
    id: 'tricep_pushdown',
    name: 'Tricep Pushdown',
    sets: 3,
    reps: '12',
    target_weight: 30,
    actions: { swap: false, edited: false, removed: false },
  },
];

export async function initProgram(profile: Profile): Promise<WorkoutPlan> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        day: profile.goal === 'Strength' ? 'Upper Power' : 'Push Day',
        goal: profile.goal,
        exercises: baseExercises.map((exercise) => ({
          ...exercise,
          target_weight: profile.lifts?.bench
            ? Math.round(profile.lifts.bench * (exercise.id === 'bench_press' ? 1.05 : 0.6))
            : exercise.target_weight,
        })),
        preferences: {
          preferred_equipment: [profile.equipment],
        },
      });
    }, 350);
  });
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { date: '2024-05-01', lift: 'Bench Press', weight: 60 },
        { date: '2024-05-08', lift: 'Bench Press', weight: 62.5 },
        { date: '2024-05-15', lift: 'Bench Press', weight: 65 },
        { date: '2024-05-22', lift: 'Bench Press', weight: 66 },
      ]);
    }, 250);
  });
}

export async function fetchExerciseGuide(query: string): Promise<ExerciseGuideEntry[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: 'Bench Press',
          muscles: ['Chest', 'Triceps', 'Shoulders'],
          setup: 'Lie flat on the bench with feet planted and shoulders retracted.',
          execution: 'Lower bar to mid-chest and press up with a slight elbow tuck.',
          mistakes: 'Avoid flared elbows and bouncing the bar.',
          safety: 'Use a spotter or safety bars for heavy attempts.',
        },
        {
          name: 'Incline Dumbbell Press',
          muscles: ['Upper Chest', 'Triceps'],
          setup: 'Set bench to 30°-45° incline, feet grounded.',
          execution: 'Press dumbbells upward with wrists stacked over elbows.',
          mistakes: 'Do not let dumbbells drift behind the head.',
          safety: 'Choose weight you can control without arching excessively.',
        },
      ].filter((entry) => entry.name.toLowerCase().includes(query.toLowerCase()) || query === ''));
    }, 200);
  });
}
