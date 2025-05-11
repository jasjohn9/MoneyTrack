// context/DataContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [budget, setBudget] = useState({
    monthly: 0,
    weekly: 0,
    savingsGoal: 0,
    categories: {
      food: { limit: 0, spent: 0 },
      transportation: { limit: 0, spent: 0 },
      entertainment: { limit: 0, spent: 0 },
      shopping: { limit: 0, spent: 0 },
      utilities: { limit: 0, spent: 0 },
      others: { limit: 0, spent: 0 }
    }
  });
  
  const [expenses, setExpenses] = useState([]);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Load budget and expenses from AsyncStorage
  const loadData = async () => {
    try {
      const [budgetData, expensesData] = await Promise.all([
        AsyncStorage.getItem('budget'),
        AsyncStorage.getItem('expenses')
      ]);

      if (budgetData) {
        setBudget(JSON.parse(budgetData));
      }
      if (expensesData) {
        setExpenses(JSON.parse(expensesData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  // Save budget and expenses to AsyncStorage
  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('budget', JSON.stringify(budget)),
        AsyncStorage.setItem('expenses', JSON.stringify(expenses))
      ]);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  // Update budget whenever it changes
  useEffect(() => {
    saveData();
  }, [budget, expenses]);

  // Add a new expense
  const addExpense = (expense) => {
    const newExpense = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...expense
    };

    setExpenses(prevExpenses => [newExpense, ...prevExpenses]);

    // Update category spent amount
    setBudget(prevBudget => ({
      ...prevBudget,
      categories: {
        ...prevBudget.categories,
        [expense.category.toLowerCase()]: {
          ...prevBudget.categories[expense.category.toLowerCase()],
          spent: prevBudget.categories[expense.category.toLowerCase()].spent + parseFloat(expense.amount)
        }
      }
    }));
  };

  // Delete an expense
  const deleteExpense = (expenseId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    setExpenses(prevExpenses => prevExpenses.filter(e => e.id !== expenseId));

    // Update category spent amount
    setBudget(prevBudget => ({
      ...prevBudget,
      categories: {
        ...prevBudget.categories,
        [expense.category.toLowerCase()]: {
          ...prevBudget.categories[expense.category.toLowerCase()],
          spent: prevBudget.categories[expense.category.toLowerCase()].spent - parseFloat(expense.amount)
        }
      }
    }));
  };

  // Get expenses for a date range
  const getExpensesByDateRange = (startDate, endDate) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  };

  // Calculate total expenses for a list of expenses
  const calculateTotalExpenses = (expenseList = expenses) => {
    return expenseList.reduce((total, expense) => total + parseFloat(expense.amount), 0);
  };

  // Update budget settings
  const updateBudget = (newBudget) => {
    setBudget(prevBudget => ({
      ...prevBudget,
      ...newBudget
    }));
  };

  // Generate insights based on spending patterns
  const generateAIInsights = () => {
    const totalSpent = calculateTotalExpenses();
    const monthlyBudget = budget.monthly;
    const budgetPercentage = (totalSpent / monthlyBudget) * 100;
    
    let insights = [];
    
    // Budget insights
    if (budgetPercentage > 90) {
      insights.push('You\'re close to exceeding your monthly budget. Consider reducing non-essential expenses.');
    } else if (budgetPercentage < 50 && totalSpent > 0) {
      insights.push('You\'re managing your budget well! You\'ve only used ' + budgetPercentage.toFixed(1) + '% of your monthly allowance.');
    }
    
    // Category insights
    Object.entries(budget.categories).forEach(([category, { spent, limit }]) => {
      if (spent > 0) {
        const categoryPercentage = (spent / limit) * 100;
        if (categoryPercentage > 90) {
          insights.push(`Warning: You've almost reached your ${category} budget (${categoryPercentage.toFixed(1)}% used)`);
        }
      }
    });

    // Spending pattern insights
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const todaysExpenses = getExpensesByDateRange(startOfToday, today);
    
    if (todaysExpenses.length > 3) {
      insights.push('You\'ve made multiple transactions today. Make sure these align with your financial goals.');
    }

    // If no specific insights, provide general advice
    if (insights.length === 0) {
      insights.push('Start tracking your expenses consistently to receive personalized insights.');
    }

    return insights;
  };

  const value = {
    budget,
    expenses,
    addExpense,
    deleteExpense,
    updateBudget,
    getExpensesByDateRange,
    calculateTotalExpenses,
    generateAIInsights
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};