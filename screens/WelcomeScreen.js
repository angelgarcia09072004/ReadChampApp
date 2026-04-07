import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  // Simple floating animation for the mascot
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -15, duration: 1500, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 1500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.content}>
        {/* 1. ZOOMED & FLOATING MASCOT */}
        <Animated.View style={[styles.imageContainer, { transform: [{ translateY: floatAnim }] }]}>
          <Image 
            source={require('../assets/mascot.png')} 
            style={styles.mascot}
            resizeMode="contain"
          />
        </Animated.View>

        {/* 2. GROUPED TEXT */}
        <View style={styles.textGroup}>
          <Text style={styles.title}>ReadChamp</Text>
          <Text style={styles.subtitle}>Ready to be a reading champion? 🏆📚</Text>
        </View>

        {/* 3. DUAL ACTION BUTTONS */}
        <View style={styles.buttonGroup}>
          <GameButton 
            title="I'M NEW HERE! ✨" 
            color="#FFD700" // Gold/Yellow highlight
            onPress={() => navigation.navigate('RoleSelection')} 
          />
          <View style={{ height: 10 }} />
          <GameButton 
            title="LOG IN" 
            color={COLORS.primary} 
            onPress={() => navigation.navigate('Login')} 
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 40 },
  imageContainer: { flex: 4, justifyContent: 'center', alignItems: 'center' },
  mascot: { width: width * 0.95, height: width * 0.95 },
  textGroup: { flex: 1.5, alignItems: 'center', marginTop: -40 },
  title: { fontSize: 48, fontWeight: '900', color: COLORS.primary, marginBottom: 5 },
  subtitle: { fontSize: 20, color: '#546E7A', fontWeight: 'bold', textAlign: 'center', paddingHorizontal: 40 },
  buttonGroup: { flex: 2, width: '100%', paddingHorizontal: 30, justifyContent: 'center' },
});

export default WelcomeScreen;