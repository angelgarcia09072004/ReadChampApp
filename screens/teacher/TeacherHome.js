import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  SafeAreaView, Modal, TextInput, StatusBar, Platform, Alert, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import GameButton from '../../components/GameButton';

const { width } = Dimensions.get('window');

const TeacherHome = ({ navigation }) => {
  // GLOBAL STUDENT DATA
  const [students] = useState([
    { id: '1', name: 'Angel Anne Garcia', progress: 85, level: 5, room: 'Room 1-A' },
    { id: '2', name: 'Shaine Roxanne Eceja', progress: 60, level: 4, room: 'Room 1-B' },
    { id: '3', name: 'Prince Lawrence San Miguel', progress: 25, level: 2, room: 'Room 1-A' },
    { id: '4', name: 'Apple Ace Garcia', progress: 40, level: 3, room: 'Room 1-A' },
    { id: '5', name: 'Felicity Yvonne Maninang', progress: 10, level: 1, room: 'Room 1-B' },
  ]);

  const [rooms, setRooms] = useState([
    { id: '1', name: 'Room 1-A', color: COLORS.primary },
    { id: '2', name: 'Room 1-B', color: COLORS.secondary },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleAddRoom = () => {
    if (newRoomName.trim()) {
      setRooms([...rooms, { id: Date.now().toString(), name: newRoomName, color: COLORS.success }]);
      setNewRoomName('');
      setModalVisible(false);
    }
  };

  const deleteRoom = (id) => {
    Alert.alert("Delete Room", "Are you sure? This removes the room.", [
      { text: "Cancel" },
      { text: "Delete", style: 'destructive', onPress: () => setRooms(rooms.filter(r => r.id !== id)) }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E3F2FD', '#FFF1F0']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.header}>
            <View>
                <Text style={styles.welcome}>Welcome Back,</Text>
                <Text style={styles.name}>Teacher Garcia 👩‍🏫</Text>
            </View>
            <View style={styles.mascot}><Text style={{fontSize: 30}}>🐰</Text></View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Classes 🏫</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.addBtnText}>+ Add Room</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.roomScroll}>
            {rooms.map(room => {
              const count = students.filter(s => s.room === room.name).length;
              return (
                <TouchableOpacity 
                  key={room.id} 
                  style={[styles.roomCard, { backgroundColor: room.color }]} 
                  onPress={() => navigation.navigate('RoomDetail', { room, studentsInRoom: students.filter(s => s.room === room.name) })}
                >
                  <TouchableOpacity style={styles.trash} onPress={() => deleteRoom(room.id)}>
                      <Ionicons name="trash" size={18} color="white" />
                  </TouchableOpacity>
                  <Text style={styles.roomName}>{room.name}</Text>
                  <Text style={styles.roomSub}>{count} Students</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>Individual Progress 🧒</Text>
          {students.map(student => (
            <TouchableOpacity key={student.id} style={styles.stCard} onPress={() => navigation.navigate('StudentDetail', { student })}>
              <View style={styles.avatar}><Text>🧒</Text></View>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.stName}>{student.name}</Text>
                <View style={styles.pBarBg}><View style={[styles.pBarFill, { width: `${student.progress}%` }]} /></View>
                <Text style={styles.stMeta}>{student.room} • Level {student.level}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{height: 100}} />
        </ScrollView>
      </SafeAreaView>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Create New Room ✨</Text>
            <TextInput style={styles.input} placeholder="Ex: Room 1-C" value={newRoomName} onChangeText={setNewRoomName} />
            <GameButton title="CREATE" color={COLORS.success} onPress={handleAddRoom} />
            <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={styles.cancelText}>CANCEL</Text></TouchableOpacity>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  welcome: { fontSize: 14, color: COLORS.muted, fontWeight: 'bold' },
  name: { fontSize: 26, fontWeight: '900', color: COLORS.text },
  mascot: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text },
  addBtn: { backgroundColor: COLORS.success, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, elevation: 3 },
  addBtnText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  roomScroll: { marginBottom: 30 },
  roomCard: { width: 160, padding: 20, borderRadius: 25, marginRight: 15, elevation: 8, borderBottomWidth: 4, borderBottomColor: 'rgba(0,0,0,0.1)' },
  trash: { alignSelf: 'flex-end', marginBottom: -5 },
  roomName: { color: 'white', fontSize: 18, fontWeight: '900' },
  roomSub: { color: 'white', fontSize: 10, fontWeight: 'bold', opacity: 0.8 },
  stCard: { backgroundColor: 'white', padding: 18, borderRadius: 25, flexDirection: 'row', alignItems: 'center', marginBottom: 12, elevation: 4 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  stName: { fontSize: 15, fontWeight: '900', color: COLORS.text },
  pBarBg: { height: 8, backgroundColor: '#F5F5F5', borderRadius: 4, overflow: 'hidden', marginTop: 5 },
  pBarFill: { height: '100%', backgroundColor: COLORS.success },
  stMeta: { fontSize: 10, color: COLORS.muted, fontWeight: 'bold', marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 25 },
  modalCard: { backgroundColor: 'white', borderRadius: 30, padding: 30, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: '900', color: COLORS.primary, marginBottom: 20 },
  input: { width: '100%', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 15, marginBottom: 20, borderWidth: 2, borderColor: '#ECEFF1' },
  cancelText: { marginTop: 15, color: COLORS.muted, fontWeight: 'bold' }
});

export default TeacherHome;