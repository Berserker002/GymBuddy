import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors, radii, spacing } from '../theme';
import { useAppStore } from '../state/appStore';
import RestTimer from '../components/RestTimer';
import { logWorkout } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'ActiveWorkout'>;

const ActiveWorkoutScreen: React.FC<Props> = ({ navigation }) => {
  const { currentSession, currentDayPlan, logSet } = useAppStore();
  const [resting, setResting] = useState(false);
  const [weightInput, setWeightInput] = useState<string>('');
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const nextExercise = useMemo(() => {
    if (!currentSession || !currentDayPlan) return undefined;
    const logsByExercise: Record<string, number> = {};
    currentSession.exerciseLogs.forEach((log) => {
      if (log.repsCompleted > 0) logsByExercise[log.exerciseId] = (logsByExercise[log.exerciseId] || 0) + 1;
    });
    return currentDayPlan.exercises.find((ex) => (logsByExercise[ex.id] || 0) < ex.suggestedSets);
  }, [currentSession, currentDayPlan]);

  if (!currentSession || !nextExercise) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.heading}>Workout complete?</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('WorkoutSummary')}>
          <Text style={styles.primaryText}>Go to Summary</Text>
        </Pressable>
      </View>
    );
  }

  const setsCompleted = currentSession.exerciseLogs.filter(
    (log) => log.exerciseId === nextExercise.id && log.repsCompleted > 0
  ).length;

  const handleCompleteSet = async () => {
    const reps = nextExercise.suggestedReps;
    const weightToUse = weightInput ? Number(weightInput) : nextExercise.suggestedWeightKg;
    setSyncing(true);
    setError(undefined);
    try {
      if (currentSession.fromBackend) {
        await logWorkout({
          workout_id: currentSession.id,
          exercise_id: nextExercise.id,
          actual_weight: weightToUse ?? null,
          target_weight: nextExercise.suggestedWeightKg ?? null,
          sets: 1,
          reps: `${reps}`,
          completed: true,
        });
      }
      logSet(nextExercise.id, setsCompleted, reps, weightToUse);
      setResting(true);
      setWeightInput('');
    } catch (err: any) {
      setError(err.message || 'Could not log set');
    } finally {
      setSyncing(false);
    }
  };

  const restComplete = () => {
    setResting(false);
    const totalSets = currentSession.exerciseLogs.filter((log) => log.exerciseId === nextExercise.id).length;
    if (setsCompleted + 1 >= totalSets) {
      // advance automatically by triggering rerender
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{nextExercise.name}</Text>
      <Text style={styles.subheading}>
        Set {setsCompleted + 1} of {nextExercise.suggestedSets} · {nextExercise.suggestedReps} reps
      </Text>
      <Text style={styles.helper}>Suggested weight: {nextExercise.suggestedWeightKg ?? '-'} kg</Text>
      <TextInput
        style={styles.input}
        value={weightInput}
        onChangeText={setWeightInput}
        placeholder="Enter weight (optional)"
        keyboardType="numeric"
      />
      <Pressable style={styles.primaryButton} onPress={handleCompleteSet} disabled={resting || syncing}>
        {syncing ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>{resting ? 'Resting' : 'Complete Set'}</Text>
        )}
      </Pressable>
      {resting && <RestTimer restSeconds={nextExercise.restSeconds} onComplete={restComplete} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('WorkoutSummary')}>
        <Text style={styles.secondaryText}>Finish</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md, backgroundColor: colors.backgroundLight },
  center: { justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subheading: { color: colors.textSecondary },
  helper: { color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  error: { color: '#ef4444' },
  secondaryButton: {
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.muted,
  },
  secondaryText: { color: colors.textPrimary, fontWeight: '700' },
});

export default ActiveWorkoutScreen;
