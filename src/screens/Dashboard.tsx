import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWorkoutStore } from '../state/useWorkoutStore';
import { colors, spacing, radii } from '../theme';
import { ExerciseCard } from '../components/ExerciseCard';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { plan } = useWorkoutStore();
  const nextLift = plan.exercises[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Welcome back!</Text>
      <Text style={styles.dayLabel}>{plan.day} · {plan.goal}</Text>

      <View style={styles.focusCard}>
        <Text style={styles.focusLabel}>Today&apos;s Focus</Text>
        <Text style={styles.focusTitle}>{plan.day}</Text>
        <Text style={styles.focusSubtitle}>Dialed for {plan.goal}</Text>
      </View>

      <View style={styles.snippet}>
        <Text style={styles.snippetLabel}>Next target lift</Text>
        <Text style={styles.snippetTitle}>{nextLift.name}</Text>
        <Text style={styles.snippetMeta}>{nextLift.sets}×{nextLift.reps} @ {nextLift.target_weight} kg</Text>
      </View>

      <ExerciseCard exercise={nextLift} />

      <View style={styles.buttonRow}>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('EditableWorkout')}>
          <Text style={styles.secondaryText}>Edit Workout</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('ActiveWorkout')}>
          <Text style={styles.primaryText}>Start Workout</Text>
        </Pressable>
      </View>

      <View style={styles.linkRow}>
        <Pressable onPress={() => navigation.navigate('History')}><Text style={styles.link}>History</Text></Pressable>
        <Pressable onPress={() => navigation.navigate('ExerciseGuide')}><Text style={styles.link}>Exercise Guide</Text></Pressable>
      </View>
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
    gap: spacing.lg,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayLabel: {
    color: colors.textSecondary,
  },
  focusCard: {
    backgroundColor: '#EEF2FF',
    padding: spacing.lg,
    borderRadius: radii.lg,
  },
  focusLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  focusTitle: {
    marginTop: spacing.sm,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  focusSubtitle: {
    color: colors.textSecondary,
  },
  snippet: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: '#F8FAFC',
  },
  snippetLabel: {
    color: colors.textSecondary,
  },
  snippetTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  snippetMeta: {
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
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
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
});

export default DashboardScreen;
