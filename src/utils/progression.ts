import { TrainingProgram, WorkoutSession } from '../types/models';

export function updateProgramWithProgress(
  program: TrainingProgram,
  sessions: WorkoutSession[]
): TrainingProgram {
  const recentSessions = sessions.slice(-3);
  const adjustments: Record<string, number> = {};

  recentSessions.forEach((session) => {
    session.exerciseLogs.forEach((log) => {
      const key = `${log.exerciseId}`;
      adjustments[key] = (adjustments[key] || 0) + (log.weightKg || 0);
    });
  });

  const updatedDays = program.days.map((day) => ({
    ...day,
    exercises: day.exercises.map((exercise) => {
      const totalWeight = adjustments[exercise.id];
      if (!totalWeight || !exercise.suggestedWeightKg) return exercise;
      const bump = exercise.suggestedWeightKg >= 60 ? 5 : 2.5;
      return { ...exercise, suggestedWeightKg: exercise.suggestedWeightKg + bump };
    }),
  }));

  return { ...program, days: updatedDays };
}
