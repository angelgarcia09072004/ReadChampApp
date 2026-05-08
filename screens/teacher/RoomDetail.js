import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const RoomDetail = ({ route, navigation }) => {
  const { room, studentsInRoom } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{room.name}</Text>
            <View style={{width: 45}} />
        </View>

        <View style={styles.container}>
          <Text style={styles.countText}>{studentsInRoom.length} Champions Assigned</Text>

          <FlatList 
            data={studentsInRoom}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.floatCard}>
                <View style={styles.avatarCircle}><Text>🧒</Text></View>
                <View style={{flex: 1, marginLeft: 15}}>
                    <Text style={styles.stName}>{item.name}</Text>
                    <Text style={styles.stStatus}>{item.status}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.viewBtn} 
                    onPress={() => navigation.navigate('StudentDetail', { student: item })}
                >
                    <Ionicons name="eye" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  backBtn: { backgroundColor: 'white', padding: 10, borderRadius: 15, elevation: 4 },
  title: { fontSize: 24, fontWeight: '900', color: COLORS.text },
  container: { flex: 1, paddingHorizontal: 25 },
  countText: { fontWeight: 'bold', color: COLORS.muted, marginBottom: 20, letterSpacing: 1 },
  floatCard: { backgroundColor: 'white', padding: 20, borderRadius: 30, flexDirection: 'row', alignItems: 'center', marginBottom: 15, elevation: 10 },
  avatarCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  stName: { fontSize: 16, fontWeight: '900', color: COLORS.text },
  stStatus: { fontSize: 10, color: COLORS.success, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 3 },
  viewBtn: { backgroundColor: '#E1F5FE', padding: 10, borderRadius: 15 }
});

export default RoomDetail;