import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme';

const RoleCard = ({ emoji, title, subtitle, color, onPress }) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
    <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
    <View style={styles.cardText}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    <Text style={styles.arrow}>➔</Text>
  </TouchableOpacity>
);

const RoleSelectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.headerTitle}>Join the Team! ✨</Text>
          <Text style={styles.headerSubtitle}>Pick your role to start learning</Text>

          <RoleCard 
            emoji="🧒" 
            title="Student" 
            subtitle="Ready for your next level? 🏆"
            color={COLORS.primary}
            onPress={() => alert("Student Registration coming next!")}
          />

          <RoleCard 
            emoji="👪" 
            title="Parent" 
            subtitle="Monitor your child's growth 📊"
            color={COLORS.success}
            onPress={() => alert("Parent Registration coming next!")}
          />

          <RoleCard 
            emoji="👩‍🏫" 
            title="Teacher" 
            subtitle="Manage your champions 📚"
            color="#FFB300" // Gold
            onPress={() => alert("Teacher Registration coming next!")}
          />

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backLink}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scroll: { padding: 25, alignItems: 'center' },
  headerTitle: { fontSize: 32, fontWeight: '900', color: COLORS.primary, marginTop: 20 },
  headerSubtitle: { fontSize: 16, color: '#78909C', fontWeight: 'bold', marginBottom: 30 },
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
  iconCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  emoji: { fontSize: 35 },
  cardText: { marginLeft: 15, flex: 1 },
  cardTitle: { fontSize: 22, fontWeight: 'bold', color: '#455A64' },
  cardSubtitle: { fontSize: 13, color: '#90A4AE', fontWeight: '600' },
  arrow: { fontSize: 20, color: '#CFD8DC', fontWeight: 'bold' },
  backLink: { marginTop: 20, color: COLORS.primary, fontWeight: '900', textTransform: 'uppercase' }
});

export default RoleSelectionScreen;