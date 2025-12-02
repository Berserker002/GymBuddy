import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { colors, spacing, radii } from '../theme';

type GuideSection = {
  title: string;
  content: string;
};

const guide: GuideSection[] = [
  { title: 'Muscles', content: 'Pectorals, Triceps, Shoulders' },
  { title: 'Setup', content: 'Lie on bench, grip slightly wider than shoulders.' },
  { title: 'Execution', content: 'Control the bar down, press explosively up.' },
  { title: 'Mistakes', content: 'Flaring elbows, bouncing the bar, partial reps.' },
  { title: 'Safety', content: 'Use spotter, avoid over-arching lower back.' },
];

const ExerciseGuideScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Exercise Guide</Text>
      <Text style={styles.subheading}>Search or upload to query /api/exercise/guide</Text>

      <TextInput style={styles.input} placeholder="Search exercises" />
      <Pressable style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Upload image</Text>
      </Pressable>

      <View style={styles.resultCard}>
        <Text style={styles.resultTitle}>Bench Press</Text>
        {guide.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionBody}>{section.content}</Text>
          </View>
        ))}
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryText}>Add to Workout</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, gap: spacing.md },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subheading: { color: colors.textSecondary },
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    padding: spacing.md,
    borderRadius: radii.md,
  },
  resultCard: {
    backgroundColor: '#F8FAFC',
    padding: spacing.lg,
    borderRadius: radii.lg,
    gap: spacing.sm,
  },
  resultTitle: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  section: { gap: spacing.xs },
  sectionTitle: { fontWeight: '700', color: colors.textPrimary },
  sectionBody: { color: colors.textSecondary },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    backgroundColor: colors.muted,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  secondaryText: { color: colors.textPrimary, fontWeight: '700' },
});

export default ExerciseGuideScreen;
