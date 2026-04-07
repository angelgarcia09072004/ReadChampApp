import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.content}>
        {/* ZOOMED MASCOT */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('../assets/mascot.png')} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </View>

        {/* TITLE & SUBTITLE */}
        <View style={styles.textGroup}>
          <Text style={styles.title}>ReadChamp</Text>
          <Text style={styles.subtitle}>Ready to be a reading champion? 🏆📚</Text>
        </View>

        {/* ONE MAIN BUTTON + SIGN UP LINK */}
        <View style={styles.buttonGroup}>
          <GameButton 
            title="BE A CHAMP!" 
            color={COLORS.primary} 
            onPress={() => navigation.navigate('Login')} // Goes to Login
          />
          
          <TouchableOpacity 
            style={styles.signUpContainer} 
            onPress={() => navigation.navigate('RoleSelection')} // Goes to Role Selection
          >
            <Text style={styles.footerText}>
              Don't have an account? <Text style={styles.linkText}>SIGN UP</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 50 },
  imageContainer: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  mascot: { width: width * 0.95, height: width * 0.95 },
  textGroup: { flex: 1.5, alignItems: 'center', marginTop: -30 },
  title: { fontSize: 48, fontWeight: '900', color: COLORS.primary, marginBottom: 5 },
  subtitle: { fontSize: 18, color: '#607D8B', fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 40 },
  buttonGroup: { flex: 1.5, width: '100%', paddingHorizontal: 30, justifyContent: 'center' },
  signUpContainer: { marginTop: 20 },
  footerText: { color: '#90A4AE', fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  linkText: { color: COLORS.primary, fontWeight: '900' }
});

export default WelcomeScreen;