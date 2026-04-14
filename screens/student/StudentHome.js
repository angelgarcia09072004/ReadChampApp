import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, 
  Dimensions, ActivityIndicator, StatusBar, Platform, Modal 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width, height } = Dimensions.get('window');

const GameCard = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={styles.gameCard} onPress={onPress}>
        <View style={[styles.gameIconCircle, { backgroundColor: color + '20' }]}>
            <Ionicons name={icon} size={30} color={color} />
        </View>
        <Text style={styles.gameCardTitle}>{title}</Text>
        <Ionicons name="chevron-forward" size={20} color="#B0BEC5" />
    </TouchableOpacity>
);

const StudentHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    API.get('/user').then(res => {
      setUser(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const openLevel = (lvlId) => {
    setSelectedLevel(lvlId);
    setModalVisible(true);
  };

  if (loading) return <ActivityIndicator style={{flex:1}} color={COLORS.primary} />;

  const levelsData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    status: (i + 1) < user?.level ? 'completed' : (i + 1) === user?.level ? 'current' : 'locked'
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={[COLORS.primary, '#64B5F6']} style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hi, {user?.name || 'Champ'}! 🏆</Text>
              <Text style={styles.subGreeting}>Level {user?.level} Explorer</Text>
            </View>
            <View style={styles.statsBadge}>
              <Text style={styles.statText}>✨ {user?.points || 0} pts</Text>
            </View>
          </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.mapContent}>
          {levelsData.map((lvl, index) => (
              <TouchableOpacity 
                key={lvl.id} 
                onPress={() => lvl.status !== 'locked' && openLevel(lvl.id)}
                style={[styles.node, { marginLeft: index % 4 === 1 ? 90 : index % 4 === 3 ? -90 : 0 }]}
              >
                <View style={[styles.outerCircle, lvl.status === 'locked' && { borderColor: '#ECEFF1' }]}>
                    <View style={[styles.innerCircle, { backgroundColor: lvl.status === 'locked' ? '#BDBDBD' : lvl.status === 'current' ? COLORS.primary : COLORS.success }]}>
                        {lvl.status === 'locked' ? <Ionicons name="lock-closed" size={30} color="white" /> : <Text style={styles.levelNumber}>{lvl.id}</Text>}
                    </View>
                </View>
                <Text style={styles.nodeLabel}>LEVEL {lvl.id}</Text>
              </TouchableOpacity>
          ))}
          <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- GAME SELECTION MODAL --- */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Level {selectedLevel} Games</Text>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                          <Ionicons name="close-circle" size={30} color="#CFD8DC" />
                      </TouchableOpacity>
                  </View>
                  
                  <Text style={styles.modalSubtitle}>Pick a challenge to earn XP! ✨</Text>

                  <GameCard title="Word Sounds" icon="volume-high" color={COLORS.primary} onPress={() => alert("Game 1 Start")} />
                  <GameCard title="Object Identification" icon="search" color={COLORS.success} onPress={() => alert("Game 2 Start")} />
                  <GameCard title="Syllable Splash" icon="water" color="#FFB300" onPress={() => alert("Game 3 Start")} />
                  <GameCard title="Spellcraft Puzzle" icon="extension-puzzle" color="#FF7043" onPress={() => alert("Game 4 Start")} />
              </View>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F8E9' },
  header: { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 60, paddingHorizontal: 20, paddingBottom: 25, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, elevation: 10 },
  headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: 'white', fontSize: 26, fontWeight: '900' },
  subGreeting: { color: 'white', opacity: 0.8, fontWeight: 'bold' },
  statsBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  statText: { color: 'white', fontWeight: 'bold' },
  mapContent: { paddingTop: 40, alignItems: 'center' },
  node: { alignItems: 'center', marginBottom: 40 },
  outerCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', borderWidth: 5, borderColor: '#C8E6C9', elevation: 5 },
  innerCircle: { width: 75, height: 75, borderRadius: 37.5, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 6, borderBottomColor: 'rgba(0,0,0,0.1)' },
  levelNumber: { color: 'white', fontSize: 30, fontWeight: '900' },
  nodeLabel: { marginTop: 8, fontWeight: '900', color: '#2E7D32', fontSize: 10 },

  // MODAL STYLES
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: 'white', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, height: height * 0.7 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  modalTitle: { fontSize: 28, fontWeight: '900', color: '#455A64' },
  modalSubtitle: { fontSize: 16, color: '#90A4AE', fontWeight: 'bold', marginBottom: 25 },
  gameCard: { backgroundColor: '#F7F7F7', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#ECEFF1' },
  gameIconCircle: { width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  gameCardTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#546E7A' }
});

export default StudentHome;