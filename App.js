// App.js - Main entry point for the MoneyTrack App

import React, { useState, useEffect, useContext } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import AccountRecoveryScreen from './src/screens/auth/AccountRecoveryScreen';
import TermsAndConditionsScreen from './src/screens/auth/TermsAndConditionsScreen';

// Onboarding Screens
import GetStartedScreen from './src/screens/onboarding/GetStartedScreen';
import BudgetGoalsScreen from './src/screens/onboarding/BudgetGoalsScreen';

// Main App Screens
import HomeScreen from './src/screens/main/HomeScreen';
import ExpenseScreen from './src/screens/main/ExpenseScreen';
import ExpenseGraphScreen from './src/screens/main/ExpenseGraphScreen';
import CalendarScreen from './src/screens/main/CalendarScreen';
import NoteScreen from './src/screens/main/NoteScreen';
import AddNoteScreen from './src/screens/main/AddNoteScreen';
import SettingsScreen from './src/screens/main/SettingsScreen';

// Context Provider for global state management
import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { DataProvider } from './src/context/DataContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom theme
const MoneyTrackTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#FF6B00',
    background: '#1C1C1C',
    card: '#2C2C2C',
    text: '#FFFFFF',
    border: '#3C3C3C',
    notification: '#FF6B00',
  },
};

// Bottom tab navigator for the main app screens
function MainTabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Expenses') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Notes') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#808080',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2C2C2C',
          borderTopColor: '#3C3C3C',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Expenses" component={ExpenseScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Notes" component={NoteScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthProvider>
        <DataProvider>
          <NavigationContainer theme={MoneyTrackTheme}>
            <AppNavigator />
          </NavigationContainer>
        </DataProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
};

const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
        setHasOnboarded(onboardingComplete === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    checkOnboardingStatus();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#1C1C1C' }
      }}
    >
      {!userToken ? (
        <Stack.Group>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="AccountRecovery" component={AccountRecoveryScreen} />
          <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} />
        </Stack.Group>
      ) : !hasOnboarded ? (
        <Stack.Group>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="BudgetGoals" component={BudgetGoalsScreen} />
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
          <Stack.Screen name="AddNote" component={AddNoteScreen} />
          <Stack.Screen name="ExpenseGraph" component={ExpenseGraphScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default App;