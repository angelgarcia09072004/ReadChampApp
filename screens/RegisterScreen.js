import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, ScrollView, 
  Alert, SafeAreaView, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import API from '../services/api';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ route, navigation }) => {
  // 1. GET THE ROLE PASSED FROM ROLE SELECTION
  const { role } = route.params || { role: 'student' }; 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Basic Validation
    if (!name || !email || !password) {
      Alert.alert("Oops!", "Please fill in all the boxes! ✨");
      return;
    }

    try {
      const response = await API.post('/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: password, // Required by Laravel Breeze
        role: role,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success!", `Welcome to ReadChamp, ${name}! 🏆`);
        
        // 2. ROLE-BASED REDIRECTION
        if (role === 'student') {
          navigation.replace('MainTabs'); // Goes to Student Map
        } else if (role === 'parent') {
          navigation.replace('ParentDashboard'); // Create this screen next
        } else {
          navigation.replace('TeacherDashboard'); // Create this screen next
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "That email might already be taken, or your password is too short (need 8 chars).");
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
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
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
                <Text style={styles.label}>PASSWORD</Text>
                <TextInput 
                    style={styles.input} 
                    value={password} 
                    onChangeText={setPassword} 
                    placeholder="Create a password (min 8)" 
                    secureTextEntry 
                />
              </View>

              <View style={styles.buttonWrapper}>
                <GameButton title="START LEARNING!" color={COLORS.success} onPress={handleRegister} />
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
    justifyContent: 'center', // VERTICALLY CENTERED
    alignItems: 'center', 
    padding: 25 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: COLORS.primary, 
    marginBottom: 30, 
    textAlign: 'center',
    textTransform: 'capitalize' 
  },
  formCard: { 
    backgroundColor: 'white', 
    width: width * 0.9, 
    borderRadius: 30, 
    padding: 25, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '900', color: '#B0BEC5', marginBottom: 5 },
  input: { 
    backgroundColor: '#F7F7F7', 
    padding: 15, 
    borderRadius: 15, 
    borderWidth: 2, 
    borderColor: '#E5E5E5', 
    fontSize: 16,
    color: '#4B4B4B',
    fontWeight: '600'
  },
  buttonWrapper: { marginTop: 10 },
  backLink: { textAlign: 'center', marginTop: 20, color: '#90A4AE', fontWeight: 'bold' }
});

export default RegisterScreen;