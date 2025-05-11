import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selected, setSelected] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>
      
      <Calendar
        onDayPress={day => {
          setSelected(day.dateString);
        }}
        markedDates={{
          [currentDate]: { marked: true, dotColor: '#FF6B00' },
          [selected]: { selected: true, selectedColor: '#FF6B00' }
        }}
        theme={{
          backgroundColor: '#1C1C1C',
          calendarBackground: '#1C1C1C',
          textSectionTitleColor: '#808080',
          selectedDayBackgroundColor: '#FF6B00',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#FF6B00',
          dayTextColor: '#FFFFFF',
          textDisabledColor: '#464646',
          dotColor: '#FF6B00',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#FF6B00',
          monthTextColor: '#FFFFFF',
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14
        }}
      />

      {selected ? (
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateTitle}>Expenses for {selected}</Text>
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={50} color="#3C3C3C" />
            <Text style={styles.noExpensesText}>No expenses recorded</Text>
          </View>
        </View>
      ) : null}

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
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedDateContainer: {
    flex: 1,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2C',
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noExpensesText: {
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

export default CalendarScreen;
