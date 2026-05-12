import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Modal, TextInput, StatusBar, Platform, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';

const FEEDBACK_PRESETS = {
  'Active Reader': ["Good Job! Keep It Up!", "You're Awesome!", "Good Effort!", "Your Progress Is Awesome!", "Great Memory!", "Nice Progress!"],
  'Needs Help': ["Speak Louder Next Time!", "Practice More!", "Check Your Letters", "Almost Correct", "Try Again", "You Can Do It!"]
};

const TeacherStudents = ({ route, navigation }) => {
  // SAFETY CHECK: If navigated from Tab Bar, use default list
  const { allStudents, setGlobalStudents } = route.params || {};
  
  const [students, setStudents] = useState(allStudents || [
    { id: '1', name: 'Angel Anne Garcia', room: 'ROOM 1', status: 'Active Reader' },
    { id: '2', name: 'Shaine Roxanne Eceja', room: 'ROOM 2', status: 'Active Reader' },
    { id: '3', name: 'Prince Lawrence San Miguel', room: 'ROOM 1', status: 'Needs Help' },
    { id: '4', name: 'Mina Chaeyoungie', room: 'ROOM 3', status: 'Needs Help' },
    { id: '5', name: 'Minatozaki Tzuyu', room: 'ROOM 2', status: 'Active Reader' },
    { id: '6', name: 'Apple Ace Garcia', room: 'ROOM 1', status: 'Active Reader' },
    { id: '7', name: 'Felicity Yvonne Maninang', room: 'ROOM 3', status: 'Needs Help' },
  ]);

  const [activeModal, setActiveModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackType, setFeedbackType] = useState('Active Reader');
  const [tempMsg, setTempMsg] = useState('');

  const handleUpdate = (newList) => {
    setStudents(newList);
    // ONLY call this if it was passed from Dashboard
    if (typeof setGlobalStudents === 'function') {
        setGlobalStudents(newList);
    }
    setActiveModal('success');
    setTimeout(() => setActiveModal(null), 1500);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Manage Students</Text>
          <FlatList 
            data={students}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('StudentDetail', { student: item })}>
                  <Text style={styles.stName}>{item.name}</Text>
                  <Text style={[styles.stRoom, { color: item.room === 'Unassigned' ? '#FF5252' : COLORS.muted }]}>
                    {item.room === 'Unassigned' ? 'Not Assigned' : item.room}
                  </Text>
                </TouchableOpacity>
                <View style={styles.iconCol}>
                  <TouchableOpacity onPress={() => { setSelectedStudent(item); setActiveModal('assign'); }}><Ionicons name="add-circle-outline" size={26} color={COLORS.success} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => { setSelectedStudent(item); setFeedbackType('Active Reader'); setTempMsg(''); setActiveModal('feedback'); }}><Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} /></TouchableOpacity>
                  <TouchableOpacity onPress={() => { setSelectedStudent(item); setActiveModal('delete'); }}><Ionicons name="trash-outline" size={24} color="#FF5252" /></TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>

      {/* FEEDBACK MODAL */}
      <Modal visible={activeModal === 'feedback'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Give Feedback ✨</Text>
            <View style={styles.tabRow}>
                <TouchableOpacity style={[styles.tab, feedbackType === 'Active Reader' && {backgroundColor: COLORS.success}]} onPress={() => setFeedbackType('Active Reader')}><Text style={[styles.tabText, {color: 'white'}]}>ACTIVE</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.tab, feedbackType === 'Needs Help' && {backgroundColor: '#FF5252'}]} onPress={() => setFeedbackType('Needs Help')}><Text style={[styles.tabText, {color: 'white'}]}>NEEDS HELP</Text></TouchableOpacity>
            </View>
            <View style={styles.presetGrid}>
                {FEEDBACK_PRESETS[feedbackType].map(p => (
                    <TouchableOpacity key={p} style={[styles.phraseBtn, tempMsg === p && {backgroundColor: COLORS.primary}]} onPress={() => setTempMsg(p)}>
                        <Text style={[styles.phraseText, tempMsg === p && {color: 'white'}]}>{p}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <TextInput style={styles.input} placeholder="Type message..." multiline value={tempMsg} onChangeText={setTempMsg} />
            <GameButton title="SEND FEEDBACK" color={COLORS.primary} onPress={() => handleUpdate(students)} />
            <TouchableOpacity onPress={() => setActiveModal(null)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DELETE MODAL */}
      <Modal visible={activeModal === 'delete'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {alignItems:'center'}]}>
            <View style={styles.warnIcon}><Ionicons name="hand-right" size={40} color="white" /></View>
            <Text style={styles.modalTitle}>Wait! ✋</Text>
            <Text style={styles.modalSubText}>Remove {selectedStudent?.name} from the list?</Text>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.confirmBtn} onPress={() => handleUpdate(students.filter(s => s.id !== selectedStudent.id))}><Text style={styles.btnText}>YES, DELETE</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: COLORS.muted}]} onPress={() => setActiveModal(null)}>
                    <Text style={[styles.btnText, {color: '#455A64'}]}>CANCEL</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ASSIGN MODAL */}
      <Modal visible={activeModal === 'assign'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign Room 📍</Text>
            {['ROOM 1', 'ROOM 2', 'ROOM 3'].map(r => (
              <TouchableOpacity key={r} style={styles.optionBtn} onPress={() => handleUpdate(students.map(s => s.id === selectedStudent.id ? {...s, room: r} : s))}>
                <Text style={styles.optionText}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setActiveModal(null)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SUCCESS POPUP */}
      <Modal visible={activeModal === 'success'} transparent animationType="fade">
          <View style={styles.successOverlay}><LinearGradient colors={[COLORS.success, '#8BC34A']} style={styles.successCard}><Ionicons name="checkmark-circle" size={40} color="white" /><Text style={styles.successText}>SUCCESSFULLY UPDATED!</Text></LinearGradient></View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  container: { flex: 1, padding: 25 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 4 },
  stName: { fontSize: 15, fontWeight: '900', color: COLORS.text },
  stRoom: { fontSize: 11, fontWeight: 'bold', marginTop: 2 },
  iconCol: { gap: 12, borderLeftWidth: 1, borderLeftColor: '#F5F5F5', paddingLeft: 15, flexDirection: 'row', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 35, padding: 25 },
  modalTitle: { fontSize: 22, fontWeight: '900', textAlign: 'center', color: COLORS.text, marginBottom: 15 },
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  tab: { flex: 1, padding: 10, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center' },
  tabText: { color: '#B0BEC5', fontWeight: '900', fontSize: 10 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  phraseBtn: { backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ECEFF1' },
  phraseText: { fontSize: 9, fontWeight: 'bold', color: '#78909C' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 12, height: 60, textAlignVertical: 'top', marginBottom: 15 },
  warnIcon: { backgroundColor: '#FF5252', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15 },
  modalSubText: { textAlign: 'center', color: COLORS.muted, marginBottom: 20 },
  btnRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 1, backgroundColor: '#FF5252', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900' },
  optionBtn: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  optionText: { fontWeight: 'bold', color: COLORS.primary },
  cancelText: { textAlign: 'center', marginTop: 15, fontWeight: '900', color: '#455A64', fontSize: 13 },
  successOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  successCard: { padding: 30, borderRadius: 30, alignItems: 'center', elevation: 10 },
  successText: { color: 'white', fontWeight: '900', marginTop: 10 }
});

export default TeacherStudents;