import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const RoomDetail = ({ route, navigation }) => {
  const { roomName, allStudents, setGlobalStudents } = route.params;
  const [roomStudents, setRoomStudents] = useState(allStudents.filter(s => s.room === roomName));
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const handleRemove = () => {
    // Update global list so Dashboard count changes
    const updatedGlobal = allStudents.map(s => s.id === selectedStudent.id ? { ...s, room: 'Unassigned' } : s);
    setGlobalStudents(updatedGlobal);
    
    // Update local list for this screen
    setRoomStudents(roomStudents.filter(s => s.id !== selectedStudent.id));
    setRemoveModal(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}><Ionicons name="arrow-back" size={24} color={COLORS.text} /></TouchableOpacity>
            <Text style={styles.title}>{roomName}</Text>
            <View style={{width: 45}} />
        </View>

        <View style={styles.container}>
          <Text style={styles.countText}>{roomStudents.length} Champions in this Room</Text>
          <FlatList 
            data={roomStudents}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity style={{flex: 1}} onPress={() => navigation.navigate('StudentDetail', { student: item })}>
                    <Text style={styles.stName}>{item.name}</Text>
                    <Text style={styles.stStatus}>ACTIVE READER</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelectedStudent(item); setRemoveModal(true); }}>
                    <Ionicons name="person-remove-outline" size={24} color="#FF5252" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>

      {/* CUSTOM REMOVE MODAL */}
      <Modal visible={removeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.warnIcon}><Ionicons name="hand-right" size={40} color="white" /></View>
            <Text style={styles.modalTitle}>Wait! ✋</Text>
            <Text style={styles.modalSubText}>Remove {selectedStudent?.name} from {roomName}?</Text>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleRemove}><Text style={styles.btnText}>YES, REMOVE</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: COLORS.muted}]} onPress={() => setRemoveModal(false)}><Text style={styles.btnText}>CANCEL</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  backBtn: { backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 4 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  container: { flex: 1, paddingHorizontal: 25 },
  countText: { fontWeight: 'bold', color: COLORS.muted, marginBottom: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 4 },
  stName: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  stStatus: { fontSize: 10, color: COLORS.success, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 35, padding: 30, alignItems: 'center' },
  warnIcon: { backgroundColor: '#FF5252', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  modalSubText: { textAlign: 'center', color: COLORS.muted, marginVertical: 20 },
  btnRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 1, backgroundColor: '#FF5252', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900' },
  cancelText: { textAlign: 'center', marginTop: 15, fontWeight: '900', color: '#455A64', fontSize: 13 }
});

export default RoomDetail;