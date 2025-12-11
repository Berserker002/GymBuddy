import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors, radii, spacing } from '../theme';
import { useAppStore } from '../state/appStore';
import { finishWorkout } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'WorkoutSummary'>;

const WorkoutSummaryScreen: React.FC<Props> = ({ navigation }) => {
  const { currentSession, pastSessions, finishSession } = useAppStore();
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const session = currentSession || pastSessions[pastSessions.length - 1];

  const totals = useMemo(() => {
    if (!session) return { sets: 0, reps: 0, volume: 0 };
    const sets = session.exerciseLogs.filter((log) => log.repsCompleted > 0).length;
    const reps = session.exerciseLogs.reduce((sum, log) => sum + log.repsCompleted, 0);
    const volume = session.exerciseLogs.reduce(
      (sum, log) => sum + (log.weightKg || 0) * log.repsCompleted,
      0
    );
    return { sets, reps, volume };
  }, [session]);

  if (!session) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.heading}>No session</Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace('StartWorkout')}>
          <Text style={styles.primaryText}>Start Workout</Text>
        </Pressable>
      </View>
    );
  }

  const handleDone = async () => {
    if (session?.fromBackend) {
      setSyncing(true);
      setError(undefined);
      try {
        await finishWorkout(session.id);
      } catch (err: any) {
        setError(err.message || 'Could not sync workout');
      } finally {
        setSyncing(false);
      }
    }

    finishSession();
    navigation.replace('StartWorkout');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Workout Summary</Text>
      <Text style={styles.subheading}>{session.dayLabel}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total Sets</Text>
        <Text style={styles.value}>{totals.sets}</Text>
        <Text style={styles.label}>Total Reps</Text>
        <Text style={styles.value}>{totals.reps}</Text>
        <Text style={styles.label}>Total Volume</Text>
        <Text style={styles.value}>{Math.round(totals.volume)} kg</Text>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.primaryButton} onPress={handleDone} disabled={syncing}>
        {syncing ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Done</Text>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, gap: spacing.md, backgroundColor: colors.backgroundLight },
  center: { justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subheading: { color: colors.textSecondary },
  card: {
    padding: spacing.lg,
    borderRadius: radii.md,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.muted,
    gap: spacing.xs,
  },
  label: { color: colors.textSecondary },
  value: { fontWeight: '700', color: colors.textPrimary, fontSize: 18 },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  error: { color: '#ef4444' },
});

export default WorkoutSummaryScreen;
