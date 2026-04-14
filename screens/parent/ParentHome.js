import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const ParentHome = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.subGreeting}>Welcome back, Parents! 👋</Text>
          <Text style={styles.greeting}>Child's Progress</Text>

          <View style={styles.childCard}>
            <View style={styles.childHeader}>
              <View style={styles.avatarLarge}><Text style={{fontSize: 40}}>🧒</Text></View>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.childName}>Angel Garcia</Text>
                <Text style={styles.childLevel}>Level 5 • Champion 🏆</Text>
              </View>
              <View style={styles.streakBadge}><Text style={styles.streakText}>🔥 5</Text></View>
            </View>
            <View style={styles.xpContainer}>
              <View style={styles.xpTextRow}><Text style={styles.xpLabel}>EXP Progress</Text><Text style={styles.xpValue}>320 / 500</Text></View>
              <View style={styles.progressBarBg}><View style={[styles.progressBarFill, { width: '64%' }]} /></View>
            </View>
          </View>

          <View style={styles.grid}>
             <View style={styles.statCard}><Ionicons name="star" size={20} color="#FFB300" /><Text style={styles.statVal}>1.2k</Text><Text style={styles.statLabel}>Points</Text></View>
             <View style={styles.statCard}><Ionicons name="time" size={20} color={COLORS.primary} /><Text style={styles.statVal}>45m</Text><Text style={styles.statLabel}>Learning</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Recent Activity 🕒</Text>
          <View style={styles.activityBox}>
            <View style={styles.activityItem}><Ionicons name="checkmark-circle" size={20} color={COLORS.success} /><Text style={styles.activityText}>Finished "Syllable Splash"</Text></View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scrollContent: { padding: 25 },
  greeting: { fontSize: 32, fontWeight: '900', color: '#455A64', marginBottom: 20 },
  subGreeting: { fontSize: 14, color: '#90A4AE', fontWeight: 'bold' },
  childCard: { backgroundColor: 'white', borderRadius: 30, padding: 20, elevation: 8 },
  childHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center' },
  childName: { fontSize: 22, fontWeight: '900', color: '#455A64' },
  childLevel: { fontSize: 14, color: '#78909C', fontWeight: 'bold' },
  streakBadge: { backgroundColor: '#FFF3E0', padding: 8, borderRadius: 15 },
  streakText: { color: '#FF9800', fontWeight: 'bold' },
  xpContainer: { marginTop: 10 },
  xpTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpLabel: { fontSize: 12, fontWeight: 'bold', color: '#90A4AE' },
  xpValue: { fontSize: 12, fontWeight: '900', color: COLORS.primary },
  progressBarBg: { height: 12, backgroundColor: '#F5F5F5', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  statCard: { backgroundColor: 'white', width: '48%', padding: 15, borderRadius: 20, elevation: 4, alignItems: 'center' },
  statVal: { fontSize: 18, fontWeight: '900', color: '#455A64' },
  statLabel: { fontSize: 11, color: '#B0BEC5', fontWeight: 'bold' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#455A64', marginTop: 30, marginBottom: 15 },
  activityBox: { backgroundColor: 'white', borderRadius: 25, padding: 15 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5 },
  activityText: { marginLeft: 10, color: '#607D8B', fontWeight: '600' }
});

export default ParentHome;