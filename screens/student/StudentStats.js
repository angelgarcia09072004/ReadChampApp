import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  StatusBar, 
  Platform, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width } = Dimensions.get('window');

const StudentStats = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/user')
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        console.log("Using mock stats for preview");
        setUser({ name: "Angel Garcia", points: 320, level: 5 });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  // Calculate progress based on points (Example: 1000 XP per level)
  const progressPercent = Math.min((user.points / 1000) * 100, 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* 1. BACKGROUND GRADIENT */}
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          
          <Text style={styles.headerTitle}>My Progress 📈</Text>

          {/* 2. MAIN PROFILE CARD (Same as Teacher View) */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
              <Text style={{ fontSize: 60 }}>🧒</Text>
            </View>
            <Text style={styles.studentName}>{user.name ? user.name.toUpperCase() : "CHAMPION"}</Text>
            <View style={styles.chipRow}>
              <View style={[styles.chip, { backgroundColor: COLORS.primary }]}>
                <Text style={styles.chipText}>LEVEL {user.level}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: COLORS.success }]}>
                <Text style={styles.chipText}>ACTIVE READER</Text>
              </View>
            </View>
          </View>

          {/* 3. PROGRESS SECTION */}
          <Text style={styles.sectionLabel}>LEVEL GOAL 🚀</Text>
          <View style={styles.card}>
            <View style={styles.xpRow}>
              <Text style={styles.xpTitle}>Next Level Progress</Text>
              <Text style={styles.xpValue}>{user.points} XP</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.xpSubtitle}>Keep going! You are doing great!</Text>
          </View>

          {/* 4. STATS GRID */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Ionicons name="star" size={30} color="#FFD700" />
              <Text style={styles.statNumber}>{user.points}</Text>
              <Text style={styles.statDesc}>Total XP</Text>
            </View>
            <View style={styles.statBox}>
              <Ionicons name="flame" size={30} color="#FF7043" />
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statDesc}>Day Streak</Text>
            </View>
          </View>

          {/* 5. ACHIEVEMENTS SECTION */}
          <Text style={styles.sectionLabel}>MY BADGES 🏆</Text>
          <View style={styles.badgesCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['ribbon', 'medal', 'school', 'rocket', 'star'].map((icon, index) => (
                <View key={index} style={styles.badgeCircle}>
                  <MaterialCommunityIcons name={icon} size={35} color={COLORS.primary} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Padding for bottom tabs */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1 },
  scrollPadding: { padding: 25 },
  headerTitle: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: COLORS.text, 
    marginBottom: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10 
  },

  profileCard: { 
    backgroundColor: 'white', 
    borderRadius: 35, 
    padding: 30, 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
    marginBottom: 25
  },
  avatarLarge: { 
    width: 110, height: 110, borderRadius: 55, 
    backgroundColor: '#F5F5F5', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 15,
    borderWidth: 5, borderColor: '#E1F5FE'
  },
  studentName: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginBottom: 10, textAlign: 'center' },
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  chipText: { color: 'white', fontWeight: 'bold', fontSize: 11 },

  sectionLabel: { fontSize: 13, fontWeight: '900', color: '#90A4AE', marginBottom: 15, letterSpacing: 1 },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 20, elevation: 4, marginBottom: 25 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  xpTitle: { fontWeight: 'bold', color: COLORS.text },
  xpValue: { fontWeight: '900', color: COLORS.primary },
  progressBarBg: { height: 14, backgroundColor: '#F0F0F0', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 7 },
  xpSubtitle: { marginTop: 10, fontSize: 11, color: '#B0BEC5', fontWeight: 'bold', textAlign: 'center' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: 'white', width: '47%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 4 },
  statNumber: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginTop: 5 },
  statDesc: { fontSize: 11, fontWeight: 'bold', color: '#B0BEC5' },

  badgesCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, elevation: 4, marginBottom: 25 },
  badgeCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
});

export default StudentStats;