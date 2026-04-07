import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameButton from '../components/GameButton';
import API from '../services/api';
import { COLORS } from '../theme';

const RegisterScreen = ({ route, navigation }) => {
  // Get the role from the previous screen (Student, Parent, or Teacher)
  const { role } = route.params; 

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await API.post('/register', {
        name: name,
        email: email,
        password: password,
        password_confirmation: password, // Laravel Breeze needs this
        role: role,
      });

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Success!", `Welcome to ReadChamp, ${name}!`);
        navigation.navigate('Dashboard');
      }
    } catch (error) {
      console.log(error.response.data);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#E1F5FE', '#FCE4EC']} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Creating {role} Account 🏆</Text>
          
          <View style={styles.formCard}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter name" />

            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry />

            <View style={{ marginTop: 20 }}>
              <GameButton title="START LEARNING!" color={COLORS.success} onPress={handleRegister} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 25, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.primary, marginVertical: 30, textAlign: 'center' },
  formCard: { backgroundColor: 'white', width: '100%', borderRadius: 25, padding: 20, elevation: 5 },
  label: { fontSize: 12, fontWeight: '900', color: '#B0BEC5', marginBottom: 5, marginTop: 15 },
  input: { backgroundColor: '#F7F7F7', padding: 15, borderRadius: 15, borderWidth: 2, borderColor: '#E5E5E5', fontSize: 16 }
});

export default RegisterScreen;