import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { colors, spacing, radii } from '../theme';
import { fetchHistory } from '../api/mockApi';
import { HistoryEntry } from '../types/workout';

const HistoryScreen: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory().then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Progress History</Text>
      <Text style={styles.subheading}>Charts and session list from /api/history</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bench Press Trend</Text>
        <Text style={styles.placeholder}>[Line chart placeholder]</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} />
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
});

export default HistoryScreen;
