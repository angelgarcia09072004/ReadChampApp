import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme';

const RoleCard = ({ emoji, title, color, onPress }) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
    <Text style={styles.emoji}>{emoji}</Text>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.arrow}>➔</Text>
  </TouchableOpacity>
);

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* CENTERED CONTENT BOX */}
        <View style={styles.centerContainer}>
          <Text style={styles.headerTitle}>Join the Team! ✨</Text>
          <Text style={styles.headerSubtitle}>Choose your role to sign up</Text>

          <RoleCard 
            emoji="🧒" 
            title="Student" 
            color={COLORS.primary}
            onPress={() => navigation.navigate('Register', { role: 'student' })}
          />

          <RoleCard 
            emoji="👪" 
            title="Parent" 
            color={COLORS.success}
            onPress={() => navigation.navigate('Register', { role: 'parent' })}
          />

          <RoleCard 
            emoji="👩‍🏫" 
            title="Teacher" 
            color="#FFB300" 
            onPress={() => navigation.navigate('Register', { role: 'teacher' })}
          />

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, justifyContent: 'center' }, // Centering logic
  centerContainer: { paddingHorizontal: 30, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.primary, marginBottom: 5 },
  headerSubtitle: { fontSize: 16, color: '#78909C', fontWeight: 'bold', marginBottom: 40 },
  card: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 25,
    borderWidth: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  emoji: { fontSize: 35, marginRight: 20 },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#455A64', flex: 1 },
  arrow: { fontSize: 20, color: COLORS.primary, fontWeight: 'bold' },
  backLink: { marginTop: 30, color: COLORS.primary, fontWeight: '900', fontSize: 14, textTransform: 'uppercase' }
});

export default RoleSelectionScreen;