import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width } = Dimensions.get('window');

// --- Reusable Stat Card Component ---
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
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. FETCH REAL RECORD FROM DATABASE
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await API.get('/user');
        setUserData(response.data);
      } catch (error) {
        console.log("Error loading stats, using mock data for UI preview.");
        // Fallback for UI testing if server is off
        setUserData({ name: "Champion", points: 0, level: 1 });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // 2. LOGIC FOR PROGRESS BAR (Points needed for next level)
  // Example: Every 100 points is a new level
  const progressPercent = (userData.points % 100) + "%";

  return (
    <View style={styles.container}>
      {/* STATUS BAR FIX */}
      <StatusBar barStyle="dark-content" />
      
      {/* PREMIUM BACKGROUND GRADIENT */}
      <LinearGradient 
        colors={['#E1F5FE', '#FCE4EC']} 
        style={StyleSheet.absoluteFill} 
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
        >
          
          <Text style={styles.headerTitle}>My Progress 📈</Text>

          {/* 3. REAL LEVEL & XP CARD (Glassmorphism Effect) */}
          <View style={styles.glassCard}>
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level {userData.level} Student</Text>
              <Text style={styles.xpText}>{userData.points} XP</Text>
            </View>
            
            {/* PROGRESS BAR CONNECTED TO POINTS */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: progressPercent }]} /> 
                </View>
            </View>
            
            <Text style={styles.milestoneText}>✨ Great job, {userData.name}! Keep it up!</Text>
          </View>

          {/* 4. STATS GRID (2x2) */}
          <View style={styles.grid}>
            <StatCard title="Total Points" value={userData.points} icon="star" color="#FFB300" />
            <StatCard title="Current Level" value={userData.level} icon="trophy" color={COLORS.primary} />
            <StatCard title="Day Streak" value="1 Day" icon="flame" color="#FF7043" />
            <StatCard title="Badges" value="0" icon="ribbon" color={COLORS.success} />
          </View>

          {/* 5. ACHIEVEMENTS SECTION */}
          <Text style={styles.sectionTitle}>My Badges 🏆</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.badgeRow}
          >
            {[
              { name: 'First Win', icon: 'ribbon', color: '#FFD700' },
              { name: 'Perfect Score', icon: 'checkmark-circle', color: COLORS.primary },
              { name: '5-Day Streak', icon: 'flame', color: '#FF7043' },
              { name: 'Fast Learner', icon: 'flash', color: COLORS.success },
            ].map((badge, i) => (
              <View key={i} style={styles.badgeItem}>
                <View style={styles.badgeCircle}>
                   {/* If points < 10, badges look locked (gray) */}
                   <Ionicons 
                        name={badge.icon} 
                        size={32} 
                        color={userData.points > 10 ? badge.color : "#CFD8DC"} 
                    />
                </View>
                <Text style={styles.badgeLabel}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={{ height: 100 }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F8E9' },
  safeArea: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 
  },
  scrollContent: { padding: 20 },
  headerTitle: { 
    fontSize: 34, 
    fontWeight: '900', 
    color: COLORS.primary, 
    marginBottom: 25,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 30,
    padding: 25,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    elevation: 10,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1, 
    shadowRadius: 20,
  },
  levelRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: 12 
  },
  levelText: { fontWeight: '900', color: '#455A64', fontSize: 20 },
  xpText: { fontWeight: 'bold', color: '#78909C', fontSize: 16 },
  
  progressBarContainer: {
    width: '100%',
    height: 14,
    marginVertical: 5,
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 10,
  },
  milestoneText: { 
    marginTop: 12, 
    fontSize: 13, 
    color: '#78909C', 
    fontWeight: 'bold',
    textAlign: 'center' 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  statCard: {
    backgroundColor: 'white',
    width: '47%',
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 4,
  },
  iconCircle: { 
    width: 54, height: 54, borderRadius: 27, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 12 
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#455A64' },
  statLabel: { fontSize: 12, fontWeight: '900', color: '#B0BEC5' },

  sectionTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: '#455A64', 
    marginTop: 15, 
    marginBottom: 20 
  },
  badgeRow: { flexDirection: 'row' },
  badgeItem: { alignItems: 'center', marginRight: 22 },
  badgeCircle: { 
    width: 80, height: 80, borderRadius: 40, 
    backgroundColor: 'white', justifyContent: 'center', 
    alignItems: 'center', elevation: 3,
  },
  badgeLabel: { 
    marginTop: 10, 
    fontSize: 12, 
    fontWeight: 'bold', 
    color: '#90A4AE',
    textAlign: 'center' 
  }
});

export default StudentStats;