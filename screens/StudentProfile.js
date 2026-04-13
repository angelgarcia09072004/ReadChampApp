import React from 'react';
import { 
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, 
  TextInput, StatusBar, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const StudentProfile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 1. AVATAR SECTION */}
          <View style={styles.avatarContainer}>
            <LinearGradient colors={[COLORS.primary, '#FF80AB']} style={styles.avatarGlow}>
                <View style={styles.avatarInner}>
                    <Text style={{ fontSize: 60 }}>🧒</Text>
                </View>
            </LinearGradient>
            <TouchableOpacity style={styles.editBadge}>
                <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Angel Garcia</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>LEVEL 5 CHAMPION 🏆</Text>
          </View>

          {/* 2. LINKING CARD */}
          <View style={styles.linkCard}>
            <Text style={styles.cardTitle}>Account Linking ✨</Text>
            <Text style={styles.cardSubtitle}>Enter the code from your Teacher or Parent</Text>
            
            <TextInput 
                style={styles.input} 
                placeholder="Ex: TEACH-123" 
                placeholderTextColor="#B0BEC5"
            />
            
            <TouchableOpacity activeOpacity={0.8}>
                <LinearGradient colors={[COLORS.primary, '#64B5F6']} style={styles.connectBtn}>
                    <Text style={styles.connectBtnText}>CONNECT ACCOUNT</Text>
                </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* 3. LOGOUT AREA */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={() => navigation.replace('Welcome')}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF5252" />
            <Text style={styles.logoutText}>Log Out of ReadChamp</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  content: { flex: 1, alignItems: 'center', padding: 30 },
  
  avatarContainer: { marginTop: 20, marginBottom: 15, position: 'relative' },
  avatarGlow: { width: 130, height: 130, borderRadius: 65, padding: 5, justifyContent: 'center', alignItems: 'center' },
  avatarInner: { width: 120, height: 120, borderRadius: 60, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' },
  editBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: COLORS.primary, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white' },

  name: { fontSize: 28, fontWeight: '900', color: '#455A64', marginBottom: 5 },
  levelBadge: { backgroundColor: '#FFB300', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 20 },
  levelBadgeText: { color: 'white', fontWeight: '900', fontSize: 12 },

  linkCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 30,
    padding: 25,
    marginTop: 40,
    elevation: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 15,
  },
  cardTitle: { fontSize: 20, fontWeight: '900', color: '#455A64', textAlign: 'center' },
  cardSubtitle: { fontSize: 13, color: '#90A4AE', textAlign: 'center', marginBottom: 20, fontWeight: '600' },
  input: { backgroundColor: '#F7F7F7', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#ECEFF1', fontSize: 16, textAlign: 'center', marginBottom: 15 },
  connectBtn: { padding: 15, borderRadius: 15, alignItems: 'center' },
  connectBtnText: { color: 'white', fontWeight: '900', letterSpacing: 1 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 'auto', marginBottom: 20 },
  logoutText: { color: '#FF5252', fontWeight: 'bold', marginLeft: 8 }
});

export default StudentProfile;