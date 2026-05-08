import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Auth Screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import RoleSelectionScreen from '../screens/auth/RoleSelectionScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import StudentDetail from '../screens/teacher/StudentDetail';
import RoomDetail from '../screens/teacher/RoomDetail';
import LessonScreen from '../screens/student/LessonScreen';

// Role Navigators
import MainTabs from './MainTabs';       // For Students
import TeacherTabs from './TeacherTabs'; // For Teachers

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Dashboard Navigators */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
        <Stack.Screen name="StudentDetail" component={StudentDetail} />
        <Stack.Screen name="RoomDetail" component={RoomDetail} />
        <Stack.Screen name="LessonScreen" component={LessonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;