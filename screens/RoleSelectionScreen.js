import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS } from '../theme';

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Who is using ReadChamp today?</Text>
      
      <View style={styles.grid}>
        {/* STUDENT CARD */}
        <TouchableOpacity 
          style={[styles.card, { borderColor: COLORS.primary }]} 
          onPress={() => navigation.navigate('Login', { role: 'student' })}
        >
          <Text style={styles.emoji}>🧒</Text>
          <Text style={styles.roleTitle}>Student</Text>
        </TouchableOpacity>

        {/* PARENT CARD */}
        <TouchableOpacity 
          style={[styles.card, { borderColor: COLORS.success }]} 
          onPress={() => navigation.navigate('Login', { role: 'parent' })}
        >
          <Text style={styles.emoji}>👪</Text>
          <Text style={styles.roleTitle}>Parent</Text>
        </TouchableOpacity>

        {/* TEACHER CARD */}
        <TouchableOpacity 
          style={[styles.card, { borderColor: COLORS.warning }]} 
          onPress={() => navigation.navigate('Login', { role: 'teacher' })}
        >
          <Text style={styles.emoji}>👩‍🏫</Text>
          <Text style={styles.roleTitle}>Teacher</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F7F7', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#4B4B4B', textAlign: 'center', marginTop: 60, marginBottom: 40 },
  grid: { width: '100%', gap: 15 },
  card: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  emoji: { fontSize: 40, marginRight: 20 },
  roleTitle: { fontSize: 22, fontWeight: 'bold', color: '#4B4B4B' },
  backButton: { marginTop: 30, color: COLORS.primary, fontWeight: 'bold', fontSize: 16 }
});

export default RoleSelectionScreen;