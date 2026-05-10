import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar, Platform, Modal, TextInput, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';

const { width } = Dimensions.get('window');

const FEEDBACK_PRESETS = {
  'Active Reader': ["Good Job! Keep It Up!", "You're Awesome!", "Good Effort!", "Your Progress Is Awesome!", "Great Memory!", "Nice Progress!"],
  'Needs Help': ["Speak Louder Next Time!", "Practice More!", "Check Your Letters", "Almost Correct", "Try Again", "You Can Do It!"]
};

const StudentDetail = ({ route, navigation }) => {
  const { student } = route.params;
  const [feedbackModal, setFeedbackModal] = useState(false);
  const [feedbackType, setFeedbackType] = useState('Active Reader');
  const [tempMsg, setTempMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = () => {
    setFeedbackModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
            <Text style={styles.title}>Student Dashboard</Text>
            <View style={{width: 45}} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <View style={styles.profileCard}>
            <View style={styles.avatarLarge}><Ionicons name="person" size={50} color={COLORS.primary} /></View>
            <Text style={styles.stName}>{student.name.toUpperCase()}</Text>
            <View style={styles.chip}><Text style={styles.chipText}>LEVEL {student.level}</Text></View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
                <Ionicons name="star" size={30} color="#FFD700" />
                <Text style={styles.statNumber}>{student.xp || 150}</Text>
                <Text style={styles.statDesc}>Total XP</Text>
            </View>
            <View style={styles.statBox}>
                <Ionicons name="flame" size={30} color="#FF7043" />
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statDesc}>Day Streak</Text>
            </View>
          </View>
          
          <Text style={styles.label}>BADGES EARNED</Text>
          <View style={styles.badgesRow}>
              {['cat', 'pin', 'dog'].map(icon => (
                <View key={icon} style={styles.badgeCircle}><MaterialCommunityIcons name={icon} size={30} color={COLORS.primary} /></View>
              ))}
          </View>

          <TouchableOpacity style={styles.feedbackBtn} onPress={() => setFeedbackModal(true)}>
              <Text style={styles.feedbackBtnText}>SEND FEEDBACK</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      {/* FEEDBACK MODAL */}
      <Modal visible={feedbackModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Give Feedback ✨</Text>
            <View style={styles.tabRow}>
                <TouchableOpacity style={[styles.tab, feedbackType === 'Active Reader' && {backgroundColor: COLORS.success}]} onPress={() => setFeedbackType('Active Reader')}><Text style={[styles.tabText, feedbackType === 'Active Reader' && {color:'white'}]}>ACTIVE</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.tab, feedbackType === 'Needs Help' && {backgroundColor: '#FF5252'}]} onPress={() => setFeedbackType('Needs Help')}><Text style={[styles.tabText, feedbackType === 'Needs Help' && {color:'white'}]}>NEEDS HELP</Text></TouchableOpacity>
            </View>
            <View style={styles.presetGrid}>
                {FEEDBACK_PRESETS[feedbackType].map(p => (
                    <TouchableOpacity key={p} style={[styles.phraseBtn, tempMsg === p && {backgroundColor: COLORS.primary}]} onPress={() => setTempMsg(p)}>
                        <Text style={[styles.phraseText, tempMsg === p && {color: 'white'}]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TextInput style={styles.input} placeholder="Type custom message..." multiline value={tempMsg} onChangeText={setTempMsg} />
            <GameButton title="SEND FEEDBACK" color={COLORS.primary} onPress={handleSend} />
            <TouchableOpacity onPress={() => setFeedbackModal(false)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS POPUP */}
      <Modal visible={showSuccess} transparent animationType="fade">
          <View style={styles.successOverlay}><LinearGradient colors={[COLORS.success, '#8BC34A']} style={styles.successCard}><Ionicons name="checkmark-circle" size={40} color="white" /><Text style={styles.successText}>SENT SUCCESSFULLY! ✨</Text></LinearGradient></View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  backBtn: { backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 4 },
  title: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  scroll: { padding: 25 },
  profileCard: { backgroundColor: 'white', borderRadius: 35, padding: 30, alignItems: 'center', elevation: 5, marginBottom: 25 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  stName: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 10 },
  chip: { backgroundColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15 },
  chipText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: 'white', width: '48%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 4 },
  statNumber: { fontSize: 22, fontWeight: '900', color: COLORS.text },
  statDesc: { fontSize: 11, fontWeight: 'bold', color: '#B0BEC5' },
  label: { fontSize: 12, fontWeight: '900', color: '#90A4AE', marginBottom: 15 },
  badgesRow: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  badgeCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', elevation: 3, justifyContent: 'center', alignItems: 'center' },
  feedbackBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 20, alignItems: 'center' },
  feedbackBtnText: { color: 'white', fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 35, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', color: COLORS.text, marginBottom: 15 },
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  tab: { flex: 1, padding: 10, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center' },
  tabText: { fontWeight: '900', fontSize: 10, color: '#B0BEC5' },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  phraseBtn: { backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ECEFF1' },
  phraseText: { fontSize: 9, fontWeight: 'bold', color: '#78909C' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 12, height: 60, textAlignVertical: 'top', marginBottom: 15 },
  cancelText: { textAlign: 'center', marginTop: 15, fontWeight: '900', color: '#455A64', fontSize: 13 },
  successOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successCard: { padding: 30, borderRadius: 30, alignItems: 'center', elevation: 10, width: width * 0.8 },
  successText: { color: 'white', fontWeight: '900', marginTop: 10 }
});

export default StudentDetail;