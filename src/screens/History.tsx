import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, Pressable } from 'react-native';
import { colors, spacing, radii } from '../theme';
import { apiClient } from '../api/client';
import { HistoryEntry } from '../types/workout';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [exerciseId, setExerciseId] = useState('bench_press');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.getHistory(exerciseId);
        const entries = response[exerciseId] || [];
        setHistory(entries.map((entry) => ({ date: entry.date, lift: exerciseId, weight: entry.weight })));
      } catch (err: any) {
        setError(err.message || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [exerciseId]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Progress History</Text>
      <Text style={styles.subheading}>Charts and session list from /api/history</Text>

      <TextInput
        value={exerciseId}
        onChangeText={setExerciseId}
        style={styles.input}
        autoCapitalize="none"
        placeholder="exercise_id (e.g. bench_press)"
      />
      <Pressable style={styles.secondaryButton} onPress={() => setExerciseId((prev) => prev.trim())}>
        <Text style={styles.secondaryText}>Load History</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bench Press Trend</Text>
        <Text style={styles.placeholder}>[Line chart placeholder]</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <View style={styles.table}>
          {history.map((entry) => (
            <View key={`${entry.date}-${entry.weight}`} style={styles.row}>
              <Text style={styles.cell}>{entry.date}</Text>
              <Text style={styles.cell}>{entry.lift}</Text>
              <Text style={styles.cell}>{entry.weight} kg</Text>
            </View>
          ))}
        </View>
      )}
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
  card: {
    backgroundColor: '#F8FAFC',
    padding: spacing.md,
    borderRadius: radii.md,
  },
  cardTitle: { fontWeight: '700', color: colors.textPrimary, marginBottom: spacing.sm },
  placeholder: { color: colors.textSecondary },
  table: {
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: radii.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
  },
  cell: { color: colors.textPrimary, flex: 1 },
  error: { color: '#ef4444', fontWeight: '600', marginTop: spacing.sm },
  secondaryButton: {
    backgroundColor: colors.muted,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  secondaryText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});

export default HistoryScreen;
