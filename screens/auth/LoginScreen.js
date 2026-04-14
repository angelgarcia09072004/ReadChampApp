import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TextInput, 
  SafeAreaView, KeyboardAvoidingView, Platform, 
  ScrollView, Dimensions, Alert, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GameButton from '../../components/GameButton';
import { COLORS } from '../../theme';
import API from '../../services/api';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    setErrors({});
    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : null,
        password: !password ? "Password is required" : null
      });
      return;
    }

    setLoading(true);
    try {
      // 1. We send the selectedRole ('student', 'parent', or 'teacher')
      const response = await API.post('/login', {
        email: email,
        password: password,
        role: selectedRole 
      });

      if (response.status === 200) {
        const user = response.data.user; 
        
        // 2. Navigate based on the role the DATABASE says you are
        if (user.role === 'student') navigation.replace('MainTabs');
        else if (user.role === 'parent') navigation.replace('ParentTabs');
        else if (user.role === 'teacher') navigation.replace('TeacherTabs');
      }
    } catch (error) {
      if (error.response && error.response.status === 422) {
        // This is the error you are seeing in the screenshot
        setErrors({ email: "Credentials do not match our records." });
      } else {
        Alert.alert("Error", "Network problem. Check Laravel!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.imageContainer}>
              <Image source={require('../../assets/mascot.png')} style={styles.mascot} resizeMode="contain" />
            </View>

            <View style={styles.formCard}>
              <Text style={styles.title}>Welcome Back!</Text>
              
              <Text style={styles.labelCenter}>I AM A:</Text>
              <View style={styles.roleContainer}>
                {['student', 'parent', 'teacher'].map((role) => (
                  <TouchableOpacity 
                    key={role}
                    style={[styles.roleButton, selectedRole === role && { backgroundColor: COLORS.primary, borderColor: COLORS.primary }]}
                    onPress={() => setSelectedRole(role)}
                  >
                    <Text style={[styles.roleButtonText, selectedRole === role && { color: 'white' }]}>{role.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput style={[styles.input, errors.email && styles.inputError]} value={email} onChangeText={(t) => setEmail(t)} placeholder="example@email.com" placeholderTextColor="#BDBDBD" autoCapitalize="none" />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput style={[styles.input, styles.passwordInput]} value={password} onChangeText={(t) => setPassword(t)} placeholder="••••••••" placeholderTextColor="#BDBDBD" secureTextEntry={!showPassword} />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#B0BEC5" />
                    </TouchableOpacity>
                </View>
              </View>

              <View style={styles.buttonWrapper}>
                {loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : <GameButton title="LOG IN" color={COLORS.success} onPress={handleLogin} />}
              </View>
              
              <TouchableOpacity onPress={() => navigation.navigate('RoleSelection')}>
                <Text style={styles.signUpLink}>Don't have an account? <Text style={{color: COLORS.primary}}>SIGN UP</Text></Text>
              </TouchableOpacity>
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
  mascot: { width: width * 0.7, height: width * 0.7 },
  formCard: { backgroundColor: 'white', width: width * 0.9, borderRadius: 35, padding: 25, elevation: 10 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.primary, textAlign: 'center', marginBottom: 20 },
  labelCenter: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', textAlign: 'center', marginBottom: 10 },
  roleContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  roleButton: { flex: 1, marginHorizontal: 4, paddingVertical: 8, borderRadius: 12, borderWidth: 2, borderColor: '#F0F0F0', alignItems: 'center' },
  roleButtonText: { fontSize: 10, fontWeight: '900', color: '#B0BEC5' },
  inputGroup: { marginBottom: 15, width: '100%' },
  label: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', marginBottom: 5, marginLeft: 5 },
  input: { backgroundColor: '#F7F7F7', padding: 14, borderRadius: 15, borderWidth: 2, borderColor: '#E5E5E5', fontSize: 15, color: '#4B4B4B' },
  inputError: { borderColor: '#FF4B4B' },
  errorText: { color: '#FF4B4B', fontSize: 11, marginTop: 5, fontWeight: 'bold' },
  passwordWrapper: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 55 },
  eyeIcon: { position: 'absolute', right: 15, height: '100%', justifyContent: 'center' },
  buttonWrapper: { marginTop: 10 },
  signUpLink: { textAlign: 'center', marginTop: 25, color: '#90A4AE', fontWeight: 'bold', fontSize: 14 }
});

export default LoginScreen;