import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import OnboardingScreen from './src/screens/Onboarding';
import StartWorkoutScreen from './src/screens/StartWorkout';
import ActiveWorkoutScreen from './src/screens/ActiveWorkout';
import WorkoutSummaryScreen from './src/screens/WorkoutSummary';
import { colors } from './src/theme';
import { useAppStore } from './src/state/appStore';

export type RootStackParamList = {
  Onboarding: undefined;
  StartWorkout: undefined;
  ActiveWorkout: undefined;
  WorkoutSummary: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const onboardingComplete = useAppStore((state) => state.onboardingComplete);
  const [hydrated, setHydrated] = useState<boolean>(
    typeof useAppStore.persist?.hasHydrated === 'function' ? useAppStore.persist.hasHydrated() : true
  );

  useEffect(() => {
    if (typeof useAppStore.persist?.onFinishHydration === 'function') {
      const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
      return unsub;
    }
    setHydrated(true);
    return undefined;
  }, []);

  const initialRoute = onboardingComplete ? 'StartWorkout' : 'Onboarding';

  if (!hydrated) {
    return null;
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Stack.Navigator key={initialRoute} initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="StartWorkout" component={StartWorkoutScreen} />
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          <Stack.Screen name="WorkoutSummary" component={WorkoutSummaryScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
});
