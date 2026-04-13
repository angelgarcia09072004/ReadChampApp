import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Role-Based Tab Navigators
import MainTabs from './MainTabs'; // Student
import TeacherTabs from './TeacherTabs'; // Teacher
import ParentTabs from './ParentTabs'; // Parent

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        {/* Auth Flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Dashboards */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
        <Stack.Screen name="ParentTabs" component={ParentTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;