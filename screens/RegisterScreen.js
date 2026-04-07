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
  // 1. GET THE ROLE FROM PARAMETERS (Default to student if missing)
  const role = route.params?.role || 'student'; 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Basic Frontend Validation
    if (!name || !email || !password) {
      Alert.alert("Wait! ✋", "Please fill in all the boxes so you can start learning! ✨");
      return;
    }

    if (password.length < 8) {
        Alert.alert("Password too short", "Your password must be at least 8 characters long! 🔑");
        return;
    }

    setLoading(true);

    try {
      console.log("Sending registration request for role:", role);

      // 2. SEND DATA TO LARAVEL API
      const response = await API.post('/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: password, // Required by Laravel Breeze
        role: role, // This goes to your 'role' column in HeidiSQL
      });

      console.log("Registration Success. Status:", response.status);

      // 3. SUCCESSFUL REDIRECTION
      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success! 🏆", `Welcome to ReadChamp, ${name}!`);
        
        // Navigation to the Bottom Tab Map
        navigation.replace('MainTabs'); 
      }
    } catch (error) {
      // 4. DETAILED ERROR HANDLING
      if (error.response) {
        // This tells you EXACTLY what Laravel didn't like (e.g. Email already exists)
        console.log("Laravel Error Data:", error.response.data);
        const errorMessage = error.response.data.message || JSON.stringify(error.response.data.errors);
        Alert.alert("Registration Failed", errorMessage);
      } else {
        console.log("Network/Server Error:", error.message);
        Alert.alert("Network Error", "Cannot connect to the server. Is Laravel running with --host=0.0.0.0?");
      }
    } finally {
      setLoading(false);
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
              <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL NAME</Text>
                <TextInput 
                  style={styles.input} 
                  value={name} 
                  onChangeText={setName} 
                  placeholder="Enter your name" 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput 
                  style={styles.input} 
                  value={email} 
                  onChangeText={setEmail} 
                  placeholder="email@example.com" 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>PASSWORD (Min. 8 characters)</Text>
                <TextInput 
                  style={styles.input} 
                  value={password} 
                  onChangeText={setPassword} 
                  placeholder="Create a password" 
                  secureTextEntry 
                />
              </View>

              <View style={styles.buttonWrapper}>
                {loading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                  <GameButton 
                    title="START LEARNING!" 
                    color={COLORS.success} 
                    onPress={handleRegister} 
                  />
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
    fontSize: 16,
    color: '#90A4AE',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  formCard: { 
    backgroundColor: 'white', 
    width: width * 0.9, 
    borderRadius: 35, 
    padding: 25, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '900', color: '#B0BEC5', marginBottom: 8, letterSpacing: 1 },
  input: { 
    backgroundColor: '#F7F7F7', 
    padding: 18, 
    borderRadius: 18, 
    borderWidth: 2, 
    borderColor: '#E5E5E5', 
    fontSize: 16,
    color: '#4B4B4B',
    fontWeight: '600'
  },
  buttonWrapper: { marginTop: 10 },
  backLink: { textAlign: 'center', marginTop: 25, color: '#90A4AE', fontWeight: 'bold', fontSize: 14 }
});

export default RegisterScreen;