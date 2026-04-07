import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { 
            toValue: -15, 
            duration: 2000, 
            useNativeDriver: true 
        }),
        Animated.timing(floatAnim, { 
            toValue: 0, 
            duration: 2000, 
            useNativeDriver: true 
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.content}>
        
        {/* 2. ZOOMED & FLOATING MASCOT */}
        <Animated.View style={[styles.imageContainer, { transform: [{ translateY: floatAnim }] }]}>
          <Image 
            source={require('../assets/mascot.png')} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </Animated.View>

        {/* 3. TEXT GROUP (MOVED UP CLOSER TO MASCOT) */}
        <View style={styles.textGroup}>
          <Text style={styles.title}>ReadChamp</Text>
          <Text style={styles.subtitle}>Ready to be a reading champion? 🏆</Text>
        </View>

        {/* 4. BUTTON GROUP (MOVED HIGHER) */}
        <View style={styles.actionArea}>
          <View style={styles.buttonWrapper}>
            <GameButton 
              title="BE A CHAMP!" 
              color={COLORS.primary} 
              onPress={() => navigation.navigate('Login')} 
            />
          </View>
          
          {/* 5. SIGN UP LINK IN THE REMAINING SPACE */}
          <TouchableOpacity 
            style={styles.signUpContainer} 
            onPress={() => navigation.navigate('RoleSelection')}
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
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'flex-start', // Starts items from top to bottom
    paddingHorizontal: 25 
  },
  imageContainer: { 
    height: width * 0.9, // Fixed height to keep it centered
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: 40 
  },
  mascot: { 
    width: width * 0.95, 
    height: width * 0.95 
  },
  textGroup: { 
    alignItems: 'center', 
    marginTop: -20, // Pulls title closer to mascot
    marginBottom: 40 
  },
  title: { 
    fontSize: 48, 
    fontWeight: '900', 
    color: COLORS.primary, 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 18, 
    color: '#607D8B', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    paddingHorizontal: 20 
  },
  actionArea: {
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 10, // Pulls the button area higher
  },
  buttonWrapper: {
    marginBottom: 1, // Space between button and sign up text
  },
  signUpContainer: {
    paddingVertical: 10,
  },
  footerText: { 
    color: '#90A4AE', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 14 
  },
  linkText: { 
    color: COLORS.primary, 
    fontWeight: '900' 
  }
});

export default WelcomeScreen;