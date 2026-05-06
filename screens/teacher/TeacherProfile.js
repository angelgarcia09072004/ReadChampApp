import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const TeacherProfile = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          
          {/* STUDENT DETAIL CARD */}
          <Text style={styles.label}>LAST VIEWED STUDENT</Text>
          <View style={styles.profileCard}>
            <View style={styles.cardHeader}>
                <View style={styles.avatarLarge}><Text style={{fontSize: 30}}>🧒</Text></View>
                <Text style={styles.studentTitle}>ANGEL ANNE GARCIA</Text>
            </View>
            <View style={styles.statsGrid}>
                <View style={styles.statChip}><Text style={styles.chipVal}>LEVEL 3</Text><Text style={styles.chipLabel}>490/1000 XP</Text></View>
                <View style={styles.statChip}><Text style={styles.chipVal}>ACTIVE</Text><Text style={styles.chipLabel}>READER</Text></View>
            </View>
            <View style={styles.progressRow}>
                <Text style={styles.progressText}>75% COMPLETE</Text>
                <View style={styles.pBarBg}><View style={[styles.pBarFill, {width: '75%'}]} /></View>
            </View>
          </View>

          {/* TEACHER CODE */}
          <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>YOUR TEACHER CODE</Text>
              <Text style={styles.codeText}>READ-T-7721</Text>
              <TouchableOpacity style={styles.genBtn}><Text style={styles.genBtnText}>GENERATE NEW CODE</Text></TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => navigation.replace('Welcome')}
          >
            <Ionicons name="log-out" size={20} color="#FF5252" />
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  container: { padding: 25, alignItems: 'center' },
  label: { alignSelf: 'flex-start', fontWeight: '900', color: '#90A4AE', marginBottom: 10, fontSize: 12 },
  profileCard: { backgroundColor: 'white', width: '100%', borderRadius: 30, padding: 25, elevation: 8, marginBottom: 25 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarLarge: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  studentTitle: { fontSize: 18, fontWeight: '900', color: '#455A64' },
  statsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statChip: { flex: 1, backgroundColor: '#F7F7F7', padding: 12, borderRadius: 20, alignItems: 'center' },
  chipVal: { fontWeight: '900', color: COLORS.primary, fontSize: 14 },
  chipLabel: { fontSize: 10, color: '#90A4AE', fontWeight: 'bold' },
  progressRow: { width: '100%' },
  progressText: { fontSize: 10, fontWeight: '900', color: '#78909C', marginBottom: 8 },
  pBarBg: { height: 10, backgroundColor: '#F0F0F0', borderRadius: 5 },
  pBarFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 5 },
  codeCard: { backgroundColor: COLORS.primary, width: '100%', borderRadius: 30, padding: 25, alignItems: 'center', elevation: 5 },
  codeLabel: { color: 'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8, marginBottom: 10 },
  codeText: { color: 'white', fontSize: 28, fontWeight: '900', letterSpacing: 2, marginBottom: 15 },
  genBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 15 },
  genBtnText: { color: 'white', fontWeight: 'bold', fontSize: 11 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 30 },
  logoutText: { color: '#FF5252', fontWeight: '900', marginLeft: 8 }
});

export default TeacherProfile;