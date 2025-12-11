import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme';

interface Props {
  restSeconds: number;
  onComplete: () => void;
}

export const RestTimer: React.FC<Props> = ({ restSeconds, onComplete }) => {
  const [remaining, setRemaining] = useState(restSeconds);

  useEffect(() => {
    setRemaining(restSeconds);
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restSeconds, onComplete]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Rest</Text>
      <Text style={styles.timer}>{remaining}s</Text>
      <Pressable onPress={onComplete}>
        <Text style={styles.skip}>Skip Rest</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: { color: colors.textSecondary },
  timer: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  skip: { color: colors.primary, fontWeight: '700' },
});

export default RestTimer;
