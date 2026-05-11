import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  Modal, 
  TextInput, 
  StatusBar, 
  Platform, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';
import GameButton from '../../components/GameButton';

const { width } = Dimensions.get('window');

const TeacherHome = ({ navigation }) => {
  const [teacherName, setTeacherName] = useState('Teacher');
  
  // --- SYNCHRONIZED 7 STUDENTS (Source of Truth) ---
  const students = [
    { id: '1', name: 'Angel Anne Garcia', room: 'ROOM 1', progress: 85, level: 5, xp: 320 },
    { id: '2', name: 'Shaine Roxanne Eceja', room: 'ROOM 2', progress: 60, level: 4, xp: 210 },
    { id: '3', name: 'Prince Lawrence San Miguel', room: 'ROOM 1', progress: 40, level: 2, xp: 90 },
    { id: '4', name: 'Mina Chaeyoungie', room: 'ROOM 3', progress: 20, level: 1, xp: 50 },
    { id: '5', name: 'Minatozaki Tzuyu', room: 'ROOM 2', progress: 50, level: 3, xp: 150 },
    { id: '6', name: 'Apple Ace Garcia', room: 'ROOM 1', progress: 90, level: 5, xp: 450 },
    { id: '7', name: 'Felicity Yvonne Maninang', room: 'ROOM 3', progress: 10, level: 1, xp: 20 },
  ];

  const [rooms, setRooms] = useState([
    { id: '1', name: 'ROOM 1', color: COLORS.primary },
    { id: '2', name: 'ROOM 2', color: COLORS.secondary },
    { id: '3', name: 'ROOM 3', color: COLORS.success },
  ]);

  const [isAddRoomVisible, setAddRoomVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  useEffect(() => {
    API.get('/user').then(res => setTeacherName(res.data.name)).catch(() => {});
  }, []);

  // ACCURATE COUNTING LOGIC
  const getRoomCount = (name) => {
    return students.filter(s => s.room === name).length;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          {/* WELCOME HEADER */}
          <View style={styles.welcomeBox}>
            <Ionicons name="person-circle-outline" size={50} color="white" />
            <Text style={styles.welcomeLabel}>WELCOME BACK,</Text>
            <Text style={styles.teacherName}>{teacherName.toUpperCase()}</Text>
          </View>

          {/* ROOMS SECTION WITH ADD BUTTON */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Classes</Text>
            <TouchableOpacity style={styles.addRoomBtn} onPress={() => setAddRoomVisible(true)}>
                <Ionicons name="add-circle" size={20} color="white" />
                <Text style={styles.addRoomText}>Add Room</Text>
            </TouchableOpacity>
          </View>

          {/* SLIDABLE ROOMS */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.roomScroll}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {rooms.map(room => (
              <TouchableOpacity 
                key={room.id} 
                style={[styles.roomCard, { backgroundColor: room.color }]} 
                onPress={() => navigation.navigate('RoomDetail', { 
                    roomName: room.name, 
                    allStudents: students 
                })}
              >
                <MaterialCommunityIcons name="school-outline" size={30} color="white" />
                <Text style={styles.roomName}>{room.name}</Text>
                <Text style={styles.roomSub}>{getRoomCount(room.name)} Students</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* INDIVIDUAL PROGRESS SECTION */}
          <Text style={styles.sectionTitle}>Individual Progress</Text>
          {students.map(student => (
            <TouchableOpacity 
                key={student.id} 
                style={styles.stCard} 
                onPress={() => navigation.navigate('StudentDetail', { student })} // FIXED: NOW OPENS STUDENT DASHBOARD
            >
              <Ionicons name="person-outline" size={24} color={COLORS.primary} />
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.stName}>{student.name}</Text>
                <View style={styles.pBarBg}><View style={[styles.pBarFill, { width: `${student.progress}%` }]} /></View>
                <Text style={styles.stMeta}>{student.room} • {student.progress}% Complete</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ADD ROOM MODAL */}
      <Modal visible={isAddRoomVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create New Room</Text>
            <TextInput 
                style={styles.input} 
                placeholder="Room Name" 
                placeholderTextColor="#B0BEC5"
                value={newRoomName} 
                onChangeText={setNewRoomName} 
            />
            <GameButton title="CREATE" color={COLORS.success} onPress={() => { setRooms([...rooms, {id: Date.now().toString(), name: newRoomName, color: COLORS.primary}]); setAddRoomVisible(false); }} />
            <TouchableOpacity onPress={() => setAddRoomVisible(false)}><Text style={styles.cancel}>CANCEL</Text></TouchableOpacity>
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text, marginBottom: 15 },
  addRoomBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  addRoomText: { color: 'white', fontWeight: 'bold', fontSize: 12, marginLeft: 5 },
  roomScroll: { marginBottom: 25 },
  roomCard: { width: 150, padding: 20, borderRadius: 25, elevation: 5, marginRight: 15, borderBottomWidth: 5, borderBottomColor: 'rgba(0,0,0,0.1)' },
  roomName: { color: 'white', fontSize: 18, fontWeight: '900', marginTop: 10 },
  roomSub: { color: 'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  stCard: { backgroundColor: 'white', padding: 18, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 3 },
  stName: { fontSize: 14, fontWeight: '900', color: COLORS.text },
  pBarBg: { height: 8, backgroundColor: '#F5F5F5', borderRadius: 4, overflow: 'hidden', marginTop: 5 },
  pBarFill: { height: '100%', backgroundColor: COLORS.success },
  stMeta: { fontSize: 10, color: COLORS.muted, fontWeight: 'bold', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 30, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.primary, marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 15, marginBottom: 20, color: '#000' },
  cancel: { marginTop: 15, color: COLORS.muted, fontWeight: 'bold' }
});

export default TeacherHome;