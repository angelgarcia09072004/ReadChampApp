import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  SafeAreaView, Modal, TextInput, StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';

const { width } = Dimensions.get('window');

const TeacherStudents = ({ navigation }) => {
  // --- 1. DATA STATE ---
  const [students, setStudents] = useState([
    { id: '1', name: 'Angel Anne Garcia', room: 'Room 1-A', status: 'Active Reader', feedback: '' },
    { id: '2', name: 'Shaine Roxanne Eceja', room: 'Room 1-B', status: 'Active Reader', feedback: '' },
    { id: '3', name: 'Prince Lawrence San Miguel', room: 'Room 1-A', status: 'Needs Help', feedback: '' },
    { id: '4', name: 'Apple Ace Garcia', room: 'Unassigned', status: 'Active Reader', feedback: '' },
    { id: '5', name: 'Felicity Yvonne Maninang', room: 'Unassigned', status: 'Needs Help', feedback: '' },
  ]);

  // --- 2. MODAL & UI STATES ---
  const [activeModal, setActiveModal] = useState(null); // 'delete', 'feedback', 'assign', 'success'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [tempData, setTempData] = useState({ status: '', message: '', room: '' });

  // --- 3. LOGIC HANDLERS ---
  const showSuccess = () => {
    setActiveModal('success');
    setTimeout(() => setActiveModal(null), 1500);
  };

  const saveFeedback = () => {
    setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, status: tempData.status, feedback: tempData.message } : s));
    setActiveModal(null);
    showSuccess();
  };

  const confirmDelete = () => {
    setStudents(students.filter(s => s.id !== selectedStudent.id));
    setActiveModal(null);
    showSuccess();
  };

  const confirmAssign = () => {
    setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, room: tempData.room } : s));
    setActiveModal(null);
    showSuccess();
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>All Champions 👨‍🎓</Text>

          <FlatList 
            data={students}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stName}>{item.name}</Text>
                  <Text style={[styles.stRoom, { color: item.room === 'Unassigned' ? '#FF5252' : COLORS.muted }]}>📍 {item.room}</Text>
                  <Text style={[styles.stStatus, { color: item.status === 'Needs Help' ? '#FF5252' : COLORS.success }]}>● {item.status}</Text>
                </View>

                {/* INTERACTIVE ACTIONS */}
                <View style={styles.btnRow}>
                  <TouchableOpacity 
                    style={[styles.miniBtn, { backgroundColor: '#E3F2FD' }]} 
                    onPress={() => { setSelectedStudent(item); setTempData({ status: item.status, message: item.feedback }); setActiveModal('feedback'); }}
                  >
                    <Ionicons name="chatbubble-ellipses" size={18} color={COLORS.primary} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.miniBtn, { backgroundColor: '#F1F8E9' }]} 
                    onPress={() => { setSelectedStudent(item); setActiveModal('assign'); }}
                  >
                    <Ionicons name="move" size={18} color={COLORS.success} />
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={[styles.miniBtn, { backgroundColor: '#FFEBEE' }]} 
                    onPress={() => { setSelectedStudent(item); setActiveModal('delete'); }}
                  >
                    <Ionicons name="trash" size={18} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>

      {/* --- MODAL: FEEDBACK & STATUS --- */}
      <Modal visible={activeModal === 'feedback'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Student Feedback ✨</Text>
            <Text style={styles.modalSub}>{selectedStudent?.name}</Text>

            <Text style={styles.label}>READING STATUS</Text>
            <View style={styles.selectorRow}>
              {['Active Reader', 'Needs Help'].map(st => (
                <TouchableOpacity 
                  key={st} 
                  style={[styles.choiceBtn, tempData.status === st && { backgroundColor: st === 'Needs Help' ? '#FF5252' : COLORS.success, borderColor: 'transparent' }]}
                  onPress={() => setTempData({ ...tempData, status: st })}
                >
                  <Text style={[styles.choiceText, tempData.status === st && { color: 'white' }]}>{st.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>PRIVATE MESSAGE</Text>
            <TextInput 
              style={styles.textArea} 
              placeholder="Type your notes here..." 
              multiline 
              value={tempData.message}
              onChangeText={(t) => setTempData({ ...tempData, message: t })}
            />

            <GameButton title="SAVE FEEDBACK" color={COLORS.primary} onPress={saveFeedback} />
            <TouchableOpacity onPress={() => setActiveModal(null)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: DELETE CONFIRMATION --- */}
      <Modal visible={activeModal === 'delete'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { alignItems: 'center' }]}>
            <View style={styles.warnCircle}><Ionicons name="hand-human" size={40} color="white" /></View>
            <Text style={styles.modalTitle}>Wait! ✋</Text>
            <Text style={styles.confirmMsg}>Are you sure you want to remove {selectedStudent?.name} from your class list?</Text>
            
            <View style={styles.dualBtnRow}>
                <TouchableOpacity style={styles.yesBtn} onPress={confirmDelete}><Text style={styles.btnText}>YES, DELETE</Text></TouchableOpacity>
                <TouchableOpacity style={styles.noBtn} onPress={() => setActiveModal(null)}><Text style={styles.btnText}>NO</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL: ASSIGN CONFIRMATION --- */}
      <Modal visible={activeModal === 'assign'} transparent animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Assign Room 📍</Text>
                <View style={styles.roomList}>
                    {['Room 1-A', 'Room 1-B', 'Room 1-C'].map(r => (
                        <TouchableOpacity key={r} style={styles.roomItem} onPress={() => { setTempData({ ...tempData, room: r }); setActiveModal('assign_confirm'); }}>
                            <Text style={styles.roomItemText}>{r}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity onPress={() => setActiveModal(null)}><Text style={styles.cancelText}>GO BACK</Text></TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* --- MODAL: FINAL ASSIGN CONFIRM --- */}
      <Modal visible={activeModal === 'assign_confirm'} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={[styles.modalCard, {padding: 40, alignItems: 'center'}]}>
                <Ionicons name="help-circle" size={50} color={COLORS.primary} />
                <Text style={styles.modalTitle}>Confirm Move?</Text>
                <Text style={{textAlign: 'center', marginBottom: 20}}>Move {selectedStudent?.name} to {tempData.room}?</Text>
                <GameButton title="YES, APPLY" color={COLORS.success} onPress={confirmAssign} />
                <TouchableOpacity onPress={() => setActiveModal('assign')}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
              </View>
          </View>
      </Modal>

      {/* --- MODAL: SUCCESS TOAST --- */}
      <Modal visible={activeModal === 'success'} transparent animationType="fade">
          <View style={styles.toastContainer}>
              <View style={styles.toastCard}>
                  <Ionicons name="checkmark-done-circle" size={30} color="white" />
                  <Text style={styles.toastText}>CHANGES SAVED!</Text>
              </View>
          </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  container: { flex: 1, padding: 25 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 5 },
  stName: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  stRoom: { fontSize: 11, fontWeight: 'bold', marginTop: 3 },
  stStatus: { fontSize: 9, fontWeight: '900', textTransform: 'uppercase', marginTop: 5 },
  btnRow: { flexDirection: 'row', gap: 8 },
  miniBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  
  // MODAL SHARED
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 35, padding: 30, elevation: 10 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  modalSub: { textAlign: 'center', fontWeight: 'bold', color: COLORS.muted, marginBottom: 20 },
  label: { fontSize: 10, fontWeight: '900', color: COLORS.muted, marginBottom: 10, marginTop: 15, letterSpacing: 1 },
  cancelText: { textAlign: 'center', marginTop: 20, fontWeight: '900', color: COLORS.muted, fontSize: 12 },

  // FEEDBACK MODAL
  selectorRow: { flexDirection: 'row', gap: 10 },
  choiceBtn: { flex: 1, padding: 12, borderRadius: 15, borderWidth: 2, borderColor: '#ECEFF1', alignItems: 'center' },
  choiceText: { fontSize: 10, fontWeight: 'bold', color: COLORS.muted },
  textArea: { backgroundColor: '#F5F5F5', borderRadius: 20, padding: 15, height: 100, textAlignVertical: 'top', marginTop: 5, marginBottom: 20, borderWidth: 2, borderColor: '#ECEFF1' },

  // DELETE MODAL
  warnCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FF5252', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  confirmMsg: { textAlign: 'center', color: '#78909C', fontWeight: '600', marginBottom: 30, lineHeight: 20 },
  dualBtnRow: { flexDirection: 'row', gap: 10 },
  yesBtn: { flex: 1, backgroundColor: '#FF5252', padding: 15, borderRadius: 20, alignItems: 'center' },
  noBtn: { flex: 1, backgroundColor: '#B0BEC5', padding: 15, borderRadius: 20, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900', fontSize: 12 },

  // ASSIGN MODAL
  roomList: { marginVertical: 10 },
  roomItem: { backgroundColor: '#F7F7F7', padding: 15, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: '#ECEFF1', alignItems: 'center' },
  roomItemText: { fontWeight: 'bold', color: COLORS.primary },

  // SUCCESS TOAST
  toastContainer: { position: 'absolute', top: 50, width: '100%', alignItems: 'center' },
  toastCard: { backgroundColor: COLORS.success, flexDirection: 'row', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 40, alignItems: 'center', elevation: 10 },
  toastText: { color: 'white', fontWeight: '900', marginLeft: 10, letterSpacing: 1 }
});

export default TeacherStudents;