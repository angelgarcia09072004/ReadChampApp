import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Add this
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* 1. SOFT PASTEL GRADIENT BACKGROUND */}
      <LinearGradient
        colors={['#E1F5FE', '#FCE4EC']} // Pastel Blue to Pastel Pink
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* 2. CENTERED & ZOOMED MASCOT */}
          <View style={styles.imageContainer}>
            <Image 
              source={require('../assets/mascot.png')} 
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>

          {/* 3. REPOSITIONED TEXT (Moved Upward) */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>ReadChamp</Text>
            <Text style={styles.subtitle}>
              Ready to become a reading champion? 🏆
            </Text>
          </View>

          {/* 4. POLISHED BUTTON AREA */}
          <View style={styles.buttonContainer}>
            <GameButton 
              title="LET'S PLAY!" 
              color={COLORS.primary} 
              onPress={() => navigation.navigate('RoleSelection')} 
            />
            
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.loginLink}>Log In</Text>
            </Text>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    paddingTop: 40, // Keeps everything balanced
  },
  imageContainer: {
    flex: 3, // Occupies more space to allow mascot to be "the focus"
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mascot: {
    width: width * 0.85, // Zooms in the mascot to 85% of screen width
    height: width * 0.85,
    // Add a slight "soft shadow" effect to the mascot
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  textContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'flex-start', // Pulls text slightly upward
    marginTop: -20, // Fine-tuning text position
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.05)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  subtitle: {
    fontSize: 19,
    textAlign: 'center',
    color: '#607D8B', // Soft blue-grey for readability
    fontWeight: '600',
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  footerText: {
    marginTop: 15,
    color: '#90A4AE',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loginLink: {
    color: COLORS.primary,
    fontWeight: '900',
  }
});

export default WelcomeScreen;