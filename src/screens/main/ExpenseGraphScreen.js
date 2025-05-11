import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExpenseGraphScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Expense Analytics</Text>
      
      <ScrollView>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Monthly Overview</Text>
          <View style={styles.graphPlaceholder}>
            <Text style={styles.placeholderText}>Graph Coming Soon</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Category Breakdown</Text>
          <View style={styles.graphPlaceholder}>
            <Text style={styles.placeholderText}>Pie Chart Coming Soon</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Spending Trends</Text>
          <View style={styles.graphPlaceholder}>
            <Text style={styles.placeholderText}>Line Graph Coming Soon</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  card: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  graphPlaceholder: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 16,
  },
});

export default ExpenseGraphScreen;
