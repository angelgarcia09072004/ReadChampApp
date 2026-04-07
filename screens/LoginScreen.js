import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {/* 1. MATCHING PASTEL BACKGROUND */}
      <LinearGradient
        colors={['#E1F5FE', '#FCE4EC']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* 2. ZOOMED MASCOT HEADER */}
            <View style={styles.imageContainer}>
              <Image 
                source={require('../assets/mascot.png')} 
                style={styles.mascot}
                resizeMode="contain"
              />
            </View>

            {/* 3. LOGIN FORM BOX */}
            <View style={styles.formContainer}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Log in to continue your journey</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Type your email..."
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="Type your password..."
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonWrapper}>
                <GameButton 
                  title="LOG IN" 
                  color={COLORS.success} 
                  onPress={() => navigation.navigate('Dashboard')} 
                />
              </View>

              <Text style={styles.forgotText} onPress={() => navigation.goBack()}>
                Forgot Password?
              </Text>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    paddingBottom: 40 
  },
  imageContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 220, // Height for the mascot area
    width: '100%',
  },
  mascot: {
    width: width * 0.65, // "Zoomed" focus look
    height: width * 0.65,
  },
  formContainer: {
    backgroundColor: 'white',
    width: width * 0.9,
    borderRadius: 30,
    padding: 25,
    marginTop: -20, // Pulls the card slightly over the mascot area for a modern look
    elevation: 5,   // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#90A4AE',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 25,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B0BEC5',
    marginBottom: 8,
    marginLeft: 5,
  },
  input: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    fontSize: 16,
    color: '#4B4B4B',
    fontWeight: '600',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  forgotText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default LoginScreen;