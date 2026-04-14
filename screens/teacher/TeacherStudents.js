import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const TeacherStudents = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const students = [
    { id: '1', name: 'Angel Garcia', level: 5, xp: 320, status: 'Active' },
    { id: '2', name: 'John Doe', level: 3, xp: 150, status: 'Needs Help' },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* FIXED TITLE SPACING */}
          <Text style={styles.title}>Your Champions 🧒</Text>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#B0BEC5" />
            <TextInput style={styles.searchInput} placeholder="Search student..." value={search} onChangeText={setSearch} />
          </View>

          <View style={styles.filterRow}>
            {['All', 'Active', 'Needs Help'].map((f) => (
                <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && { backgroundColor: COLORS.primary }]} onPress={() => setFilter(f)}>
                    <Text style={[styles.filterText, filter === f && { color: 'white' }]}>{f}</Text>
                </TouchableOpacity>
            ))}
          </View>

          <FlatList 
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.card}>
                    <View style={styles.avatar}><Text>🧒</Text></View>
                    <View style={{flex:1, marginLeft: 15}}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.info}>Level {item.level} • {item.xp} XP</Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: item.status === 'Active' ? '#E8F5E9' : '#FFEBEE' }]}>
                        <Text style={{ fontSize: 10, color: item.status === 'Active' ? '#4CAF50' : '#F44336', fontWeight: 'bold' }}>{item.status}</Text>
                    </View>
                </TouchableOpacity>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  container: { flex: 1, padding: 25 },
  title: { fontSize: 32, fontWeight: '900', color: '#455A64', marginBottom: 20 },
  searchContainer: { backgroundColor: 'white', padding: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 5 },
  searchInput: { marginLeft: 10, flex: 1, fontWeight: '600' },
  filterRow: { flexDirection: 'row', marginVertical: 20 },
  filterBtn: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 15, marginRight: 10, backgroundColor: 'white', elevation: 2 },
  filterText: { fontWeight: 'bold', color: '#90A4AE', fontSize: 12 },
  card: { backgroundColor: 'white', padding: 18, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 4 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#455A64' },
  info: { fontSize: 12, color: '#90A4AE', fontWeight: 'bold' },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }
});

export default TeacherStudents;