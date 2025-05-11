import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const GetStartedScreen = ({ navigation }) => {  const handleGetStarted = async () => {
    navigation.replace('BudgetGoals');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logo}>
          <Ionicons name="wallet" size={80} color="#FF6B00" />
        </View>
        
        <Text style={styles.title}>Welcome to MoneyTrack</Text>
        <Text style={styles.subtitle}>
          Your personal finance companion for smart spending and saving
        </Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.featureText}>✓ Track your daily expenses</Text>
          <Text style={styles.featureText}>✓ Set and monitor budget goals</Text>
          <Text style={styles.featureText}>✓ Get AI-powered insights</Text>
          <Text style={styles.featureText}>✓ Stay organized with notes</Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
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
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    backgroundColor: '#2C2C2C',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#808080',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    alignSelf: 'stretch',
    marginBottom: 40,
  },
  featureText: {
    fontSize: 16,
    marginBottom: 15,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#FF6B00',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GetStartedScreen;
