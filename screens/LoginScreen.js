import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* --- YOUR MASCOT IMAGE --- */}
        <Image 
          source={require('../assets/mascot.png')} 
          style={styles.logoImage}
          resizeMode="contain"
        />

        <Text style={styles.title}>ReadChamp</Text>
        <Text style={styles.subtitle}>Ready to become a reading champion?</Text>
        
        <View style={styles.buttonContainer}>
          <GameButton 
            title="Let's Play!" 
            color={COLORS.primary} 
            onPress={() => navigation.navigate('Dashboard')} 
          />
          
          <Text style={styles.footerText}>Already have an account? Log In</Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logoImage: {
    width: 250,  // Adjust size as needed
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  footerText: {
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default LoginScreen;