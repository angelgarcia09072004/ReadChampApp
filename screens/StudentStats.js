import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress'; // npx expo install react-native-progress
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color }) => (
  <View style={styles.statCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{title}</Text>
  </View>
);

const StudentStats = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.headerTitle}>My Progress 📈</Text>

          {/* 1. LEVEL & XP CARD */}
          <View style={styles.glassCard}>
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level 5 Student</Text>
              <Text style={styles.xpText}>320 / 500 XP</Text>
            </View>
            <Progress.Bar 
              progress={0.6} 
              width={width * 0.75} 
              height={12} 
              color={COLORS.primary} 
              unfilledColor="#E0E0E0" 
              borderWidth={0} 
              borderRadius={10}
            />
            <Text style={styles.milestoneText}>✨ 180 XP to Level 6!</Text>
          </View>

          {/* 2. STATS GRID */}
          <View style={styles.grid}>
            <StatCard title="Total Points" value="1,240" icon="star" color="#FFB300" />
            <StatCard title="Games Played" value="48" icon="game-controller" color={COLORS.primary} />
            <StatCard title="Day Streak" value="5 Days" icon="flame" color="#FF7043" />
            <StatCard title="Badges" value="12" icon="trophy" color={COLORS.success} />
          </View>

          {/* 3. ACHIEVEMENTS SECTION */}
          <Text style={styles.sectionTitle}>Achievements 🏆</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeRow}>
            {['First Win', '5-Day Streak', 'Math Master', 'Quick Learner'].map((badge, i) => (
              <View key={i} style={styles.badgeItem}>
                <View style={styles.badgeCircle}>
                   <Ionicons name="ribbon" size={30} color={i === 0 ? "#FFD700" : "#B0BEC5"} />
                </View>
                <Text style={styles.badgeLabel}>{badge}</Text>
              </View>
            ))}
          </ScrollView>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  scrollContent: { padding: 25 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.primary, marginBottom: 25 },
  
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 10 },
  levelText: { fontWeight: '900', color: '#455A64', fontSize: 18 },
  xpText: { fontWeight: 'bold', color: '#90A4AE' },
  milestoneText: { marginTop: 10, fontSize: 12, color: '#78909C', fontWeight: 'bold' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: {
    backgroundColor: 'white',
    width: '47%',
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },
  iconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 18, fontWeight: '900', color: '#455A64' },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#90A4AE' },

  sectionTitle: { fontSize: 22, fontWeight: '900', color: '#455A64', marginTop: 10, marginBottom: 15 },
  badgeRow: { flexDirection: 'row' },
  badgeItem: { alignItems: 'center', marginRight: 20 },
  badgeCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  badgeLabel: { marginTop: 8, fontSize: 12, fontWeight: 'bold', color: '#78909C' }
});

export default StudentStats;