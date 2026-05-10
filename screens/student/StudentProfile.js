import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, StatusBar, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const StudentProfile = ({ navigation }) => {
  const [inviteCode, setInviteCode] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleConnect = () => {
    if (inviteCode.length > 0) {
      setShowSuccess(true);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.profileHeader}>
            <View style={styles.avatarLarge}><Text style={{fontSize: 50}}>🧒</Text></View>
            <Text style={styles.name}>Angel Garcia</Text>
          </View>

          {/* TEACHER CONNECTION SECTION */}
          <View style={styles.whiteCard}>
            <Text style={styles.cardTitle}>Link to Teacher 🔗</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Enter Teacher ID" 
              placeholderTextColor="#B0BEC5"
              value={inviteCode}
              onChangeText={setInviteCode}
            />
            <TouchableOpacity style={styles.connectBtn} onPress={handleConnect}>
              <Text style={styles.connectBtnText}>CONNECT</Text>
            </TouchableOpacity>
          </View>

          {/* TEACHER FEEDBACK SECTION */}
          <Text style={styles.sectionTitle}>Messages from Teacher 💬</Text>
          <View style={styles.feedbackCard}>
              <View style={styles.feedbackTop}>
                  <Text style={styles.teacherName}>Ms. Garcia</Text>
                  <View style={styles.statusTag}><Text style={styles.statusText}>ACTIVE READER</Text></View>
              </View>
              <Text style={styles.msg}>Great job on Level 1! Your pronunciation is getting much clearer. 🌟</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Welcome')}>
            <Ionicons name="log-out" size={20} color="#FF5252" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>

      {/* SUCCESS POPUP */}
      <Modal visible={showSuccess} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <LinearGradient colors={['#78C800', '#4CAF50']} style={styles.successCard}>
                  <MaterialCommunityIcons name="party-popper" size={80} color="white" />
                  <Text style={styles.successTitle}>CONNECTED SUCCESSFULLY!</Text>
                  <Text style={styles.successSub}>You are now part of Ms. Garcia's class! ✨</Text>
                  <TouchableOpacity style={styles.popBtn} onPress={() => setShowSuccess(false)}>
                      <Text style={styles.popBtnText}>AWESOME!</Text>
                  </TouchableOpacity>
              </LinearGradient>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scroll: { padding: 25 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  name: { fontSize: 26, fontWeight: '900', color: '#455A64', marginTop: 10 },
  whiteCard: { backgroundColor: 'white', padding: 20, borderRadius: 25, elevation: 5, marginBottom: 25 },
  cardTitle: { fontWeight: '900', color: '#455A64', marginBottom: 15 },
  input: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#ECEFF1', marginBottom: 10, color: '#000', fontWeight: 'bold' },
  connectBtn: { backgroundColor: COLORS.primary, padding: 15, borderRadius: 15, alignItems: 'center' },
  connectBtnText: { color: 'white', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#546E7A', marginBottom: 15 },
  feedbackCard: { backgroundColor: 'white', padding: 20, borderRadius: 25, elevation: 4, borderLeftWidth: 6, borderLeftColor: '#78C800' },
  feedbackTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  teacherName: { fontWeight: '900', color: COLORS.primary },
  statusTag: { backgroundColor: '#E8F5E9', padding: 5, borderRadius: 8 },
  statusText: { fontSize: 8, fontWeight: '900', color: '#388E3C' },
  msg: { color: '#607D8B', fontWeight: '600', lineHeight: 20 },
  logoutBtn: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  logoutText: { color: '#FF5252', fontWeight: 'bold', marginLeft: 8 },
  
  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  successCard: { borderRadius: 40, padding: 40, alignItems: 'center', elevation: 20 },
  successTitle: { color: 'white', fontSize: 24, fontWeight: '900', textAlign: 'center', marginTop: 20 },
  successSub: { color: 'white', fontSize: 14, textAlign: 'center', marginTop: 10, opacity: 0.9 },
  popBtn: { backgroundColor: 'white', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 20, marginTop: 30 },
  popBtnText: { color: '#4CAF50', fontWeight: '900' }
});

export default StudentProfile;