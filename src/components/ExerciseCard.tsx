import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, spacing, radii } from '../theme';
import { ExercisePlan } from '../types/workout';

type ExerciseCardProps = {
  exercise: ExercisePlan;
  onEdit?: () => void;
  onSwap?: () => void;
  onRemove?: () => void;
  footer?: React.ReactNode;
};

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onEdit,
  onSwap,
  onRemove,
  footer,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{exercise.name}</Text>
          <Text style={styles.meta}>
            {exercise.sets} sets × {exercise.reps} reps @ {exercise.target_weight} kg
          </Text>
          {exercise.user_weight && (
            <Text style={styles.meta}>You: {exercise.user_weight} kg</Text>
          )}
        </View>
        <View style={styles.flagRow}>
          {exercise.actions.edited && <Text style={styles.flag}>Edited</Text>}
          {exercise.actions.swap && <Text style={styles.flag}>Swap</Text>}
          {exercise.actions.removed && <Text style={styles.flag}>Removed</Text>}
        </View>
      </View>

      {(onEdit || onSwap || onRemove) && (
        <View style={styles.actions}>
          {onSwap && (
            <Pressable style={[styles.actionButton]} onPress={onSwap}>
              <Text style={styles.actionText}>Swap</Text>
            </Pressable>
          )}
          {onEdit && (
            <Pressable style={[styles.actionButton]} onPress={onEdit}>
              <Text style={styles.actionText}>Edit</Text>
            </Pressable>
          )}
          {onRemove && (
            <Pressable style={[styles.actionButton]} onPress={onRemove}>
              <Text style={styles.actionText}>Remove</Text>
            </Pressable>
          )}
        </View>
      )}

      {footer}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundLight,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  meta: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  flagRow: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  flag: {
    color: colors.primary,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    backgroundColor: colors.muted,
  },
  actionText: {
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
