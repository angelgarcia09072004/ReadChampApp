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
  // 1. Get role from parameters
  const { role } = route.params || { role: 'student' }; 

  // --- FORM STATES ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // --- ERROR STATES ---
  const [errors, setErrors] = useState({});

  // 2. VALIDATION LOGIC
  const validateForm = () => {
    let tempErrors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!name.trim()) {
      tempErrors.name = "The name field is required.";
    }

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
          Alert.alert("Success! 🏆", "Account created! Let's go!");
          navigation.replace('MainTabs'); 
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          setErrors(error.response.data.errors);
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
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scroll}>
            
            <Text style={styles.title}>Creating {role} Account 🏆</Text>
            <Text style={styles.subtitle}>Let's start your reading journey!</Text>
            
            <View style={styles.formCard}>
              
              {/* FULL NAME */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput 
                    style={[styles.input, errors.name && styles.inputError]} 
                    value={name} 
                    onChangeText={(text) => { setName(text); setErrors({...errors, name: null}); }}
                    placeholder="Angel Garcia" 
                    placeholderTextColor="#BDBDBD" // Subtle Gray Placeholder
                />
                {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
              </View>

              {/* EMAIL ADDRESS */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput 
                    style={[styles.input, errors.email && styles.inputError]} 
                    value={email} 
                    onChangeText={(text) => { setEmail(text); setErrors({...errors, email: null}); }}
                    placeholder="angel@gmail.com" 
                    placeholderTextColor="#BDBDBD" // Subtle Gray Placeholder
                    keyboardType="email-address" 
                    autoCapitalize="none" 
                />
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* PASSWORD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD</Text>
                <TextInput 
                    style={[styles.input, errors.password && styles.inputError]} 
                    value={password} 
                    onChangeText={(text) => { setPassword(text); setErrors({...errors, password: null}); }}
                    placeholder="Min. 8 characters" 
                    placeholderTextColor="#BDBDBD" // Subtle Gray Placeholder
                    secureTextEntry 
                />
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

              {/* CONFIRM PASSWORD */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>CONFIRM PASSWORD</Text>
                <TextInput 
                    style={[styles.input, errors.confirm && styles.inputError]} 
                    value={confirmPassword} 
                    onChangeText={(text) => { setConfirmPassword(text); setErrors({...errors, confirm: null}); }}
                    placeholder="Repeat your password" 
                    placeholderTextColor="#BDBDBD" // Subtle Gray Placeholder
                    secureTextEntry 
                />
                {errors.confirm && <Text style={styles.errorText}>{errors.confirm}</Text>}
              </View>

              <View style={styles.buttonWrapper}>
                {loading ? (
                    <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                    <GameButton title="START LEARNING!" color={COLORS.success} onPress={handleRegister} />
                )}
              </View>

              <Text style={styles.backLink} onPress={() => navigation.goBack()}>
                Pick a different role
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
  scroll: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 25 
  },
  title: { 
    fontSize: 32, 
    fontWeight: '900', 
    color: COLORS.primary, 
    marginBottom: 5, 
    textAlign: 'center',
    textTransform: 'capitalize' 
  },
  subtitle: {
    fontSize: 15,
    color: '#90A4AE',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: { 
    backgroundColor: 'white', 
    width: width * 0.9, 
    borderRadius: 35, 
    padding: 25, 
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputGroup: { marginBottom: 12 },
  label: { 
    fontSize: 11, 
    fontWeight: '900', 
    color: '#B0BEC5', 
    marginBottom: 5,
    marginLeft: 5,
    letterSpacing: 1
  },
  input: { 
    backgroundColor: '#F7F7F7', 
    padding: 14, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: '#E5E5E5', 
    fontSize: 15,
    color: '#4B4B4B',
    fontWeight: '600'
  },
  inputError: {
    borderColor: '#FF4B4B',
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 11,
    marginTop: 3,
    marginLeft: 5,
    fontWeight: 'bold',
  },
  buttonWrapper: { marginTop: 15 },
  backLink: { 
    textAlign: 'center', 
    marginTop: 15, 
    color: '#90A4AE', 
    fontWeight: 'bold',
    fontSize: 13 
  }
});

export default RegisterScreen;