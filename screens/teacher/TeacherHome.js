import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, 
  Platform, TouchableOpacity, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const TeacherHome = ({ navigation }) => {
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Ms. Garcia 👩‍🏫</Text>
              <Text style={styles.subGreeting}>Good morning! Class overview</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn}>
              <Ionicons name="notifications" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.crownCard} activeOpacity={0.9}>
             <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.crownGradient}>
                <MaterialCommunityIcons name="crown" size={34} color="white" />
                <View style={{marginLeft: 15}}>
                    <Text style={styles.crownLabel}>TOP STUDENT THIS WEEK</Text>
                    <Text style={styles.topStudentName}>Angel Garcia • 1,240 XP</Text>
                </View>
             </LinearGradient>
          </TouchableOpacity>

          {/* STATS GRID - FIXED LAYOUT */}
          <View style={styles.grid}>
            <View style={styles.statCard}>
                <Ionicons name="people" size={24} color={COLORS.primary} />
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
                <Ionicons name="flash" size={24} color={COLORS.success} />
                <Text style={styles.statValue}>18</Text>
                <Text style={styles.statLabel}>Active Today</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Students Progress</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Students')}>
                <Text style={styles.viewAll}>View All ➔</Text>
            </TouchableOpacity>
          </View>

          {/* STUDENT CARD */}
          <TouchableOpacity style={styles.studentCard}>
            <View style={styles.avatarMini}><Text>🧒</Text></View>
            <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.studentName}>Angel Garcia</Text>
                <View style={styles.xpBarBg}>
                    <View style={[styles.xpBarFill, { width: '75%' }]} />
                </View>
            </View>
            <View style={styles.statusDot} />
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>

      <TouchableOpacity style={styles.fab} onPress={() => setFabOpen(!fabOpen)}>
        <LinearGradient colors={[COLORS.primary, '#64B5F6']} style={styles.fabGradient}>
            <Ionicons name={fabOpen ? "close" : "add"} size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 28, fontWeight: '900', color: '#455A64' },
  subGreeting: { fontSize: 14, color: '#90A4AE', fontWeight: 'bold' },
  notifBtn: { backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 5 },
  
  crownCard: { marginBottom: 25, elevation: 8, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10 },
  crownGradient: { padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  crownLabel: { color: 'rgba(255,255,255,0.8)', fontWeight: '900', fontSize: 10, letterSpacing: 1 },
  topStudentName: { color: 'white', fontWeight: '900', fontSize: 18 },

  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  statCard: { backgroundColor: 'white', width: '48%', padding: 20, borderRadius: 25, elevation: 4, alignItems: 'center', marginBottom: 20 },
  statValue: { fontSize: 24, fontWeight: '900', color: '#455A64', marginTop: 5 },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#B0BEC5' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#455A64' },
  viewAll: { color: COLORS.primary, fontWeight: '900' },

  studentCard: { backgroundColor: 'white', padding: 18, borderRadius: 25, flexDirection: 'row', alignItems: 'center', elevation: 3, marginBottom: 15 },
  avatarMini: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  studentName: { fontSize: 16, fontWeight: '900', color: '#455A64', marginBottom: 8 },
  xpBarBg: { height: 10, backgroundColor: '#F0F0F0', borderRadius: 5, width: '100%' },
  xpBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 5 },
  statusDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, marginLeft: 15 },

  fab: { position: 'absolute', bottom: 30, right: 30, elevation: 8 },
  fabGradient: { width: 65, height: 65, borderRadius: 32.5, justifyContent: 'center', alignItems: 'center' }
});

export default TeacherHome;