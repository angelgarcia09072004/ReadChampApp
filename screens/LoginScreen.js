import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Dimensions, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';
import API from '../services/api'; // Your Axios connection to Laravel

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Validation
    if (!email || !password) {
      Alert.alert("Oops!", "Please type your email and password! ✨");
      return;
    }

    setLoading(true);

    try {
      // 2. Call Laravel API Login Endpoint
      const response = await API.post('/login', {
        email: email,
        password: password,
      });

      // 3. Handle Success
      if (response.status === 200) {
        // We assume your Laravel API returns the user object: { user: { role: 'student', name: 'Angel' } }
        const user = response.data.user; 

        Alert.alert("Welcome Back!", `Ready to learn, ${user.name}? 🏆`);

        // 4. ROLE-BASED REDIRECTION
        if (user.role === 'student') {
          navigation.replace('MainTabs'); // Goes to Student Map/Home
        } else if (user.role === 'parent') {
          navigation.replace('ParentDashboard'); // You'll create this screen next
        } else if (user.role === 'teacher') {
          navigation.replace('TeacherDashboard'); // You'll create this screen next
        }
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Login Failed", 
        "We couldn't find that account. Please check your email and password! 🧐"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* PASTEL BACKGROUND */}
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* ZOOMED MASCOT */}
            <View style={styles.imageContainer}>
              <Image 
                source={require('../assets/mascot.png')} 
                style={styles.mascot}
                resizeMode="contain"
              />
            </View>

            {/* CENTERED LOGIN CARD */}
            <View style={styles.formCard}>
              <Text style={styles.title}>Welcome Back!</Text>
              <Text style={styles.subtitle}>Log in to continue your journey</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput 
                  style={styles.input}
                  placeholder="example@email.com"
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
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <View style={styles.buttonWrapper}>
                {loading ? (
                  <ActivityIndicator size="large" color={COLORS.primary} />
                ) : (
                  <GameButton 
                    title="LOG IN" 
                    color={COLORS.success} 
                    onPress={handleLogin} 
                  />
                )}
              </View>

              <Text 
                style={styles.signUpLink} 
                onPress={() => navigation.navigate('RoleSelection')}
              >
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
  scrollContent: { 
    flexGrow: 1, 
    alignItems: 'center', 
    justifyContent: 'center', // VERTICALLY CENTERED
    paddingBottom: 40,
    paddingTop: 20
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: -30, // Pulls mascot closer to the card
    zIndex: 1,
  },
  mascot: {
    width: width * 0.75, // Zoomed focus
    height: width * 0.75,
  },
  formCard: {
    backgroundColor: 'white',
    width: width * 0.9,
    borderRadius: 35,
    padding: 30,
    elevation: 10,   // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: '#90A4AE',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: '#B0BEC5',
    marginBottom: 8,
    marginLeft: 5,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#F7F7F7',
    padding: 18,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    fontSize: 16,
    color: '#4B4B4B',
    fontWeight: '600',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  signUpLink: {
    textAlign: 'center',
    marginTop: 25,
    color: '#90A4AE',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default LoginScreen;