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
        <ScrollView contentContainerStyle={styles.content}>
          
          <View style={styles.avatarGlow}>
            <View style={styles.avatarInner}><Text style={{ fontSize: 60 }}>👩‍🏫</Text></View>
          </View>
          <Text style={styles.name}>Ms. Garcia</Text>
          <Text style={styles.roleLabel}>Grade 1 Teacher</Text>

          <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>YOUR TEACHER CODE</Text>
              <Text style={styles.codeText}>READ-T-7721</Text>
              <TouchableOpacity style={styles.genBtn}><Text style={styles.genBtnText}>GENERATE NEW CODE</Text></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Welcome')}>
            <Ionicons name="log-out" size={22} color="#FF5252" />
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  content: { alignItems: 'center', padding: 25 },
  avatarGlow: { width: 130, height: 130, borderRadius: 65, padding: 5, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 28, fontWeight: '900', color: COLORS.text },
  roleLabel: { fontSize: 14, color: COLORS.muted, fontWeight: 'bold', marginBottom: 30 },
  codeCard: { backgroundColor: 'white', width: '100%', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 8 },
  codeLabel: { color: COLORS.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1, marginBottom: 10 },
  codeText: { color: COLORS.primary, fontSize: 32, fontWeight: '900', letterSpacing: 2, marginBottom: 20 },
  genBtn: { backgroundColor: '#F5F5F5', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 15 },
  genBtnText: { color: COLORS.text, fontWeight: 'bold', fontSize: 12 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 100 },
  logoutText: { color: '#FF5252', fontWeight: '900', marginLeft: 10, fontSize: 16 }
});

export default TeacherProfile;