import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Modal, StatusBar, Platform, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width } = Dimensions.get('window');

const TeacherHome = ({ navigation }) => {
  const [teacherName, setTeacherName] = useState('Teacher');
  
  // --- GLOBAL STATE (Source of Truth for the whole app) ---
  const [rooms, setRooms] = useState([
    { id: '1', name: 'ROOM 1', color: COLORS.primary },
    { id: '2', name: 'ROOM 2', color: COLORS.secondary },
    { id: '3', name: 'ROOM 3', color: COLORS.success },
  ]);

  const [students, setStudents] = useState([
    { id: '1', name: 'Angel Anne Garcia', room: 'ROOM 1', progress: 85 },
    { id: '2', name: 'Shaine Roxanne Eceja', room: 'ROOM 2', progress: 60 },
    { id: '3', name: 'Prince Lawrence San Miguel', room: 'ROOM 1', progress: 40 },
    { id: '4', name: 'Mina Chaeyoungie', room: 'ROOM 3', progress: 20 },
    { id: '5', name: 'Minatozaki Tzuyu', room: 'ROOM 2', progress: 50 },
    { id: '6', name: 'Apple Ace Garcia', room: 'ROOM 1', progress: 90 },
    { id: '7', name: 'Felicity Yvonne Maninang', room: 'ROOM 3', progress: 10 },
  ]);

  const [deleteModal, setDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    API.get('/user').then(res => setTeacherName(res.data.name)).catch(() => {});
  }, []);

  // ACCURATE COUNTING LOGIC
  const getRoomCount = (name) => students.filter(s => s.room === name).length;

  const confirmDeleteRoom = () => {
    setRooms(rooms.filter(r => r.id !== roomToDelete.id));
    setDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.welcomeBox}>
            <Ionicons name="person-circle-outline" size={50} color="white" />
            <Text style={styles.welcomeLabel}>WELCOME BACK,</Text>
            <Text style={styles.teacherName}>{teacherName.toUpperCase()}</Text>
          </View>

          <Text style={styles.sectionTitle}>My Classes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomScroll}>
            {rooms.map(room => (
              <TouchableOpacity 
                key={room.id} 
                style={[styles.roomCard, { backgroundColor: room.color }]} 
                onPress={() => navigation.navigate('RoomDetail', { 
                    roomName: room.name, 
                    allStudents: students,
                    setGlobalStudents: setStudents 
                })}
              >
                <TouchableOpacity style={styles.roomTrash} onPress={() => { setRoomToDelete(room); setDeleteModal(true); }}>
                    <Ionicons name="trash-outline" size={18} color="white" />
                </TouchableOpacity>
                <MaterialCommunityIcons name="school-outline" size={30} color="white" />
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomSub}>{getRoomCount(room.name)} Students</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionTitle}>Individual Progress</Text>
          {students.map(student => (
            <TouchableOpacity 
                key={student.id} 
                style={styles.stCard} 
                onPress={() => navigation.navigate('Students', { 
                    initialStudents: students, 
                    setGlobalStudents: setStudents 
                })}
            >
              <Ionicons name="person-outline" size={24} color={COLORS.primary} />
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.stName}>{student.name}</Text>
                <View style={styles.pBarBg}><View style={[styles.pBarFill, { width: `${student.progress}%` }]} /></View>
                <Text style={styles.stMeta}>{student.room === 'Unassigned' ? 'Not Assigned' : student.room} • {student.progress}%</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* AESTHETIC DELETE ROOM MODAL */}
      <Modal visible={deleteModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.warnIcon}><Ionicons name="hand-right" size={40} color="white" /></View>
            <Text style={styles.modalTitle}>Wait! ✋</Text>
            <Text style={styles.modalSubText}>Are you sure you want to delete {roomToDelete?.name}? This will unassign all students in this room.</Text>
            <View style={styles.btnRow}>
                <TouchableOpacity style={styles.confirmBtn} onPress={confirmDeleteRoom}><Text style={styles.btnText}>YES, DELETE</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.confirmBtn, {backgroundColor: COLORS.muted}]} onPress={() => setDeleteModal(false)}><Text style={styles.btnText}>CANCEL</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scroll: { padding: 25 },
  welcomeBox: { backgroundColor: COLORS.text, padding: 30, borderRadius: 30, elevation: 5, marginBottom: 25, alignItems: 'center' },
  welcomeLabel: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.6)', letterSpacing: 2, marginTop: 10 },
  teacherName: { fontSize: 24, fontWeight: '900', color: 'white' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 15 },
  roomScroll: { marginBottom: 25 },
  roomCard: { width: 150, padding: 20, borderRadius: 25, elevation: 5, marginRight: 15 },
  roomTrash: { alignSelf: 'flex-end', marginTop: -10, marginRight: -10, backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 10 },
  roomName: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 5 },
  roomSub: { color: 'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  stCard: { backgroundColor: 'white', padding: 18, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 3 },
  stName: { fontSize: 14, fontWeight: '900', color: COLORS.text },
  pBarBg: { height: 8, backgroundColor: '#F5F5F5', borderRadius: 4, overflow: 'hidden', marginTop: 5 },
  pBarFill: { height: '100%', backgroundColor: COLORS.success },
  stMeta: { fontSize: 10, color: COLORS.muted, fontWeight: 'bold', marginTop: 4 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 35, padding: 30, alignItems: 'center' },
  warnIcon: { backgroundColor: '#FF5252', width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  modalSubText: { textAlign: 'center', color: COLORS.muted, marginVertical: 20, lineHeight: 20 },
  btnRow: { flexDirection: 'row', gap: 10 },
  confirmBtn: { flex: 1, backgroundColor: '#FF5252', padding: 15, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: '900' }
});

export default TeacherHome;