import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radii } from '../theme';
import { RootStackParamList } from '../../App';
import { Goal, Equipment, Experience, Profile } from '../types/workout';
import { useWorkoutStore } from '../state/useWorkoutStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type Step =
  | { key: 'goal'; title: string; options: Goal[] }
  | { key: 'experience'; title: string; options: Experience[] }
  | { key: 'equipment'; title: string; options: Equipment[] }
  | { key: 'lifts'; title: string };

const steps: Step[] = [
  { key: 'goal', title: 'Goal', options: ['Strength', 'Hypertrophy', 'Fat Loss'] },
  { key: 'experience', title: 'Experience', options: ['Beginner', 'Intermediate', 'Advanced'] },
  { key: 'equipment', title: 'Equipment', options: ['Full Gym', 'Home', 'Minimal'] },
  { key: 'lifts', title: 'Optional Lifts' },
];

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { setProfile, loadPlan, loadingPlan } = useWorkoutStore();
  const [activeStep, setActiveStep] = useState(0);
  const [goal, setGoal] = useState<Goal>('Hypertrophy');
  const [experience, setExperience] = useState<Experience>('Intermediate');
  const [equipment, setEquipment] = useState<Equipment>('Full Gym');
  const [lifts, setLifts] = useState({ bench: '60', squat: '', deadlift: '', ohp: '' });

  const currentStep = steps[activeStep];

  const canContinue = useMemo(() => {
    if (currentStep.key === 'goal') return Boolean(goal);
    if (currentStep.key === 'experience') return Boolean(experience);
    if (currentStep.key === 'equipment') return Boolean(equipment);
    return true;
  }, [currentStep.key, goal, experience, equipment]);

  const handleNext = async () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
      return;
    }

    const parsedLifts = Object.fromEntries(
      Object.entries(lifts)
        .filter(([, value]) => value !== '')
        .map(([key, value]) => [key, Number(value)])
    );

    const profile: Profile = {
      goal,
      experience,
      equipment,
      lifts: parsedLifts,
    };

    setProfile(profile);
    await loadPlan(profile);
    navigation.replace('Dashboard');
  };

  const renderOptions = () => {
    if (currentStep.key === 'lifts') {
      return (
        <View style={styles.inputStack}>
          <Text style={styles.helper}>Optional: add your current bests to personalize targets.</Text>
          {Object.keys(lifts).map((liftKey) => (
            <View key={liftKey} style={styles.inputRow}>
              <Text style={styles.inputLabel}>{liftKey.toUpperCase()}</Text>
              <TextInput
                style={styles.input}
                placeholder="kg"
                keyboardType="numeric"
                value={(lifts as any)[liftKey]}
                onChangeText={(text) => setLifts((prev) => ({ ...prev, [liftKey]: text }))}
              />
            </View>
          ))}
        </View>
      );
    }

    const options = currentStep.options;
    return (
      <View style={styles.optionGrid}>
        {options.map((option) => (
          <Pressable
            key={option}
            style={[styles.option, option === (currentStep.key === 'goal' ? goal : currentStep.key === 'experience' ? experience : equipment) ? styles.optionSelected : null]}
            onPress={() => {
              if (currentStep.key === 'goal') setGoal(option as Goal);
              if (currentStep.key === 'experience') setExperience(option as Experience);
              if (currentStep.key === 'equipment') setEquipment(option as Equipment);
            }}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Personalize your plan</Text>
      <Text style={styles.subheading}>Step {activeStep + 1} of {steps.length}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{currentStep.title}</Text>
        {renderOptions()}
      </View>

      <Pressable style={[styles.primaryButton, !canContinue && styles.disabled]} onPress={handleNext} disabled={!canContinue || loadingPlan}>
        {loadingPlan ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryText}>
            {activeStep === steps.length - 1 ? 'Generate My Program' : 'Next'}
          </Text>
        )}
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
    gap: spacing.sm,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
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
  optionSelected: {
    backgroundColor: colors.primary,
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
  disabled: {
    opacity: 0.6,
  },
  inputStack: {
    gap: spacing.sm,
  },
  helper: {
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputLabel: {
    width: 60,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.muted,
    borderRadius: radii.md,
    padding: spacing.sm,
  },
});

export default OnboardingScreen;
