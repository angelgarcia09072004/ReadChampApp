import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

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
  return (
    <View style={styles.container}>
      {/* 1. STATUS BAR FIX (White icons) */}
      <StatusBar barStyle="dark-content" />
      
      {/* 2. PREMIUM BACKGROUND GRADIENT */}
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

          {/* 3. LEVEL & XP CARD (Glassmorphism Effect) */}
          <View style={styles.glassCard}>
            <View style={styles.levelRow}>
              <Text style={styles.levelText}>Level 5 Student</Text>
              <Text style={styles.xpText}>320 / 500 XP</Text>
            </View>
            
            {/* CUSTOM HAND-CODED PROGRESS BAR */}
            <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: '64%' }]} /> 
                </View>
            </View>
            
            <Text style={styles.milestoneText}>✨ 180 XP more to reach Level 6!</Text>
          </View>

          {/* 4. STATS GRID (2x2) */}
          <View style={styles.grid}>
            <StatCard title="Total Points" value="1,240" icon="star" color="#FFB300" />
            <StatCard title="Games Played" value="48" icon="game-controller" color={COLORS.primary} />
            <StatCard title="Day Streak" value="5 Days" icon="flame" color="#FF7043" />
            <StatCard title="Badges" value="12" icon="trophy" color={COLORS.success} />
          </View>

          {/* 5. ACHIEVEMENTS SECTION */}
          <Text style={styles.sectionTitle}>Achievements 🏆</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.badgeRow}
          >
            {[
              { name: 'First Win', icon: 'ribbon', color: '#FFD700' },
              { name: 'Perfect Score', icon: 'checkmark-circle', color: COLORS.primary },
              { name: '5-Day Streak', icon: 'flame', color: '#FF7043' },
              { name: 'Math Master', icon: 'calculator', color: COLORS.success },
            ].map((badge, i) => (
              <View key={i} style={styles.badgeItem}>
                <View style={styles.badgeCircle}>
                   <Ionicons name={badge.icon} size={32} color={badge.color} />
                </View>
                <Text style={styles.badgeLabel}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Extra padding at bottom so nothing is hidden by the tabs */}
          <View style={{ height: 100 }} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  // FIXED: Added padding for the Top Notch on Android
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
    letterSpacing: -1 
  },
  
  // XP CARD STYLES
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
  
  // CUSTOM PROGRESS BAR STYLES
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
    // Add a slight shine to the progress bar
    borderRightWidth: 4,
    borderRightColor: 'rgba(255,255,255,0.3)'
  },
  milestoneText: { 
    marginTop: 12, 
    fontSize: 13, 
    color: '#78909C', 
    fontWeight: 'bold',
    textAlign: 'center' 
  },

  // GRID STYLES
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
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5,
  },
  iconCircle: { 
    width: 54, height: 54, borderRadius: 27, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 12 
  },
  statValue: { fontSize: 20, fontWeight: '900', color: '#455A64' },
  statLabel: { fontSize: 12, fontWeight: '900', color: '#B0BEC5', letterSpacing: 0.5 },

  // ACHIEVEMENTS STYLES
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
    borderWidth: 2,
    borderColor: '#F5F5F5'
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