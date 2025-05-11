import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const NoteScreen = ({ navigation }) => {
  const [notes] = useState([
    { id: '1', title: 'Monthly Budget', date: '2025-05-11', preview: 'Need to reduce food expenses...' },
    { id: '2', title: 'Savings Goal', date: '2025-05-10', preview: 'Save ₱5000 this month...' },
  ]);

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.noteItem}
      onPress={() => {/* TODO: View note details */}}
    >
      <View>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.notePreview}>{item.preview}</Text>
        <Text style={styles.noteDate}>{item.date}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Notes</Text>

      <FlatList
        data={notes}
        renderItem={renderNoteItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddNote')}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  list: {
    flex: 1,
  },
  noteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  notePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default NoteScreen;
