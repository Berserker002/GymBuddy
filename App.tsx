import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import OnboardingScreen from './src/screens/Onboarding';
import DashboardScreen from './src/screens/Dashboard';
import EditableWorkoutScreen from './src/screens/EditableWorkout';
import ActiveWorkoutScreen from './src/screens/ActiveWorkout';
import SummaryScreen from './src/screens/Summary';
import HistoryScreen from './src/screens/History';
import ExerciseGuideScreen from './src/screens/ExerciseGuide';
import { colors } from './src/theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  EditableWorkout: undefined;
  ActiveWorkout: undefined;
  Summary: undefined;
  History: undefined;
  ExerciseGuide: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="EditableWorkout" component={EditableWorkoutScreen} />
          <Stack.Screen name="ActiveWorkout" component={ActiveWorkoutScreen} />
          <Stack.Screen name="Summary" component={SummaryScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
          <Stack.Screen name="ExerciseGuide" component={ExerciseGuideScreen} />
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
