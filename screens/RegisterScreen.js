import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  Alert, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import API from '../services/api';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ route, navigation }) => {
  const { role } = route.params || { role: 'student' }; 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!name.trim()) tempErrors.name = "The name field is required.";
    if (!email.trim()) {
      tempErrors.email = "The email field is required.";
    } else if (!emailRegex.test(email)) {
      tempErrors.email = "Enter a valid email (missing @ or .com).";
    }
    if (!password) {
      tempErrors.password = "The password field is required.";
    } else if (password.length < 8) {
      tempErrors.password = "The password must be at least 8 characters.";
    }
    if (password !== confirmPassword) {
      tempErrors.confirm = "The password confirmation does not match.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await API.post('/register', {
          name,
          email,
          password,
          password_confirmation: confirmPassword,
          role,
        });

        if (response.status === 201 || response.status === 204 || response.status === 200) {
          Alert.alert("Success! 🏆", "Account created!");
          navigation.replace('MainTabs'); 
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
                <TextInput 
                    style={[styles.input, errors.name && styles.inputError]} 
                    value={name} 
                    onChangeText={(t) => { setName(t); setErrors({...errors, name: null}); }}
                    placeholder="Angel Garcia" 
                    placeholderTextColor="#BDBDBD"
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput 
                    style={[styles.input, errors.email && styles.inputError]} 
                    value={email} 
                    onChangeText={(t) => { setEmail(t); setErrors({...errors, email: null}); }}
                    placeholder="angel@gmail.com" 
                    placeholderTextColor="#BDBDBD"
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <TextInput 
                    style={[styles.input, errors.password && styles.inputError]} 
                    value={password} 
                    onChangeText={(t) => { setPassword(t); setErrors({...errors, password: null}); }}
                    placeholder="Min. 8 characters" 
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry 
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CONFIRM PASSWORD</Text>
                <TextInput 
                    style={[styles.input, errors.confirm && styles.inputError]} 
                    value={confirmPassword} 
                    onChangeText={(t) => { setConfirmPassword(t); setErrors({...errors, confirm: null}); }}
                    placeholder="Repeat password" 
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry 
                />
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
  title: { fontSize: 32, fontWeight: '900', color: COLORS.primary, marginBottom: 20, textAlign: 'center' },
  formCard: { backgroundColor: 'white', width: width * 0.9, borderRadius: 30, padding: 25, elevation: 5 },
  inputGroup: { marginBottom: 15, width: '100%' },
  label: { fontSize: 11, fontWeight: '900', color: '#B0BEC5', marginBottom: 5 },
  input: { backgroundColor: '#F7F7F7', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#E5E5E5', fontSize: 15, color: '#4B4B4B' },
  inputError: { borderColor: '#FF4B4B' },
  errorText: { color: '#FF4B4B', fontSize: 11, marginTop: 5, fontWeight: 'bold' },
  buttonWrapper: { marginTop: 10 },
});

export default RegisterScreen;