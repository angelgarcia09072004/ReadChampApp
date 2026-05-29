import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  Modal,
  Animated,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const RoomDetail = ({ route, navigation }) => {
  const { roomName, allStudents, setGlobalStudents } = route.params;
  
  const [removeModal, setRemoveModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);

  const [roomStudents, setRoomStudents] = useState(
    allStudents.filter(s => s.room === roomName)
  );

  const handleRemoveConfirm = () => {
    const updatedMasterList = allStudents.map(s => 
      s.id === selectedStudent.id ? { ...s, room: 'Unassigned' } : s
    );
    if (typeof setGlobalStudents === 'function') {
      setGlobalStudents(updatedMasterList);
    }
    setRoomStudents(roomStudents.filter(s => s.id !== selectedStudent.id));
    setRemoveModal(false);
    navigation.goBack(); 
  };

  const handleCreateModule = () => {
    setFabOpen(false);
    navigation.navigate('CreateModule', { roomName });
  };

  const handleViewAnalytics = () => {
    setFabOpen(false);
    
    navigation.navigate('Analytics', { 
      roomName, 
      students: roomStudents 
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>{roomName}</Text>
          <View style={{ width: 45 }} />
        </View>

        <View style={styles.container}>
          <Text style={styles.countText}>{roomStudents.length} Champions in this Room</Text>
          
          <FlatList 
            data={roomStudents}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity 
                  style={{ flex: 1 }} 
                  onPress={() => navigation.navigate('StudentDetail', { student: item })}
                >
                  <Text style={styles.stName}>{item.name}</Text>
                  <Text style={styles.stStatus}>ACTIVE READER</Text>
                </TouchableOpacity>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => { setSelectedStudent(item); setRemoveModal(true); }}>
                    <Ionicons name="person-remove-outline" size={26} color="#FF5252" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </SafeAreaView>

      {/* ── FAB OVERLAY (dismisses popup on backdrop tap) ── */}
      {fabOpen && (
        <TouchableOpacity
          style={styles.fabBackdrop}
          activeOpacity={1}
          onPress={() => setFabOpen(false)}
        />
      )}

      {/* ── POP-UP ACTION MENU (slides up when FAB is open) ── */}
      {fabOpen && (
        <View style={styles.fabMenuContainer}>
          {/* Create Module Button */}
          <TouchableOpacity style={styles.fabMenuItem} onPress={handleCreateModule}>
            <View style={styles.fabMenuIcon}>
              <Ionicons name="albums-outline" size={20} color="#fff" />
            </View>
            <View style={styles.fabMenuLabel}>
              <Text style={styles.fabMenuText}>Create Module</Text>
              <Text style={styles.fabMenuSub}>Add a new reading activity</Text>
            </View>
          </TouchableOpacity>

          {/* View Analytics Button */}
          <TouchableOpacity style={styles.fabMenuItem} onPress={handleViewAnalytics}>
            <View style={[styles.fabMenuIcon, { backgroundColor: '#AB47BC' }]}>
              <Ionicons name="bar-chart-outline" size={20} color="#fff" />
            </View>
            <View style={styles.fabMenuLabel}>
              <Text style={styles.fabMenuText}>View Analytics</Text>
              <Text style={styles.fabMenuSub}>Track student reading progress</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ── FLOATING ACTION BUTTON ── */}
      <View style={styles.fabWrapper}>
        <TouchableOpacity
          style={[styles.fab, fabOpen && styles.fabActive]}
          onPress={() => setFabOpen(!fabOpen)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={fabOpen ? ['#F48FB1', '#EF5350'] : ['#81D4FA', '#4FC3F7']}
            style={styles.fabGradient}
          >
            <Ionicons 
              name={fabOpen ? 'close' : 'add'} 
              size={32} 
              color="white" 
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ── REMOVE STUDENT MODAL ── */}
      <Modal visible={removeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.warnIcon}>
              <Ionicons name="hand-right" size={40} color="white" />
            </View>
            <Text style={styles.modalTitle}>Wait! ✋</Text>
            <Text style={styles.modalSubText}>Remove {selectedStudent?.name} from {roomName}?</Text>
            
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.confirmBtn} onPress={handleRemoveConfirm}>
                <Text style={styles.btnText}>YES, REMOVE</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.confirmBtn, { backgroundColor: COLORS.muted }]} 
                onPress={() => setRemoveModal(false)}
              >
                <Text style={[styles.btnText, { color: '#455A64' }]}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center' 
  },
  backBtn: { 
    backgroundColor: 'white', 
    padding: 10, 
    borderRadius: 15, 
    elevation: 4 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: COLORS.text 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 25 
  },
  countText: { 
    fontWeight: 'bold', 
    color: COLORS.muted, 
    marginBottom: 20, 
    letterSpacing: 1 
  },
  card: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 25, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 12, 
    elevation: 4 
  },
  stName: { 
    fontSize: 16, 
    fontWeight: '900', 
    color: COLORS.text 
  },
  stStatus: { 
    fontSize: 10, 
    color: COLORS.success, 
    fontWeight: 'bold', 
    textTransform: 'uppercase', 
    marginTop: 3 
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: 15, 
    borderLeftWidth: 1, 
    borderLeftColor: '#F5F5F5', 
    paddingLeft: 15 
  },

  // ── FAB ──
  fabWrapper: {
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
    zIndex: 20,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 8,
    shadowColor: '#4FC3F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabActive: {
    shadowColor: '#EF5350',
  },
  fabGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabBackdrop: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
  },
  fabMenuContainer: {
    position: 'absolute',
    bottom: 115,
    alignSelf: 'center',
    zIndex: 15,
    width: width * 0.78,
    gap: 10, // vertical spacing for multiple stacked menu items
  },
  fabMenuItem: {
    backgroundColor: 'white',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    gap: 14,
  },
  fabMenuIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#4FC3F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabMenuLabel: {
    flex: 1,
  },
  fabMenuText: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
  },
  fabMenuSub: {
    fontSize: 11,
    color: COLORS.muted,
    marginTop: 2,
    fontWeight: '600',
  },

  // ── REMOVE MODAL ──
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    justifyContent: 'center', 
    padding: 25 
  },
  modalCard: { 
    backgroundColor: 'white', 
    borderRadius: 35, 
    padding: 30, 
    alignItems: 'center', 
    elevation: 10 
  },
  warnIcon: { 
    backgroundColor: '#FF5252', 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: '900', 
    color: COLORS.text 
  },
  modalSubText: { 
    textAlign: 'center', 
    color: COLORS.muted, 
    marginVertical: 20, 
    lineHeight: 20, 
    fontWeight: '600' 
  },
  btnRow: { 
    flexDirection: 'row', 
    gap: 10 
  },
  confirmBtn: { 
    flex: 1, 
    backgroundColor: '#FF5252', 
    padding: 15, 
    borderRadius: 15, 
    alignItems: 'center' 
  },
  btnText: { 
    color: 'white', 
    fontWeight: '900' 
  }
});

export default RoomDetail;