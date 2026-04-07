import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar } from 'react-native';
import GameButton from '../components/GameButton'; // Make sure this path is correct
import { COLORS } from '../theme'; // Make sure this path is correct

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Set status bar color to match background */}
      <StatusBar barStyle="dark-content" />

      <View style={styles.content}>
        
        {/* 1. THE MASCOT IMAGE */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/mascot.png')} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        {/* 2. THE TEXT AREA */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>ReadChamp</Text>
          <Text style={styles.subtitle}>
            Ready to become a reading champion? 🏆
          </Text>
        </View>

        {/* 3. THE ACTION BUTTON */}
        <View style={styles.buttonContainer}>
          <GameButton 
            title="LET'S PLAY!" 
            color={COLORS.primary} 
            onPress={() => navigation.navigate('RoleSelection')} 
          />
          
          <Text style={styles.footerText}>
            Already have an account? Log In
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean white background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between', // Spaces things out evenly
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flex: 2, // Gives more space to the image
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  mascot: {
    width: '85%',
    height: '85%',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900', // Extra bold for kids
    color: COLORS.primary, // Duolingo Blue
    letterSpacing: 1,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    fontWeight: '600',
    paddingHorizontal: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  footerText: {
    marginTop: 15,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
  }
});

export default WelcomeScreen;