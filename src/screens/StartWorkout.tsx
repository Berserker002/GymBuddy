import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors, radii, spacing } from '../theme';
import { useAppStore } from '../state/appStore';
import { getTodaysWorkout } from '../api/client';
import { Exercise, TrainingProgramDay } from '../types/models';

type Props = NativeStackScreenProps<RootStackParamList, 'StartWorkout'>;

const StartWorkoutScreen: React.FC<Props> = ({ navigation }) => {
  const { trainingProgram, applyProgression, startSession } = useAppStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();
  const [remotePlan, setRemotePlan] = useState<TrainingProgramDay | undefined>();
  const [workoutId, setWorkoutId] = useState<string | undefined>();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(undefined);
      try {
        const response = await getTodaysWorkout();
        const exercises: Exercise[] = response.exercises.map((exercise: any, idx: number) => ({
          id: exercise.id || `exercise-${idx}`,
          name: exercise.name || `Exercise ${idx + 1}`,
          equipment: exercise.equipment || 'any',
          suggestedWeightKg: exercise.target_weight ?? exercise.suggestedWeightKg,
          suggestedReps: exercise.reps ?? exercise.suggestedReps ?? 10,
          suggestedSets: exercise.sets ?? exercise.suggestedSets ?? 3,
          restSeconds: exercise.rest_seconds ?? exercise.restSeconds ?? 90,
        }));

        setRemotePlan({
          dayIndex: Number(response.day) || 1,
          label: response.day_label || 'Today',
          exercises,
        });
        setWorkoutId(response.workout_id);
      } catch (err: any) {
        setError(err.message || 'Unable to load today’s workout');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const fallbackPlan = useMemo(() => {
    if (!trainingProgram) return undefined;
    const index = new Date().getDay() % trainingProgram.days.length;
    return trainingProgram.days[index];
  }, [trainingProgram]);

  const todayPlan = remotePlan || fallbackPlan;

  if (!todayPlan) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.heading}>{loading ? 'Loading plan…' : 'No program found'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading && <ActivityIndicator color={colors.primary} />}
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace('Onboarding')}>
          <Text style={styles.primaryText}>Start Onboarding</Text>
        </Pressable>
      </View>
    );
  }

  const handleStart = () => {
    applyProgression();
    startSession(todayPlan, workoutId, Boolean(remotePlan));
    navigation.navigate('ActiveWorkout');
  };

  return (
    <View style={styles.container}>
      {loading && !remotePlan ? (
        <View style={[styles.center, { marginVertical: spacing.md }]}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : null}
      <Text style={styles.heading}>{todayPlan.label}</Text>
      <Text style={styles.subheading}>You’ll train {todayPlan.exercises.length} movements today.</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.list}>
        {todayPlan.exercises.map((exercise) => (
          <View key={exercise.id} style={styles.row}>
            <View>
              <Text style={styles.exercise}>{exercise.name}</Text>
              <Text style={styles.meta}>
                {exercise.suggestedSets} x {exercise.suggestedReps} reps · {exercise.suggestedWeightKg ?? '-'} kg
              </Text>
            </View>
            <Text style={styles.rest}>{exercise.restSeconds}s</Text>
          </View>
        ))}
      </View>
      <Pressable style={styles.primaryButton} onPress={handleStart}>
        <Text style={styles.primaryText}>Start Today’s Workout</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.backgroundLight, gap: spacing.lg },
  center: { justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subheading: { color: colors.textSecondary },
  list: { gap: spacing.md },
  row: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: radii.md,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exercise: { fontWeight: '700', color: colors.textPrimary },
  meta: { color: colors.textSecondary },
  rest: { color: colors.primary, fontWeight: '700' },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  error: { color: '#ef4444' },
});

export default StartWorkoutScreen;
