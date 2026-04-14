import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, Platform, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const TeacherHome = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tRes = await API.get('/user');
        const sRes = await API.get('/students');
        setTeacher(tRes.data);
        setStudents(sRes.data);
      } catch (e) { console.log(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={{padding: 25}}>
          <Text style={styles.greeting}>{teacher?.name} 👩‍🏫</Text>
          <Text style={styles.subGreeting}>Class Overview • {students.length} Students</Text>

          <Text style={styles.sectionTitle}>Real Student Progress</Text>
          
          {students.length === 0 ? (
            <Text style={{textAlign: 'center', marginTop: 20, color: '#90A4AE'}}>No students registered yet.</Text>
          ) : (
            students.map((item) => (
                <View key={item.id} style={styles.studentCard}>
                  <View style={styles.avatarMini}><Text>🧒</Text></View>
                  <View style={{flex: 1, marginLeft: 15}}>
                    <Text style={styles.studentName}>{item.name}</Text>
                    <Text style={styles.studentInfo}>Level {item.level} • {item.points} XP</Text>
                  </View>
                  <View style={styles.statusDot} />
                </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  greeting: { fontSize: 28, fontWeight: '900', color: '#455A64' },
  subGreeting: { fontSize: 14, color: '#90A4AE', fontWeight: 'bold', marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#455A64', marginBottom: 15 },
  studentCard: { backgroundColor: 'white', padding: 15, borderRadius: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 3 },
  avatarMini: { width: 45, height: 45, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#455A64' },
  studentInfo: { fontSize: 12, color: '#90A4AE' },
  statusDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success }
});

export default TeacherHome;