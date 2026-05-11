import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme';
import API from '../../services/api';

const StudentStats = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/user').then(res => { setUser(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{flex:1}} />;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          <Text style={styles.headerTitle}>My Progress 📈</Text>

          {/* CLICKABLE LEVEL GOAL CARD */}
          <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Home')}>
            <View style={styles.glassCard}>
                <View style={styles.levelRow}>
                    <Text style={styles.levelText}>Level {user?.level} Student</Text>
                    <Text style={styles.xpText}>{user?.points} XP</Text>
                </View>
                <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${(user?.points % 100) || 10}%` }]} />
                </View>
                <Text style={styles.milestoneText}>Tap here to continue your adventure! ➔</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.grid}>
            <View style={styles.statBox}><Ionicons name="star" size={30} color="#FFD700" /><Text style={styles.statNumber}>{user?.points}</Text><Text style={styles.statDesc}>Total XP</Text></View>
            <View style={styles.statBox}><Ionicons name="flame" size={30} color="#FF7043" /><Text style={styles.statNumber}>5</Text><Text style={styles.statDesc}>Day Streak</Text></View>
          </View>

          <Text style={styles.sectionLabel}>MY BADGES 🏆</Text>
          <View style={styles.badgesCard}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['cat', 'pin', 'dog', 'weather-sunny', 'ship-wheel'].map((icon, index) => (
                <View key={index} style={styles.badgeCircle}><MaterialCommunityIcons name={icon} size={35} color={COLORS.primary} /></View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scroll: { padding: 25 },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.text, marginBottom: 20 },
  glassCard: { backgroundColor: 'white', borderRadius: 35, padding: 25, elevation: 8, marginBottom: 25 },
  levelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  levelText: { fontWeight: '900', color: '#455A64', fontSize: 20 },
  xpText: { fontWeight: 'bold', color: COLORS.primary, fontSize: 16 },
  progressBarBg: { height: 14, backgroundColor: '#F0F0F0', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.success },
  milestoneText: { marginTop: 12, fontSize: 12, color: COLORS.primary, fontWeight: 'bold', textAlign: 'center' },
  grid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statBox: { backgroundColor: 'white', width: '47%', padding: 20, borderRadius: 25, alignItems: 'center', elevation: 4 },
  statNumber: { fontSize: 22, fontWeight: '900', color: COLORS.text, marginTop: 5 },
  statDesc: { fontSize: 11, fontWeight: 'bold', color: '#B0BEC5' },
  sectionLabel: { fontSize: 13, fontWeight: '900', color: '#90A4AE', marginBottom: 15, letterSpacing: 1 },
  badgesCard: { backgroundColor: 'white', borderRadius: 25, padding: 20, elevation: 4 },
  badgeCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
});

export default StudentStats;