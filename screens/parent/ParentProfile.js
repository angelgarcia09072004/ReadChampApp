import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme';

const ParentProfile = ({ navigation }) => {
  const parentID = "PAR-8812-CHAMP";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarGlow}>
            <View style={styles.avatarInner}><Text style={{ fontSize: 60 }}>👪</Text></View>
          </View>
          <Text style={styles.name}>Mr. Garcia</Text>
          <Text style={styles.roleLabel}>Guardian Account</Text>

          <View style={styles.idCard}>
            <Text style={styles.cardLabel}>YOUR PARENT ID</Text>
            <Text style={styles.idText}>{parentID}</Text>
            <TouchableOpacity style={styles.copyBtn}>
                <Ionicons name="copy-outline" size={20} color="white" />
                <Text style={styles.copyBtnText}>COPY FOR CHILD</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Welcome')}>
            <Ionicons name="log-out-outline" size={22} color="#FF5252" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0 },
  content: { alignItems: 'center', padding: 25 },
  avatarGlow: { width: 130, height: 130, borderRadius: 65, padding: 5, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  avatarInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  name: { fontSize: 28, fontWeight: '900', color: '#455A64' },
  roleLabel: { fontSize: 14, color: '#78909C', fontWeight: 'bold', marginBottom: 25 },
  idCard: { backgroundColor: 'white', width: '100%', borderRadius: 30, padding: 25, alignItems: 'center', elevation: 8 },
  cardLabel: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', marginBottom: 10 },
  idText: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginBottom: 20 },
  copyBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', padding: 12, borderRadius: 15, width: '100%', justifyContent: 'center' },
  copyBtnText: { color: 'white', fontWeight: '900', marginLeft: 10 },
  logoutBtn: { backgroundColor: 'white', marginTop: 30, padding: 18, borderRadius: 20, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#FFCDD2' },
  logoutText: { color: '#FF5252', fontWeight: '900', marginLeft: 10 }
});

export default ParentProfile;