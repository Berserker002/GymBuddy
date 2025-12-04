import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { colors, spacing, radii } from '../theme';
import { apiClient, ExerciseGuideResponse } from '../api/client';

const ExerciseGuideScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExerciseGuideResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.getExerciseGuide({ exercise_name: query || undefined, image_url: null });
      setResults([response]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch exercise guide');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    runSearch();
  }, []);

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
      <Pressable style={styles.secondaryButton} onPress={runSearch} disabled={loading}>
        {loading ? <ActivityIndicator color={colors.textPrimary} /> : <Text style={styles.secondaryText}>Search</Text>}
      </Pressable>

      {loading && <ActivityIndicator color={colors.primary} />}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {results.map((entry, idx) => (
        <View key={`${entry.metadata?.source || 'guide'}-${idx}`} style={styles.resultCard}>
          <Text style={styles.resultTitle}>{(query || 'Exercise').replace(/_/g, ' ')}</Text>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Muscles</Text>
            <Text style={styles.sectionBody}>{entry.muscles.join(', ')}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Steps</Text>
            {entry.steps.map((step, stepIdx) => (
              <Text key={stepIdx} style={styles.sectionBody}>• {step}</Text>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mistakes</Text>
            <Text style={styles.sectionBody}>{entry.mistakes.join(', ')}</Text>
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
  error: {
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default ExerciseGuideScreen;
