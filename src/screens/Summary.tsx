import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWorkoutStore } from '../state/useWorkoutStore';
import { colors, spacing, radii } from '../theme';
import { RootStackParamList } from '../../App';

const SummaryScreen: React.FC<NativeStackScreenProps<RootStackParamList, 'Summary'>> = ({ navigation }) => {
  const { plan, logs, reset } = useWorkoutStore();

  const handleSave = () => {
    reset();
    navigation.navigate('Dashboard');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Workout Summary</Text>
      <Text style={styles.motivation}>"Nice work! You outpaced last week on pressing volume."</Text>

      {plan.exercises.map((exercise) => {
        const log = logs.find((l) => l.exerciseId === exercise.id);
        return (
          <View key={exercise.id} style={styles.card}>
            <Text style={styles.exercise}>{exercise.name}</Text>
            <Text style={styles.meta}>Target: {exercise.sets}×{exercise.reps} @ {exercise.target_weight} kg</Text>
            {log ? (
              <Text style={styles.progress}>Completed {log.completedSets}/{log.totalSets} sets</Text>
            ) : (
              <Text style={styles.progress}>Not logged yet</Text>
            )}
          </View>
        );
      })}

      <Pressable style={styles.primaryButton} onPress={handleSave}>
        <Text style={styles.primaryText}>Save Workout</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, gap: spacing.md },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  motivation: {
    color: colors.textSecondary,
    backgroundColor: '#EEF2FF',
    padding: spacing.md,
    borderRadius: radii.md,
  },
  card: {
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: radii.md,
  },
  exercise: {
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  meta: { color: colors.textSecondary },
  progress: { marginTop: spacing.xs, color: colors.primary, fontWeight: '700' },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
});

export default SummaryScreen;
