// screens/main/HomeScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { DataContext } from '../../context/DataContext';

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const { 
    budget, 
    expenses, 
    calculateTotalExpenses, 
    getExpensesByDateRange,
    generateAIInsights
  } = useContext(DataContext);
  
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  
  // Get current date information
  const currentDate = new Date();
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const daysLeft = lastDayOfMonth - currentDate.getDate();
  
  // Get expenses for different periods
  const getThisWeekExpenses = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return getExpensesByDateRange(startOfWeek, endOfWeek);
  };
  
  const getThisMonthExpenses = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
    return getExpensesByDateRange(startOfMonth, endOfMonth);
  };
  
  // Calculate spending metrics
  const monthlyExpenses = getThisMonthExpenses();
  const monthlySpent = calculateTotalExpenses(monthlyExpenses);
  const monthlyRemaining = budget.monthly - monthlySpent;
  const dailyBudget = monthlyRemaining > 0 ? monthlyRemaining / (daysLeft || 1) : 0;
  
  // Generate insights and get recent expenses
  useEffect(() => {
    const aiInsights = generateAIInsights();
    setInsights(aiInsights);
    
    const sortedExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentExpenses(sortedExpenses);
  }, [expenses]);
  
  const onRefresh = () => {
    setRefreshing(true);
    const aiInsights = generateAIInsights();
    setInsights(aiInsights);
    const sortedExpenses = [...expenses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    setRecentExpenses(sortedExpenses);
    setRefreshing(false);
  };
  
  const formatCurrency = (amount) => {
    return '₱' + parseFloat(amount).toFixed(2);
  };
  
  const getCategoryIcon = (category) => {
    const categoryMap = {
      food: 'fast-food-outline',
      transportation: 'bus-outline',
      entertainment: 'film-outline',
      shopping: 'cart-outline',
      utilities: 'build-outline',
      others: 'apps-outline'
    };
    return categoryMap[category.toLowerCase()] || 'apps-outline';
  };

  const renderRecentExpense = (expense) => {
    const expenseDate = new Date(expense.date).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit'
    });

    return (
      <TouchableOpacity key={expense.id} style={styles.expenseItem}>
        <View style={styles.expenseLeft}>
          <View style={styles.expenseIcon}>
            <Ionicons name={getCategoryIcon(expense.category)} size={20} color="#FF6B00" />
          </View>
          <View>
            <Text style={styles.expenseCategory}>{expense.category}</Text>
            <Text style={styles.expenseDate}>{expenseDate}</Text>
          </View>
        </View>
        <Text style={styles.expenseAmount}>{formatCurrency(expense.amount)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FF6B00"
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.name}>{userInfo?.name || 'User'}</Text>
          </View>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.budgetCard}>
          <Text style={styles.budgetTitle}>Monthly Budget</Text>
          <Text style={styles.budgetAmount}>{formatCurrency(budget.monthly)}</Text>
          <View style={styles.budgetInfo}>
            <View>
              <Text style={styles.budgetLabel}>Spent</Text>
              <Text style={styles.budgetValue}>{formatCurrency(monthlySpent)}</Text>
            </View>
            <View>
              <Text style={styles.budgetLabel}>Remaining</Text>
              <Text style={styles.budgetValue}>{formatCurrency(monthlyRemaining)}</Text>
            </View>
            <View>
              <Text style={styles.budgetLabel}>Daily Budget</Text>
              <Text style={styles.budgetValue}>{formatCurrency(dailyBudget)}</Text>
            </View>
          </View>
        </View>

        {insights.length > 0 && (
          <View style={styles.insightsContainer}>
            <Text style={styles.sectionTitle}>Insights</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {insights.map((insight, index) => (
                <View key={index} style={styles.insightCard}>
                  <Ionicons name="bulb-outline" size={20} color="#FF6B00" />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.recentExpenses}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {recentExpenses.length > 0 ? (
            recentExpenses.map(renderRecentExpense)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={50} color="#3C3C3C" />
              <Text style={styles.emptyStateText}>No expenses recorded yet</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('Expenses')}
      >
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    color: '#808080',
    fontSize: 16,
  },
  name: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetCard: {
    margin: 20,
    padding: 20,
    backgroundColor: '#2C2C2C',
    borderRadius: 15,
  },
  budgetTitle: {
    color: '#808080',
    fontSize: 14,
    marginBottom: 5,
  },
  budgetAmount: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  budgetInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  budgetLabel: {
    color: '#808080',
    fontSize: 12,
    marginBottom: 5,
  },
  budgetValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
  insightsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2C',
    borderRadius: 12,
    padding: 15,
    marginLeft: 20,
    marginRight: 5,
    maxWidth: 300,
  },
  insightText: {
    color: '#FFF',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
  },
  recentExpenses: {
    flex: 1,
    marginBottom: 80,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  seeAllText: {
    color: '#FF6B00',
    fontSize: 14,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
  },
  expenseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expenseCategory: {
    color: '#FFF',
    fontSize: 16,
    marginBottom: 4,
  },
  expenseDate: {
    color: '#808080',
    fontSize: 12,
  },
  expenseAmount: {
    color: '#FF6B00',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#808080',
    fontSize: 16,
    marginTop: 10,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default HomeScreen;
