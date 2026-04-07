import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReadChamp 🏆</Text>
      <Text style={styles.subtitle}>Welcome back!</Text>
      
      {/* Dashboard */}
      <GameButton 
        title="Let's Play!" 
        color={COLORS.primary} 
        onPress={() => navigation.navigate('Dashboard')} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: 'white' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', color: COLORS.primary },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 30, color: '#666' }
});

export default LoginScreen;