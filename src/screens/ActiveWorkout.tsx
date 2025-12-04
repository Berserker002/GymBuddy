import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWorkoutStore } from '../state/useWorkoutStore';
import { colors, spacing, radii } from '../theme';
import { ExerciseCard } from '../components/ExerciseCard';
import { RootStackParamList } from '../../App';

const ActiveWorkoutScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'ActiveWorkout'>> = ({ navigation }) => {
  const { plan, logs, toggleSetCompletion, planError, completeWorkout, finishing } = useWorkoutStore();

  const totalSets = plan.exercises.filter((ex) => !ex.actions.removed).reduce((sum, ex) => sum + ex.sets, 0);
  const completedSets = logs.reduce((sum, log) => sum + log.completedSets, 0);
  const progress = totalSets ? Math.floor((completedSets / totalSets) * 100) : 0;

  const handleFinish = async () => {
    await completeWorkout();
    navigation.navigate('Summary');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Active Workout</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{completedSets}/{totalSets} sets logged</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {planError ? (
          <Text style={styles.error}>{planError}</Text>
        ) : (
          plan.exercises
            .filter((ex) => !ex.actions.removed)
            .map((exercise) => {
              const footer = (
                <View style={styles.setRow}>
                  {Array.from({ length: exercise.sets }).map((_, idx) => {
                    const log = logs.find((entry) => entry.exerciseId === exercise.id);
                    const isComplete = log?.weights[idx] !== null && log?.weights[idx] !== undefined;
                    return (
                      <Pressable
                        key={idx}
                        style={[styles.setChip, isComplete && styles.setChipComplete]}
                        onPress={() => toggleSetCompletion(exercise.id, idx, exercise.target_weight)}
                      >
                        <Text style={[styles.setText, isComplete && styles.setTextComplete]}>Set {idx + 1}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              );

              return <ExerciseCard key={exercise.id} exercise={exercise} footer={footer} />;
            })
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryText}>Next Exercise</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={handleFinish} disabled={finishing}>
          {finishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Finish Workout</Text>}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  header: {
    padding: spacing.lg,
    backgroundColor: '#EFF6FF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressBar: {
    marginTop: spacing.md,
    width: '100%',
    height: 10,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  progressText: {
    marginTop: spacing.sm,
    color: colors.textSecondary,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  setRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  setChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.muted,
    borderRadius: radii.sm,
  },
  setChipComplete: {
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  setText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  setTextComplete: {
    color: '#065F46',
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.muted,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  secondaryText: { color: colors.textPrimary, fontWeight: '700' },
  error: {
    color: '#ef4444',
  },
});

export default ActiveWorkoutScreen;
