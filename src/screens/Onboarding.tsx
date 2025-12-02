import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radii } from '../theme';
import { RootStackParamList } from '../../App';

const steps = [
  { title: 'Goal', options: ['Strength', 'Hypertrophy', 'Fat Loss'] },
  { title: 'Experience', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { title: 'Equipment', options: ['Full Gym', 'Home', 'Minimal'] },
  { title: 'Optional Lifts', options: ['Bench', 'Squat', 'Deadlift', 'OHP'] },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      navigation.replace('Dashboard');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personalize your plan</Text>
      <Text style={styles.subheading}>Step {activeStep + 1} of {steps.length}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{steps[activeStep].title}</Text>
        <View style={styles.optionGrid}>
          {steps[activeStep].options.map((option) => (
            <Pressable key={option} style={styles.option}>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Pressable style={styles.primaryButton} onPress={handleNext}>
        <Text style={styles.primaryText}>
          {activeStep === steps.length - 1 ? 'Generate My Program' : 'Next'}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.backgroundLight,
    gap: spacing.lg,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subheading: {
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    padding: spacing.lg,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  option: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
  },
  optionText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: 'auto',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default OnboardingScreen;
