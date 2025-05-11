import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { DataContext } from '../../context/DataContext';

const BudgetGoalsScreen = ({ navigation }) => {
  const { updateBudget } = useContext(DataContext);
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');

  const handleComplete = async () => {
    try {
      if (!monthlyBudget || !savingsGoal) {
        Alert.alert('Error', 'Please fill in both budget and savings goal');
        return;
      }

      const monthly = parseFloat(monthlyBudget);
      const savings = parseFloat(savingsGoal);

      if (isNaN(monthly) || isNaN(savings)) {
        Alert.alert('Error', 'Please enter valid numbers');
        return;
      }

      // Calculate category limits as percentages of monthly budget
      const categoryBudget = monthly / 6; // Divide equally among 6 categories
      
      // Initialize budget data
      const budgetData = {
        monthly,
        savingsGoal: savings,
        weekly: monthly / 4, // Approximate weekly budget
        categories: {
          food: { limit: categoryBudget, spent: 0 },
          transportation: { limit: categoryBudget, spent: 0 },
          entertainment: { limit: categoryBudget, spent: 0 },
          shopping: { limit: categoryBudget, spent: 0 },
          utilities: { limit: categoryBudget, spent: 0 },
          others: { limit: categoryBudget, spent: 0 }
        }
      };

      // Update budget in DataContext
      await updateBudget(budgetData);      // Save onboarding status
      await AsyncStorage.setItem('onboardingComplete', 'true');
      
      // Navigate to main app using replace
      navigation.replace('MainApp');
    } catch (error) {
      console.error('Error saving budget goals:', error);
      Alert.alert('Error', 'Failed to save budget goals. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Set Your Goals</Text>
          <Text style={styles.subtitle}>Let's set up your monthly budget and savings goal</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={30} color="#FF6B00" />
          </View>
          <Text style={styles.cardTitle}>Monthly Budget</Text>
          <Text style={styles.cardSubtitle}>Set your total monthly spending limit</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <TextInput
              style={styles.input}
              value={monthlyBudget}
              onChangeText={setMonthlyBudget}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="trending-up-outline" size={30} color="#FF6B00" />
          </View>
          <Text style={styles.cardTitle}>Savings Goal</Text>
          <Text style={styles.cardSubtitle}>How much would you like to save?</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₱</Text>
            <TextInput
              style={styles.input}
              value={savingsGoal}
              onChangeText={setSavingsGoal}
              placeholder="0.00"
              placeholderTextColor="#666"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.button,
            (!monthlyBudget || !savingsGoal) && styles.buttonDisabled
          ]}
          onPress={handleComplete}
          disabled={!monthlyBudget || !savingsGoal}
        >
          <Text style={styles.buttonText}>Complete Setup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#808080',
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1C1C1C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#808080',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  currencySymbol: {
    color: '#FF6B00',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 20,
    paddingVertical: 15,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#FF6B00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BudgetGoalsScreen;
