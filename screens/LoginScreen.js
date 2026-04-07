import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, SafeAreaView } from 'react-native';
import GameButton from '../components/GameButton';
import { COLORS } from '../theme';
import API from '../services/api'; // This is our Axios connection

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // 1. Send data to Laravel
      const response = await API.post('/login', {
        email: email,
        password: password,
      });

      // 2. If successful, go to Dashboard
      if (response.status === 200) {
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      Alert.alert("Login Failed", "Check your email and password!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome Back! 🏆</Text>
      
      <View style={styles.form}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput 
          style={styles.input} 
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <GameButton title="Sign In" color={COLORS.success} onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginVertical: 40 },
  form: { width: '100%' },
  label: { fontSize: 16, fontWeight: 'bold', color: '#4B4B4B', marginBottom: 5 },
  input: {
    backgroundColor: '#F7F7F7',
    padding: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    marginBottom: 20,
    fontSize: 16
  }
});

export default LoginScreen;