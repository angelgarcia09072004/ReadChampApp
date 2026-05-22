import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// --- AUTH SCREENS ---
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// --- DASHBOARD NAVIGATORS ---
import MainTabs from './MainTabs';       
import TeacherTabs from './TeacherTabs'; 

// --- STUDENT SCREENS (added TutorialScreen) ---
import TutorialScreen from '../screens/student/TutorialScreen';
import LessonScreen from '../screens/student/LessonScreen';

// --- TEACHER SCREENS ---
import StudentDetail from '../screens/teacher/StudentDetail';
import RoomDetail from '../screens/teacher/RoomDetail';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Tutorial" 
        screenOptions={{ headerShown: false }}
      >
        {/* 1. AUTHENTICATION FLOW */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* 2. STUDENT INTERFACE */}
        <Stack.Screen name="Tutorial" component={TutorialScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="LessonScreen" component={LessonScreen} /> 

        {/* 3. TEACHER INTERFACE */}
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
        <Stack.Screen name="StudentDetail" component={StudentDetail} />
        <Stack.Screen name="RoomDetail" component={RoomDetail} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;