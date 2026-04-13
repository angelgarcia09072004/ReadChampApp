import React from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  StatusBar, Platform, TouchableOpacity, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const ParentHome = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.subGreeting}>Here’s your child’s progress today 👋</Text>
          <Text style={styles.greeting}>Hi, Mr. Garcia!</Text>

          {/* CHILD FOCUS CARD */}
          <View style={styles.childCard}>
            <View style={styles.childHeader}>
              <View style={styles.avatarLarge}><Text style={{fontSize: 40}}>🧒</Text></View>
              <View style={{flex: 1, marginLeft: 15}}>
                <Text style={styles.childName}>Angel Garcia</Text>
                <Text style={styles.childLevel}>Level 5 • Champion 🏆</Text>
              </View>
              <View style={styles.streakBadge}>
                <Text style={styles.streakText}>🔥 5</Text>
              </View>
            </View>
            
            {/* XP PROGRESS BAR */}
            <View style={styles.xpContainer}>
              <View style={styles.xpTextRow}>
                <Text style={styles.xpLabel}>EXP Progress</Text>
                <Text style={styles.xpValue}>320 / 500</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '64%' }]} />
              </View>
            </View>
          </View>

          {/* RECENT ACTIVITY FEED */}
          <Text style={styles.sectionTitle}>Recent Activity 🕒</Text>
          <View style={styles.activityBox}>
            <View style={styles.activityItem}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.activityText}>Earned 20 XP in "Word Sounds"</Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="trophy" size={20} color={COLORS.primary} />
              <Text style={styles.activityText}>Unlocked "5-Day Streak" Badge</Text>
            </View>
          </View>

          {/* TEACHER COMMUNICATION */}
          <View style={styles.teacherCard}>
            <Text style={styles.teacherTitle}>Message from Ms. Garcia 💬</Text>
            <Text style={styles.teacherMsg}>"Angel is doing great with syllables! Keep encouraging the daily reading."</Text>
            <TouchableOpacity style={styles.contactBtn}>
              <Text style={styles.contactBtnText}>CONTACT TEACHER</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  scrollContent: { padding: 25 },
  greeting: { fontSize: 28, fontWeight: '900', color: '#455A64', marginBottom: 20 },
  subGreeting: { fontSize: 14, color: '#90A4AE', fontWeight: 'bold' },
  childCard: { backgroundColor: 'white', borderRadius: 30, padding: 20, elevation: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  childHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatarLarge: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#E1F5FE', justifyContent: 'center', alignItems: 'center' },
  childName: { fontSize: 22, fontWeight: '900', color: '#455A64' },
  childLevel: { fontSize: 14, color: '#78909C', fontWeight: 'bold' },
  streakBadge: { backgroundColor: '#FFF3E0', padding: 8, borderRadius: 15 },
  streakText: { color: '#FF9800', fontWeight: 'bold' },
  xpContainer: { marginTop: 10 },
  xpTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  xpLabel: { fontSize: 12, fontWeight: 'bold', color: '#90A4AE' },
  xpValue: { fontSize: 12, fontWeight: '900', color: COLORS.primary },
  progressBarBg: { height: 12, backgroundColor: '#F5F5F5', borderRadius: 6, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#455A64', marginTop: 30, marginBottom: 15 },
  activityBox: { backgroundColor: 'white', borderRadius: 25, padding: 15 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  activityText: { marginLeft: 10, color: '#607D8B', fontWeight: '600', fontSize: 13 },
  teacherCard: { backgroundColor: 'rgba(28, 176, 246, 0.1)', borderRadius: 25, padding: 20, marginTop: 20, borderWidth: 1, borderColor: 'rgba(28, 176, 246, 0.2)' },
  teacherTitle: { fontWeight: '900', color: COLORS.primary, marginBottom: 5 },
  teacherMsg: { color: '#546E7A', fontStyle: 'italic', marginBottom: 15 },
  contactBtn: { backgroundColor: COLORS.primary, padding: 12, borderRadius: 15, alignItems: 'center' },
  contactBtnText: { color: 'white', fontWeight: 'bold' }
});

export default ParentHome;