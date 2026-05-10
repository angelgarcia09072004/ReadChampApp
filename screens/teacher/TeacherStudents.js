import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, Modal, TextInput, StatusBar, Platform, Dimensions, Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';

const { width } = Dimensions.get('window');

const FEEDBACK_PRESETS = {
  'Active Reader': ["Good Job! Keep It Up!", "You're Awesome!", "Good Effort!", "Your Progress Is Awesome!", "Great Memory!", "Nice Progress!"],
  'Needs Help': ["Speak Louder Next Time!", "Practice More!", "Check Your Letters", "Almost Correct", "Try Again", "You Can Do It!"]
};

const TeacherStudents = ({ navigation }) => {
  const [students, setStudents] = useState([
    { id: '1', name: 'Angel Anne Garcia', room: 'ROOM 1', status: 'Active Reader', feedback: '' },
    { id: '2', name: 'Shaine Roxanne Eceja', room: 'ROOM 2', status: 'Active Reader', feedback: '' },
    { id: '3', name: 'Prince Lawrence San Miguel', room: 'ROOM 1', status: 'Needs Help', feedback: '' },
    { id: '4', name: 'Mina Chaeyoungie', room: 'Unassigned', status: 'Needs Help', feedback: '' },
    { id: '5', name: 'Minatozaki Tzuyu', room: 'ROOM 2', status: 'Active Reader', feedback: '' },
    { id: '6', name: 'Apple Ace Garcia', room: 'ROOM 1', status: 'Active Reader', feedback: '' },
    { id: '7', name: 'Felicity Yvonne Maninang', room: 'Unassigned', status: 'Needs Help', feedback: '' },
  ]);

  const [activeModal, setActiveModal] = useState(null); 
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [feedbackType, setFeedbackType] = useState('Active Reader');
  const [tempMsg, setTempMsg] = useState('');

  // --- HANDLERS ---
  const triggerSuccess = () => {
    setActiveModal('success');
    setTimeout(() => setActiveModal(null), 2000);
  };

  const handleAssign = (room) => {
    setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, room: room } : s));
    triggerSuccess();
  };

  const handleFeedback = () => {
    setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, status: feedbackType, feedback: tempMsg } : s));
    triggerSuccess();
  };

  const handleDelete = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    triggerSuccess();
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
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('StudentDetail', { student: item })}>
                  <Text style={styles.stName}>{item.name}</Text>
                  
                  {/* ROOM STATUS LOGIC */}
                  <Text style={[styles.stRoom, { color: item.room === 'Unassigned' ? '#FF5252' : COLORS.muted }]}>
                    <Ionicons name="location-outline" size={12} /> {item.room === 'Unassigned' ? 'Not Assigned' : item.room}
                  </Text>

                  {/* READING STATUS LOGIC */}
                  <Text style={[styles.stStatus, { color: item.status === 'Needs Help' ? '#FF5252' : COLORS.success }]}>
                    ● {item.status.toUpperCase()}
                  </Text>
                </TouchableOpacity>
                
                <View style={styles.iconCol}>
                  <TouchableOpacity onPress={() => { setSelectedStudent(item); setActiveModal('assign'); }}>
                    <Ionicons name="add-circle" size={26} color={COLORS.success} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.feedbackCircle}
                    onPress={() => { setSelectedStudent(item); setFeedbackType(item.status); setTempMsg(''); setActiveModal('feedback'); }}
                  >
                    <Ionicons name="chatbubble-ellipses" size={18} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => { setSelectedStudent(item); setActiveModal('delete'); }}>
                    <Ionicons name="trash" size={24} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>

      {/* --- MODAL: ASSIGN ROOM --- */}
      <Modal visible={activeModal === 'assign'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign Room 📍</Text>
            <Text style={styles.modalSub}>{selectedStudent?.name}</Text>
            {['ROOM 1', 'ROOM 2', 'ROOM 3'].map(r => (
              <TouchableOpacity key={r} style={styles.optionBtn} onPress={() => handleAssign(r)}>
                <Text style={styles.optionText}>{r}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setActiveModal(null)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: FEEDBACK --- */}
      <Modal visible={activeModal === 'feedback'} transparent animationType="slide">
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
            <GameButton title="SEND FEEDBACK" color={COLORS.primary} onPress={handleFeedback} />
            <TouchableOpacity onPress={() => setActiveModal(null)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: DELETE --- */}
      <Modal visible={activeModal === 'delete'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, {alignItems:'center'}]}>
            <View style={styles.warnIcon}><Ionicons name="hand-right" size={40} color="white" /></View>
            <Text style={styles.modalTitle}>Wait! ✋</Text>
            <Text style={styles.modalSubText}>Remove {selectedStudent?.name} from the list?</Text>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleDelete}><Text style={styles.btnText}>YES, DELETE</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: COLORS.muted}]} onPress={() => setActiveModal(null)}><Text style={styles.btnText}>CANCEL</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: SUCCESS --- */}
      <Modal visible={activeModal === 'success'} transparent animationType="fade">
          <View style={styles.successOverlay}>
              <LinearGradient colors={['#78C800', '#4CAF50']} style={styles.successCard}>
                  <Ionicons name="checkmark-circle" size={50} color="white" />
                  <Text style={styles.successTitle}>SUCCESS!</Text>
                  <Text style={styles.successSub}>Action completed successfully ✨</Text>
              </LinearGradient>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  container: { flex: 1, padding: 25 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 4 },
  stName: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  stRoom: { fontSize: 11, fontWeight: 'bold', marginTop: 4 },
  stStatus: { fontSize: 10, fontWeight: '900', marginTop: 4 },
  iconCol: { gap: 12, borderLeftWidth: 1, borderLeftColor: '#F5F5F5', paddingLeft: 15, flexDirection: 'row', alignItems: 'center' },
  feedbackCircle: { backgroundColor: COLORS.primary, width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 35, padding: 30, elevation: 10 },
  modalTitle: { fontSize: 24, fontWeight: '900', textAlign: 'center', color: COLORS.text },
  modalSub: { textAlign: 'center', fontWeight: 'bold', color: COLORS.muted, marginBottom: 20 },
  tabRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  tab: { flex: 1, padding: 10, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center' },
  tabText: { color: '#B0BEC5', fontWeight: '900', fontSize: 10 },
  presetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  phraseBtn: { backgroundColor: '#F5F5F5', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#ECEFF1' },
  phraseText: { fontSize: 9, fontWeight: 'bold', color: '#78909C' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 15, padding: 12, height: 60, textAlignVertical: 'top', marginBottom: 15 },
  warnIcon: { backgroundColor: '#FF5252', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15 },
  modalSubText: { textAlign: 'center', color: COLORS.muted, marginBottom: 20, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 1, backgroundColor: '#FF5252', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900' },
  optionBtn: { backgroundColor: '#F5F5F5', padding: 15, borderRadius: 15, marginBottom: 10, alignItems: 'center' },
  optionText: { fontWeight: 'bold', color: COLORS.primary },
  cancelText: { textAlign: 'center', marginTop: 15, fontWeight: '900', color: '#455A64', fontSize: 13 },
  successOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  successCard: { padding: 40, borderRadius: 40, alignItems: 'center', elevation: 15, width: width * 0.8 },
  successTitle: { color: 'white', fontSize: 28, fontWeight: '900', marginTop: 15 },
  successSub: { color: 'white', fontSize: 14, fontWeight: 'bold', opacity: 0.9, marginTop: 5 }
});

export default TeacherStudents;