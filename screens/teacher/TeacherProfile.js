import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  StatusBar, Platform, Dimensions, ScrollView 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const TeacherProfile = ({ navigation }) => {
  // In a real app, this ID comes from your Database (User ID)
  const teacherID = "READ-T-7721"; 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          
          {/* 1. TEACHER AVATAR */}
          <View style={styles.avatarContainer}>
            <LinearGradient colors={[COLORS.primary, '#9575CD']} style={styles.avatarGlow}>
                <View style={styles.avatarInner}>
                    <Text style={{ fontSize: 60 }}>👩‍🏫</Text>
                </View>
            </LinearGradient>
          </View>

          <Text style={styles.name}>Ms. Garcia</Text>
          <Text style={styles.roleLabel}>Classroom Mentor • Grade 1</Text>

          {/* 2. TEACHER ID / INVITE CODE (VERY IMPORTANT) */}
          <View style={styles.idCard}>
            <Text style={styles.cardLabel}>YOUR TEACHER ID</Text>
            <Text style={styles.idText}>{teacherID}</Text>
            <Text style={styles.idSubtext}>Give this code to your students to link accounts ✨</Text>
            
            <TouchableOpacity style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={20} color="white" />
                <Text style={styles.copyBtnText}>COPY CODE</Text>
            </TouchableOpacity>
          </View>

          {/* 3. TEACHER STATS */}
          <View style={styles.statsRow}>
            <View style={styles.smallStat}>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statDesc}>Students</Text>
            </View>
            <View style={styles.smallStat}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statDesc}>Tasks</Text>
            </View>
          </View>

          {/* LOGOUT */}
          <View style={styles.menuBox}>
              <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Welcome')}>
                 <Ionicons name="log-out-outline" size={22} color="#FF5252" />
                 <Text style={styles.logoutText}>Log Out</Text>
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
  content: { alignItems: 'center', padding: 25 },
  avatarContainer: { marginBottom: 15 },
  avatarGlow: { width: 130, height: 130, borderRadius: 65, padding: 5, justifyContent: 'center', alignItems: 'center' },
  avatarInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 28, fontWeight: '900', color: '#455A64' },
  roleLabel: { fontSize: 14, color: '#78909C', fontWeight: 'bold', marginBottom: 25 },

  idCard: {
    backgroundColor: 'white', width: '100%', borderRadius: 30, padding: 25, alignItems: 'center',
    elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  cardLabel: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', letterSpacing: 1, marginBottom: 10 },
  idText: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: 2, marginBottom: 5 },
  idSubtext: { fontSize: 12, color: '#90A4AE', textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  copyBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 15, alignItems: 'center' },
  copyBtnText: { color: 'white', fontWeight: '900', marginLeft: 10, fontSize: 14 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
  smallStat: { backgroundColor: 'rgba(255,255,255,0.5)', width: '47%', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: 'white' },
  statNumber: { fontSize: 20, fontWeight: '900', color: '#455A64' },
  statDesc: { fontSize: 12, color: '#90A4AE', fontWeight: 'bold' },

  menuBox: { backgroundColor: 'white', width: '100%', borderRadius: 25, marginTop: 25, paddingHorizontal: 20 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  menuText: { marginLeft: 15, fontSize: 16, fontWeight: 'bold', color: '#455A64' }
});

export default TeacherProfile;