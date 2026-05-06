import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const TeacherHome = ({ navigation }) => {
  const [rooms, setRooms] = useState([
    { id: '1', name: 'Room 1-A', count: 2, color: COLORS.primary },
    { id: '2', name: 'Room 1-B', count: 1, color: COLORS.secondary },
  ]);

  const allStudents = [
    { id: '1', name: 'Angel Anne Garcia', progress: 80, level: 5 },
    { id: '2', name: 'Shaine Roxanne Eceja', progress: 60, level: 4 },
    { id: '3', name: 'Prince Lawrence San Miguel', progress: 30, level: 2 },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E3F2FD', '#FFF1F0']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* 1. ANIMATED HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back,</Text>
              <Text style={styles.teacherName}>Teacher Garcia 👩‍🏫</Text>
            </View>
            <View style={styles.mascotCircle}>
                <Text style={{fontSize: 40}}>🐰</Text>
            </View>
          </View>

          {/* 2. MY CLASSES SECTION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Classes 🏫</Text>
            <TouchableOpacity style={styles.addBtn}>
                <Text style={styles.addBtnText}>+ Add Room</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomScroll}>
            {rooms.map((room) => (
              <TouchableOpacity 
                key={room.id} 
                style={[styles.roomCard, { backgroundColor: room.color }]}
                onPress={() => navigation.navigate('Students', { filterRoom: room.name })}
              >
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomInfo}>{room.count} Students • Grade 1</Text>
                <Ionicons name="chevron-forward-circle" size={24} color="white" style={styles.roomIcon} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 3. INDIVIDUAL PROGRESS */}
          <Text style={styles.sectionTitle}>Individual Progress 🧒</Text>
          {allStudents.map((student) => (
            <TouchableOpacity 
                key={student.id} 
                style={styles.progressCard}
                onPress={() => navigation.navigate('StudentDetail', { student })}
            >
              <View style={styles.avatarPlaceholder} />
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.studentName}>{student.name}</Text>
                <View style={styles.pBarBg}>
                    <View style={[styles.pBarFill, { width: `${student.progress}%` }]} />
                </View>
                <Text style={styles.studentMeta}>Level {student.level} • {student.progress}% Done</Text>
              </View>
            </TouchableOpacity>
          ))}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: 20 },
  scrollContent: { padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcomeText: { fontSize: 16, color: COLORS.muted, fontWeight: 'bold' },
  teacherName: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  mascotCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  addBtn: { backgroundColor: 'white', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 15, elevation: 2 },
  addBtnText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },

  roomScroll: { marginBottom: 25 },
  roomCard: { width: 200, padding: 25, borderRadius: 30, marginRight: 15, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1 },
  roomName: { color: 'white', fontSize: 22, fontWeight: '900' },
  roomInfo: { color: 'white', opacity: 0.9, fontWeight: 'bold', fontSize: 12 },
  roomIcon: { marginTop: 15, alignSelf: 'flex-end' },

  progressCard: { backgroundColor: 'white', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 4 },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#ECEFF1' },
  studentName: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
  pBarBg: { height: 10, backgroundColor: '#F5F5F5', borderRadius: 5, overflow: 'hidden' },
  pBarFill: { height: '100%', backgroundColor: COLORS.success },
  studentMeta: { fontSize: 11, color: COLORS.muted, fontWeight: 'bold', marginTop: 5 }
});

export default TeacherHome;