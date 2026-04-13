import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  StatusBar, Platform, TouchableOpacity, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={20} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

const TeacherHome = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Ms. Garcia 👩‍🏫</Text>
              <Text style={styles.subGreeting}>Good morning! Here's your class overview</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* STATS GRID */}
          <View style={styles.grid}>
            <StatCard title="Students" value="24" icon="people" color={COLORS.primary} />
            <StatCard title="Active Today" value="18" icon="checkmark-circle" color={COLORS.success} />
            <StatCard title="Avg Class XP" value="1.2k" icon="star" color="#FFB300" />
            <StatCard title="Done Tasks" value="85%" icon="book" color="#FF7043" />
          </View>

          {/* STUDENT MANAGEMENT SECTION */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Student Progress 📈</Text>
            <Text style={styles.viewAll}>View All</Text>
          </View>

          {/* MOCK STUDENT LIST */}
          {['Angel Garcia', 'John Doe', 'Maria Santos'].map((student, i) => (
            <View key={i} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <View style={styles.avatarMini}><Text>🧒</Text></View>
                <View>
                  <Text style={styles.studentName}>{student}</Text>
                  <Text style={styles.studentLevel}>Level {5 + i} • 320 XP</Text>
                </View>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: i === 2 ? '#FFEBEE' : '#E8F5E9' }]}>
                <Text style={[styles.statusText, { color: i === 2 ? '#FF5252' : '#4CAF50' }]}>
                  {i === 2 ? 'Needs Help' : 'Active'}
                </Text>
              </View>
            </View>
          ))}

          {/* QUICK ACTIONS */}
          <Text style={styles.sectionTitle}>Quick Actions 📢</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="person-add" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.actionLabel}>Add Student</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <View style={[styles.actionIcon, { backgroundColor: '#F1F8E9' }]}>
                <Ionicons name="megaphone" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.actionLabel}>Announce</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 26, fontWeight: '900', color: '#455A64' },
  subGreeting: { fontSize: 14, color: '#90A4AE', fontWeight: 'bold' },
  notifBtn: { backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { backgroundColor: 'white', width: '47%', padding: 15, borderRadius: 20, marginBottom: 15, elevation: 3 },
  statValue: { fontSize: 20, fontWeight: '900', color: '#455A64', marginTop: 5 },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#B0BEC5' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#455A64', marginTop: 10, marginBottom: 10 },
  viewAll: { color: COLORS.primary, fontWeight: 'bold' },
  studentCard: { backgroundColor: 'white', padding: 15, borderRadius: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, elevation: 2 },
  studentInfo: { flexDirection: 'row', alignItems: 'center' },
  avatarMini: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#455A64' },
  studentLevel: { fontSize: 12, color: '#90A4AE', fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  statusText: { fontSize: 10, fontWeight: '900' },
  actionsRow: { flexDirection: 'row', gap: 15 },
  actionItem: { alignItems: 'center' },
  actionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  actionLabel: { fontSize: 11, fontWeight: 'bold', color: '#78909C' }
});

export default TeacherHome;