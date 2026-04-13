import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  Alert, SafeAreaView, KeyboardAvoidingView, Platform, 
  Dimensions, ActivityIndicator, TouchableOpacity 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import GameButton from '../../components/GameButton';
import API from '../../services/api';
import { COLORS } from '../../theme';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ route, navigation }) => {
  // 1. GET THE ROLE FROM PREVIOUS SCREEN
  const { role } = route.params || { role: 'student' }; 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;
    if (!name.trim()) tempErrors.name = "Name is required.";
    if (!email.trim()) tempErrors.email = "Email is required.";
    else if (!emailRegex.test(email)) tempErrors.email = "Enter a valid email.";
    if (password.length < 8) tempErrors.password = "Min. 8 characters.";
    if (password !== confirmPassword) tempErrors.confirm = "Passwords do not match.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await API.post('/register', {
          name, email, password,
          password_confirmation: confirmPassword,
          role,
        });

        if (response.status === 201 || response.status === 204 || response.status === 200) {
          Alert.alert("Success! 🏆", "Account created!");

          // --- REDIRECT BASED ON ROLE ---
          if (role === 'student') {
            navigation.replace('MainTabs'); // Student Map
          } else if (role === 'teacher') {
            navigation.replace('TeacherTabs'); // Ms. Garcia Dashboard
          } else if (role === 'parent') {
            navigation.replace('ParentTabs'); // Parent Dashboard
          }
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
        } else {
          Alert.alert("Error", "Network problem. Check Laravel!");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Text style={styles.title}>Creating {role} Account 🏆</Text>
            <View style={styles.formCard}>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput style={[styles.input, errors.name && styles.inputError]} value={name} onChangeText={(t) => setName(t)} placeholder="Full Name" placeholderTextColor="#BDBDBD" />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput style={[styles.input, errors.email && styles.inputError]} value={email} onChangeText={(t) => setEmail(t)} placeholder="@.com" placeholderTextColor="#BDBDBD" keyboardType="email-address" autoCapitalize="none" />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput style={[styles.input, styles.passwordInput]} value={password} onChangeText={(t) => setPassword(t)} placeholder="•••••" placeholderTextColor="#BDBDBD" secureTextEntry={!showPassword} />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off" : "eye"} size={22} color="#B0BEC5" />
                    </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>CONFIRM PASSWORD</Text>
                <View style={styles.passwordWrapper}>
                    <TextInput style={[styles.input, styles.passwordInput]} value={confirmPassword} onChangeText={(t) => setConfirmPassword(t)} placeholder="•••" placeholderTextColor="#BDBDBD" secureTextEntry={!showConfirmPassword} />
                    <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={22} color="#B0BEC5" />
                    </TouchableOpacity>
                </View>
                {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
              </View>

              <View style={styles.buttonWrapper}>
                {loading ? <ActivityIndicator size="large" color={COLORS.primary} /> : <GameButton title="START LEARNING!" color={COLORS.success} onPress={handleRegister} />}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.primary, marginBottom: 20, textAlign: 'center', textTransform: 'capitalize' },
  formCard: { backgroundColor: 'white', width: width * 0.9, borderRadius: 30, padding: 25, elevation: 5 },
  inputGroup: { marginBottom: 15, width: '100%' },
  label: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', marginBottom: 5, marginLeft: 5 },
  input: { backgroundColor: '#F7F7F7', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#E5E5E5', fontSize: 15, color: '#4B4B4B' },
  passwordWrapper: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: 'absolute', right: 15, height: '100%', justifyContent: 'center' },
  inputError: { borderColor: '#FF4B4B' },
  errorText: { color: '#FF4B4B', fontSize: 11, marginTop: 5, fontWeight: 'bold' },
  buttonWrapper: { marginTop: 10 },
});

export default RegisterScreen;