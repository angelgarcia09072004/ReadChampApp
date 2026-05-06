import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar, 
  Platform, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const StudentDetail = ({ route, navigation }) => {
  // Get student data from navigation params
  const { student } = route.params || { student: { name: 'Student', level: 1, progress: 0 } };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* 1. BACKGROUND GRADIENT */}
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        {/* 2. TOP NAVIGATION */}
        <View style={styles.topNav}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={28} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Student Dashboard</Text>
            <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
          
          {/* 3. MAIN STUDENT INFO CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}>
                <Text style={{ fontSize: 60 }}>🧒</Text>
            </View>
            <Text style={styles.studentName}>{student.name.toUpperCase()}</Text>
            <View style={styles.chipRow}>
                <View style={[styles.chip, { backgroundColor: COLORS.primary }]}>
                    <Text style={styles.chipText}>LEVEL {student.level}</Text>
                </View>
                <View style={[styles.chip, { backgroundColor: COLORS.success }]}>
                    <Text style={styles.chipText}>ACTIVE READER</Text>
                </View>
            </View>
          </View>

          {/* 4. PROGRESS SECTION */}
          <Text style={styles.sectionLabel}>PROGRESS OVERVIEW</Text>
          <View style={styles.card}>
            <View style={styles.xpRow}>
                <Text style={styles.xpTitle}>Course Completion</Text>
                <Text style={styles.xpValue}>{student.progress}%</Text>
            </View>
            <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${student.progress}%` }]} />
            </View>
            <Text style={styles.xpSubtitle}>Keep it up! Almost at Level {student.level + 1} 🚀</Text>
          </View>

          {/* 5. STATS GRID (Stars & Points) */}
          <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                  <Ionicons name="star" size={30} color={COLORS.warning} />
                  <Text style={styles.statNumber}>1,240</Text>
                  <Text style={styles.statDesc}>Total XP</Text>
              </View>
              <View style={styles.statBox}>
                  <Ionicons name="trophy" size={30} color="#FF7043" />
                  <Text style={styles.statNumber}>15</Text>
                  <Text style={styles.statDesc}>Stars Won</Text>
              </View>
          </View>

          {/* 6. ACHIEVEMENTS SECTION */}
          <Text style={styles.sectionLabel}>BADGES EARNED 🏆</Text>
          <View style={styles.badgesCard}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {['ribbon', 'medal', 'school', 'rocket'].map((icon, index) => (
                    <View key={index} style={styles.badgeCircle}>
                        <MaterialCommunityIcons name={icon} size={35} color={COLORS.primary} />
                    </View>
                  ))}
              </ScrollView>
          </View>

          {/* 7. QUICK ACTION BUTTONS */}
          <View style={styles.actionRow}>
              <TouchableOpacity style={styles.feedbackBtn}>
                  <Text style={styles.actionBtnText}>GIVE REWARD 🎁</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.feedbackBtn, {backgroundColor: COLORS.primary}]}>
                  <Text style={styles.actionBtnText}>SEND FEEDBACK</Text>
              </TouchableOpacity>
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollPadding: { padding: 20 },
  topNav: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    marginBottom: 10
  },
  backBtn: { padding: 8, backgroundColor: 'white', borderRadius: 15, elevation: 2 },
  navTitle: { fontSize: 18, fontWeight: '900', color: COLORS.text },

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
    width: 120, height: 120, borderRadius: 60, 
    backgroundColor: '#F5F5F5', justifyContent: 'center', 
    alignItems: 'center', marginBottom: 15,
    borderWidth: 5, borderColor: '#E1F5FE'
  },
  studentName: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginBottom: 10, textAlign: 'center' },
  chipRow: { flexDirection: 'row', gap: 10 },
  chip: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20 },
  chipText: { color: 'white', fontWeight: 'bold', fontSize: 11 },

  sectionLabel: { fontSize: 14, fontWeight: '900', color: COLORS.muted, marginBottom: 15, letterSpacing: 1 },
  card: { backgroundColor: 'white', borderRadius: 25, padding: 20, elevation: 4, marginBottom: 20 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  xpTitle: { fontWeight: 'bold', color: COLORS.text },
  xpValue: { fontWeight: '900', color: COLORS.success },
  progressBarBg: { height: 14, backgroundColor: '#F0F0F0', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 7 },
  xpSubtitle: { marginTop: 10, fontSize: 11, color: COLORS.muted, fontWeight: 'bold', textAlign: 'center' },

  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { backgroundColor: 'white', width: '47%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 4 },
  statNumber: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginTop: 5 },
  statDesc: { fontSize: 11, fontWeight: 'bold', color: COLORS.muted },

  badgesCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, elevation: 4, marginBottom: 25 },
  badgeCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },

  actionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  feedbackBtn: { flex: 1, backgroundColor: COLORS.warning, padding: 18, borderRadius: 20, alignItems: 'center', elevation: 4 },
  actionBtnText: { color: 'white', fontWeight: '900', fontSize: 12 }
});

export default StudentDetail;