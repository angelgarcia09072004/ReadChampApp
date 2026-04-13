import React, { useState, useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, 
  Platform, TouchableOpacity, Animated, Dimensions, Modal 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

// --- Interactive Card Component ---
const PressableCard = ({ children, style, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const onPressIn = () => Animated.spring(scaleValue, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();

  return (
    <TouchableOpacity activeOpacity={1} onPressIn={onPressIn} onPressOut={onPressOut} onPress={onPress}>
      <Animated.View style={[style, { transform: [{ scale: scaleValue }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const TeacherHome = ({ navigation }) => {
  const [fabOpen, setFabOpen] = useState(false);
  const floatAnim = useRef(new Animated.Value(0)).current;

  // Floating effect for cards
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 2000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

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
              <Text style={styles.subGreeting}>Good morning! Class overview</Text>
            </View>
            <PressableCard style={styles.notifBtn}>
              <Ionicons name="notifications" size={24} color={COLORS.primary} />
            </PressableCard>
          </View>

          {/* CROWN SECTION (TOP STUDENT) */}
          <PressableCard style={styles.topStudentCard}>
             <LinearGradient colors={['#FFD700', '#FFA000']} style={styles.crownGradient}>
                <MaterialCommunityIcons name="crown" size={30} color="white" />
                <View style={{marginLeft: 15}}>
                    <Text style={styles.crownText}>Weekly Champion</Text>
                    <Text style={styles.topStudentName}>Angel Garcia • 1,240 XP</Text>
                </View>
             </LinearGradient>
          </PressableCard>

          {/* DASHBOARD STATS */}
          <View style={styles.grid}>
            {[
                { label: 'Students', val: '24', icon: 'people', color: COLORS.primary },
                { label: 'Active', val: '18', icon: 'flash', color: COLORS.success },
            ].map((stat, i) => (
                <PressableCard key={i} style={styles.statCard}>
                    <Ionicons name={stat.icon} size={24} color={stat.color} />
                    <Text style={styles.statValue}>{stat.val}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                </PressableCard>
            ))}
          </View>

          {/* STUDENT PREVIEW */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Students Progress</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Students')}>
                <Text style={styles.viewAll}>View All ➔</Text>
            </TouchableOpacity>
          </View>

          <Animated.View style={{ transform: [{ translateY: floatAnim }] }}>
              <PressableCard style={styles.studentPreviewCard}>
                <View style={styles.avatarMini}><Text>🧒</Text></View>
                <View style={{flex: 1, marginLeft: 12}}>
                    <Text style={styles.studentName}>Angel Garcia</Text>
                    <View style={styles.xpBarBg}>
                        <View style={[styles.xpBarFill, { width: '70%' }]} />
                    </View>
                </View>
                <View style={styles.statusDot} />
              </PressableCard>
          </Animated.View>

        </ScrollView>
      </SafeAreaView>

      {/* FLOATING ACTION BUTTON (FAB) */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setFabOpen(!fabOpen)}
      >
        <LinearGradient colors={[COLORS.primary, '#64B5F6']} style={styles.fabGradient}>
            <Ionicons name={fabOpen ? "close" : "add"} size={30} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      {/* QUICK ACTIONS MENU */}
      {fabOpen && (
          <View style={styles.fabMenu}>
              <TouchableOpacity style={styles.fabMenuItem}><Text style={styles.fabLabel}>Add Student</Text><Ionicons name="person-add" size={20} color="white"/></TouchableOpacity>
              <TouchableOpacity style={styles.fabMenuItem}><Text style={styles.fabLabel}>Create Task</Text><Ionicons name="book" size={20} color="white"/></TouchableOpacity>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scrollContent: { padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 26, fontWeight: '900', color: '#455A64' },
  subGreeting: { fontSize: 14, color: '#90A4AE', fontWeight: 'bold' },
  notifBtn: { backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 5 },
  
  topStudentCard: { marginBottom: 20, elevation: 10 },
  crownGradient: { padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center' },
  crownText: { color: 'rgba(255,255,255,0.8)', fontWeight: 'bold', fontSize: 12 },
  topStudentName: { color: 'white', fontWeight: '900', fontSize: 18 },

  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { backgroundColor: 'white', width: '47%', padding: 20, borderRadius: 25, elevation: 4, alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '900', color: '#455A64', marginTop: 5 },
  statLabel: { fontSize: 12, fontWeight: 'bold', color: '#B0BEC5' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#455A64' },
  viewAll: { color: COLORS.primary, fontWeight: '900' },

  studentPreviewCard: { backgroundColor: 'white', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 3 },
  avatarMini: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  studentName: { fontWeight: '900', color: '#455A64', marginBottom: 5 },
  xpBarBg: { height: 8, backgroundColor: '#F0F0F0', borderRadius: 4 },
  xpBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 4 },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, marginLeft: 10 },

  fab: { position: 'absolute', bottom: 30, right: 30, elevation: 10 },
  fabGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabMenu: { position: 'absolute', bottom: 100, right: 30, alignItems: 'flex-end' },
  fabMenuItem: { backgroundColor: COLORS.primary, flexDirection: 'row', padding: 12, borderRadius: 20, marginBottom: 10, alignItems: 'center', elevation: 5 },
  fabLabel: { color: 'white', fontWeight: 'bold', marginRight: 10 }
});

export default TeacherHome;