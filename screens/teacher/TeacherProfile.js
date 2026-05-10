import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Platform, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const TeacherProfile = ({ navigation }) => {
  const [showToast, setShowToast] = useState(false);
  const teacherID = "READ-T-7721";

  const copyCode = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.avatarGlow}><View style={styles.avatarInner}><Ionicons name="person" size={60} color={COLORS.primary} /></View></View>
          <Text style={styles.name}>Ms. Garcia</Text>
          
          <View style={styles.codeCard}>
              <Text style={styles.codeLabel}>YOUR TEACHER CODE</Text>
              <View style={styles.codeRow}>
                <Text style={styles.codeText}>{teacherID}</Text>
                <TouchableOpacity onPress={copyCode}><Ionicons name="copy-outline" size={28} color="white" /></TouchableOpacity>
              </View>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Welcome')}>
            <Ionicons name="log-out-outline" size={22} color="#FF5252" /><Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {showToast && (
          <View style={styles.toast}>
              <LinearGradient colors={[COLORS.success, '#8BC34A']} style={styles.toastGradient}>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={styles.toastText}>COPIED SUCCESSFULLY!</Text>
              </LinearGradient>
          </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  content: { alignItems: 'center', padding: 25 },
  avatarGlow: { width: 130, height: 130, borderRadius: 65, padding: 5, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 30 },
  codeCard: { backgroundColor: COLORS.primary, width: '100%', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 8 },
  codeLabel: { color: 'white', fontSize: 11, fontWeight: '900', opacity: 0.8, marginBottom: 10 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  codeText: { color: 'white', fontSize: 32, fontWeight: '900', letterSpacing: 2 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 150 },
  logoutText: { color: '#FF5252', fontWeight: '900', marginLeft: 10, fontSize: 16 },
  toast: { position: 'absolute', bottom: 100, alignSelf: 'center' },
  toastGradient: { flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 30, alignItems: 'center', elevation: 10 },
  toastText: { color: 'white', fontWeight: '900', marginLeft: 10, fontSize: 12 }
});

export default TeacherProfile;