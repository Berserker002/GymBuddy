import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { colors, radii, spacing } from '../theme';
import { useAppStore } from '../state/appStore';
import { EquipmentType, StrengthEstimate, UserProfile } from '../types/models';
import { initializeProgramFromBackend } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

type StepKey =
  | 'welcome'
  | 'equipment'
  | 'basic'
  | 'strength'
  | 'goal'
  | 'frequency'
  | 'preview'
  | 'ready';

const weightChips = [20, 30, 40, 50, 60, 70, 80];

interface StrengthFieldProps {
  fieldKey: keyof StrengthEstimate;
  label: string;
  value?: number;
  onSelect: (value?: number) => void;
}

const StrengthField: React.FC<StrengthFieldProps> = ({ fieldKey, label, value, onSelect }) => {
  const [customVisible, setCustomVisible] = useState(false);

  return (
    <View key={fieldKey} style={styles.strengthField}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {weightChips.map((chip) => (
          <Pressable
            key={chip}
            style={[styles.chip, value === chip && styles.chipSelected]}
            onPress={() => {
              onSelect(chip);
              setCustomVisible(false);
            }}
          >
            <Text style={[styles.chipText, value === chip && styles.chipTextSelected]}>{chip}</Text>
          </Pressable>
        ))}
        <Pressable style={[styles.chip, customVisible && styles.chipSelected]} onPress={() => setCustomVisible(true)}>
          <Text style={[styles.chipText, customVisible && styles.chipTextSelected]}>Custom</Text>
        </Pressable>
      </View>
      {customVisible && (
        <TextInput
          style={styles.input}
          placeholder="Enter value"
          keyboardType="numeric"
          value={value ? String(value) : ''}
          onChangeText={(text) => onSelect(text ? Number(text) : undefined)}
        />
      )}
    </View>
  );
};

const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const {
    setUserProfile,
    setStrengthEstimate,
    setTrainingProgram,
    markOnboardingComplete,
  } = useAppStore();

  const [step, setStep] = useState<StepKey>('welcome');
  const [equipment, setEquipment] = useState<EquipmentType | undefined>();
  const [gender, setGender] = useState<UserProfile['gender']>('male');
  const [age, setAge] = useState('25');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('');
  const [goal, setGoal] = useState<UserProfile['goal']>('muscle');
  const [trainingDays, setTrainingDays] = useState<number | undefined>();
  const [strength, setStrength] = useState<StrengthEstimate>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const equipmentStrengthFields = useMemo(() => {
    if (equipment === 'full_gym') return ['benchPressKg', 'squatKg', 'deadliftKg', 'latPulldownKg'] as const;
    if (equipment === 'dumbbells') return ['dumbbellPressKg', 'dumbbellRowKg', 'gobletSquatKg'] as const;
    return ['maxPushups', 'maxPullups', 'plankSeconds'] as const;
  }, [equipment]);

  const canContinue = useMemo(() => {
    switch (step) {
      case 'equipment':
        return Boolean(equipment);
      case 'basic':
        return Boolean(age && heightCm && gender);
      case 'goal':
        return Boolean(goal);
      case 'frequency':
        return Boolean(trainingDays);
      case 'preview':
        return true;
      default:
        return true;
    }
  }, [age, equipment, gender, goal, heightCm, step, trainingDays]);

  const handleGenerateProgram = async () => {
    if (!equipment || !trainingDays) return;
    setLoading(true);
    setError(undefined);
    const profile: UserProfile = {
      gender,
      age: Number(age),
      heightCm: Number(heightCm),
      weightKg: weightKg ? Number(weightKg) : undefined,
      equipment,
      goal,
      trainingDaysPerWeek: trainingDays,
    };
    setUserProfile(profile);
    setStrengthEstimate(strength);

    try {
      const response = await initializeProgramFromBackend({
        profile: {
          gender: profile.gender,
          age: profile.age,
          height_cm: profile.heightCm,
          weight_kg: profile.weightKg,
          equipment: profile.equipment,
          goal: profile.goal,
          training_days: profile.trainingDaysPerWeek,
        },
        strength: strength as Record<string, number | undefined>,
      });

      const trainingProgram = {
        id: response.id,
        daysPerWeek: response.days_per_week,
        days: response.days.map((day) => ({
          dayIndex: day.day,
          label: day.label,
          exercises: day.exercises.map((exercise, idx) => ({
            id: exercise.id || `${day.label}-${idx}`,
            name: exercise.name || exercise.id || `Exercise ${idx + 1}`,
            equipment: equipment ?? 'any',
            suggestedWeightKg: exercise.target_weight ?? exercise.suggestedWeightKg,
            suggestedReps: exercise.reps ?? exercise.suggestedReps ?? 10,
            suggestedSets: exercise.sets ?? exercise.suggestedSets ?? 3,
            restSeconds: exercise.restSeconds ?? 90,
          })),
        })),
      };

      setTrainingProgram(trainingProgram);
      setStep('ready');
      markOnboardingComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to initialize program');
    } finally {
      setLoading(false);
    }
  };

  const renderCardButton = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable style={[styles.card, selected && styles.cardSelected]} onPress={onPress}>
      <Text style={[styles.cardText, selected && styles.cardTextSelected]}>{label}</Text>
    </Pressable>
  );

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <View style={styles.centered}>
            <Text style={styles.heading}>Welcome</Text>
            <Text style={styles.subheading}>Your smart personal workout companion</Text>
            <Pressable style={styles.primaryButton} onPress={() => setStep('equipment')}>
              <Text style={styles.primaryText}>Get Started</Text>
            </Pressable>
          </View>
        );
      case 'equipment':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>What equipment do you have?</Text>
            <View style={styles.stack}>
              {renderCardButton('Full Gym', equipment === 'full_gym', () => setEquipment('full_gym'))}
              {renderCardButton('Dumbbells Only', equipment === 'dumbbells', () => setEquipment('dumbbells'))}
              {renderCardButton('Bodyweight Only', equipment === 'bodyweight', () => setEquipment('bodyweight'))}
            </View>
          </View>
        );
      case 'basic':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>Tell us about you</Text>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.chipRow}>
              {(['male', 'female', 'other'] as const).map((g) => (
                <Pressable
                  key={g}
                  style={[styles.chip, gender === g && styles.chipSelected]}
                  onPress={() => setGender(g)}
                >
                  <Text style={[styles.chipText, gender === g && styles.chipTextSelected]}>{g}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.label}>Age</Text>
            <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput style={styles.input} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" />
            <Text style={styles.label}>Weight (kg, optional)</Text>
            <TextInput style={styles.input} value={weightKg} onChangeText={setWeightKg} keyboardType="numeric" />
          </View>
        );
      case 'strength':
        return (
          <ScrollView contentContainerStyle={styles.stepContainer}>
            <Text style={styles.heading}>Estimate your strength</Text>
            {equipmentStrengthFields.map((field) => (
              <StrengthField
                key={field}
                fieldKey={field}
                label={field.replace(/([A-Z])/g, ' $1')}
                value={strength[field]}
                onSelect={(val) => setStrength((prev) => ({ ...prev, [field]: val }))}
              />
            ))}
          </ScrollView>
        );
      case 'goal':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>What’s your goal?</Text>
            <View style={styles.stack}>
              {renderCardButton('Build Muscle', goal === 'muscle', () => setGoal('muscle'))}
              {renderCardButton('Lose Fat', goal === 'fat_loss', () => setGoal('fat_loss'))}
              {renderCardButton('Get Strong', goal === 'strength', () => setGoal('strength'))}
              {renderCardButton('Stay Fit', goal === 'fitness', () => setGoal('fitness'))}
            </View>
          </View>
        );
      case 'frequency':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>How many days per week do you want to train?</Text>
            <View style={styles.chipRow}>
              {[2, 3, 4, 5, 6].map((day) => (
                <Pressable
                  key={day}
                  style={[styles.chip, trainingDays === day && styles.chipSelected]}
                  onPress={() => setTrainingDays(day)}
                >
                  <Text style={[styles.chipText, trainingDays === day && styles.chipTextSelected]}>{day}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        );
      case 'preview':
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.heading}>Program Preview</Text>
            <Text style={styles.subheading}>You’ll train {trainingDays} days per week.</Text>
            <Text style={styles.helper}>We’ll generate a simple starting program tailored to your details.</Text>
          </View>
        );
      case 'ready':
        return (
          <View style={styles.centered}>
            <Text style={styles.heading}>Your plan is ready!</Text>
            <Text style={styles.subheading}>You’re all set to begin.</Text>
            <Pressable style={styles.primaryButton} onPress={() => navigation.replace('StartWorkout')}>
              <Text style={styles.primaryText}>Start Workout</Text>
            </Pressable>
          </View>
        );
      default:
        return null;
    }
  };

  const handleNext = async () => {
    if (step === 'ready') return;
    if (step === 'preview') {
      await handleGenerateProgram();
      return;
    }

    const order: StepKey[] = ['welcome', 'equipment', 'basic', 'strength', 'goal', 'frequency', 'preview', 'ready'];
    const nextIndex = order.indexOf(step) + 1;
    setStep(order[nextIndex]);
  };

  const handleBack = () => {
    const order: StepKey[] = ['welcome', 'equipment', 'basic', 'strength', 'goal', 'frequency', 'preview', 'ready'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>{renderStep()}</ScrollView>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {step !== 'ready' && (
        <View style={styles.footer}>
          {step !== 'welcome' && (
            <Pressable style={styles.secondaryButton} onPress={handleBack}>
              <Text style={styles.secondaryText}>Back</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.primaryButton, !canContinue && styles.disabled]}
            disabled={!canContinue || loading}
            onPress={handleNext}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.primaryText}>{step === 'preview' ? 'Continue' : 'Next'}</Text>
            )}
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.backgroundLight },
  content: { padding: spacing.lg, gap: spacing.lg },
  heading: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  subheading: { color: colors.textSecondary, marginTop: spacing.sm },
  helper: { color: colors.textSecondary, marginTop: spacing.md },
  stack: { gap: spacing.sm },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: spacing.md },
  card: {
    padding: spacing.lg,
    backgroundColor: '#F8FAFC',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.muted,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: '#EEF2FF',
  },
  cardText: { fontWeight: '700', color: colors.textPrimary },
  cardTextSelected: { color: colors.primary },
  stepContainer: { gap: spacing.md, padding: spacing.lg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.muted,
    borderRadius: radii.md,
  },
  chipSelected: { backgroundColor: colors.primary },
  chipText: { color: colors.textPrimary, fontWeight: '600' },
  chipTextSelected: { color: '#fff' },
  label: { fontWeight: '700', color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.muted,
    padding: spacing.sm,
    borderRadius: radii.md,
  },
  strengthField: { gap: spacing.sm },
  footer: { flexDirection: 'row', padding: spacing.lg, gap: spacing.sm },
  primaryButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontWeight: '700' },
  secondaryButton: {
    flex: 1,
    backgroundColor: colors.muted,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  secondaryText: { color: colors.textPrimary, fontWeight: '700' },
  disabled: { opacity: 0.5 },
  error: { color: '#ef4444', paddingHorizontal: spacing.lg },
});

export default OnboardingScreen;
