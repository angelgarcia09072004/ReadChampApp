import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, 
  SafeAreaView, KeyboardAvoidingView, Platform, 
  ScrollView, Dimensions, Alert, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';
import API from '../services/api';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- ERROR STATE ---
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    if (!email.trim()) tempErrors.email = "The email field is required.";
    if (!password) tempErrors.password = "The password field is required.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    if (validateForm()) {
      setLoading(true);
      try {
        const response = await API.post('/login', {
          email: email,
          password: password,
        });

        if (response.status === 200) {
          const user = response.data.user; 
          if (user.role === 'student') {
            navigation.replace('MainTabs'); 
          } else if (user.role === 'parent') {
            navigation.replace('ParentDashboard');
          } else {
            navigation.replace('TeacherDashboard');
          }
        }
      } catch (error) {
        // If Laravel says the details are wrong, show it in red under the boxes
        if (error.response && error.response.status === 422) {
            setErrors({
                email: "These credentials do not match our records.",
                password: "Check your password again."
            });
        } else {
            Alert.alert("Error", "Network problem. Is your Laravel server running?");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.imageContainer}>
              <Image source={require('../assets/mascot.png')} style={styles.mascot} resizeMode="contain" />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Log in to continue your journey</Text>

              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput 
                  style={[styles.input, errors.email && styles.inputError]}
                  placeholder="example@email.com"
                  placeholderTextColor="#BDBDBD"
                  value={email}
                  onChangeText={(t) => { setEmail(t); setErrors({...errors, email: null}); }}
                  autoCapitalize="none"
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput 
                      style={[styles.input, styles.passwordInput, errors.password && styles.inputError]}
                      placeholder="Enter your password"
                      placeholderTextColor="#BDBDBD"
                      value={password}
                      onChangeText={(t) => { setPassword(t); setErrors({...errors, password: null}); }}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#B0BEC5" />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.buttonWrapper}>
                {loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : (
                  <GameButton title="LOG IN" color={COLORS.success} onPress={handleLogin} />
                )}
              </View>

              <Text style={styles.signUpLink} onPress={() => navigation.navigate('RoleSelection')}>
                Don't have an account? <Text style={{color: COLORS.primary}}>SIGN UP</Text>
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
  scrollContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 40 },
  imageContainer: { justifyContent: 'center', alignItems: 'center', marginBottom: -40, zIndex: 1 },
  mascot: { width: width * 0.75, height: width * 0.75 },
  formCard: { 
    backgroundColor: 'white', width: width * 0.9, borderRadius: 35, padding: 30, 
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 
  },
  title: { fontSize: 32, fontWeight: '900', color: COLORS.primary, textAlign: 'center', marginBottom: 5 },
  subtitle: { fontSize: 15, color: '#90A4AE', textAlign: 'center', fontWeight: 'bold', marginBottom: 30 },
  inputGroup: { marginBottom: 15, width: '100%' },
  label: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', marginBottom: 8, marginLeft: 5, letterSpacing: 1 },
  input: { backgroundColor: '#F7F7F7', padding: 16, borderRadius: 18, borderWidth: 2, borderColor: '#E5E5E5', fontSize: 15, color: '#4B4B4B', fontWeight: '600' },
  inputError: { borderColor: '#FF4B4B' },
  errorText: { color: '#FF4B4B', fontSize: 11, marginTop: 5, marginLeft: 5, fontWeight: 'bold' },
  passwordWrapper: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 55 },
  eyeIcon: { position: 'absolute', right: 15, height: '100%', justifyContent: 'center' },
  buttonWrapper: { marginTop: 10 },
  signUpLink: { textAlign: 'center', marginTop: 25, color: '#90A4AE', fontWeight: 'bold', fontSize: 14 }
});

export default LoginScreen;