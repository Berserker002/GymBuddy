import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWorkoutStore } from '../state/useWorkoutStore';
import { colors, spacing, radii } from '../theme';
import { ExerciseCard } from '../components/ExerciseCard';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'EditableWorkout'>;

const EditableWorkoutScreen: React.FC<Props> = ({ navigation }) => {
  const { plan, updateExercise, persistChanges, savingChanges, planError } = useWorkoutStore();

  const handleRemove = (id: string) => {
    const target = plan.exercises.find((ex) => ex.id === id);
    if (!target) return;
    updateExercise({ ...target, actions: { ...target.actions, removed: true } });
  };

  const handleSwap = (id: string) => {
    Alert.alert('Swap', 'This would hit /api/exercise/swap in the real app.');
    const target = plan.exercises.find((ex) => ex.id === id);
    if (!target) return;
    updateExercise({ ...target, actions: { ...target.actions, swap: true } });
  };

  const handleEdit = (id: string) => {
    const target = plan.exercises.find((ex) => ex.id === id);
    if (!target) return;
    updateExercise({ ...target, sets: target.sets + 1, actions: { ...target.actions, edited: true } });
  };

  const handleSave = async () => {
    await persistChanges();
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Edit your workout</Text>
      <Text style={styles.subheading}>{plan.day} · {plan.goal}</Text>

      {plan.exercises.map((exercise) => (
        <ExerciseCard
          key={exercise.id}
          exercise={exercise}
          onEdit={() => handleEdit(exercise.id)}
          onSwap={() => handleSwap(exercise.id)}
          onRemove={() => handleRemove(exercise.id)}
        />
      ))}

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={handleSave} disabled={savingChanges}>
          {savingChanges ? (
            <ActivityIndicator color={colors.textPrimary} />
          ) : (
            <Text style={styles.secondaryText}>Save My Changes</Text>
          )}
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('ActiveWorkout')}>
          <Text style={styles.primaryText}>Start Workout</Text>
        </Pressable>
      </View>
      {planError ? <Text style={styles.error}>{planError}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subheading: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.muted,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  error: {
    color: '#ef4444',
    marginTop: spacing.sm,
    fontWeight: '600',
  },
});

export default EditableWorkoutScreen;
