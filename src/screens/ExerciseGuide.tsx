import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { colors, spacing, radii } from '../theme';
import { fetchExerciseGuide } from '../api/mockApi';
import { ExerciseGuideEntry } from '../types/workout';

const ExerciseGuideScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExerciseGuideEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchExerciseGuide(query).then((data) => {
      setResults(data);
      setLoading(false);
    });
  }, [query]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Exercise Guide</Text>
      <Text style={styles.subheading}>Search or upload to query /api/exercise/guide</Text>

      <TextInput
        style={styles.input}
        placeholder="Search exercises"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      <Pressable style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Upload image</Text>
      </Pressable>

      {loading && <ActivityIndicator color={colors.primary} />}

      {results.map((entry) => (
        <View key={entry.name} style={styles.resultCard}>
          <Text style={styles.resultTitle}>{entry.name}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Muscles</Text>
            <Text style={styles.sectionBody}>{entry.muscles.join(', ')}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Setup</Text>
            <Text style={styles.sectionBody}>{entry.setup}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Execution</Text>
            <Text style={styles.sectionBody}>{entry.execution}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mistakes</Text>
            <Text style={styles.sectionBody}>{entry.mistakes}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Safety</Text>
            <Text style={styles.sectionBody}>{entry.safety}</Text>
          </View>
          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryText}>Add to Workout</Text>
          </Pressable>
        </View>
      ))}
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
