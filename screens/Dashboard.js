import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { COLORS } from '../theme';
import GameButton from '../components/GameButton';

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.welcome}>Hi, Little Champ! 🌟</Text>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>💎</Text>
              <Text style={styles.statText}>120</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statText}>3 Days</Text>
            </View>
          </View>
        </View>

        {/* Modules Section */}
        <Text style={styles.title}>Choose your adventure:</Text>
        
        <GameButton 
          title="Word Pronunciation" 
          color={COLORS.primary} 
          onPress={() => alert('Starting Word Pronunciation!')} 
        />
        
        <GameButton 
          title="Identify Sound" 
          color={COLORS.success} 
          onPress={() => alert('Starting Sound Game!')} 
        />

        <GameButton 
          title="Syllable Splash" 
          color={COLORS.warning} 
          onPress={() => alert('Starting Syllable Game!')} 
        />

        <GameButton 
          title="Spellcraft Puzzle" 
          color={COLORS.error} 
          onPress={() => alert('Starting Puzzle!')} 
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  statBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
  },
  statText: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#AFAFAF',
    marginBottom: 15,
  }
});

export default Dashboard;