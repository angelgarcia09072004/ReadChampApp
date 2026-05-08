import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

// 1. CHECK THESE PATHS CAREFULLY
import TeacherHome from '../screens/teacher/TeacherHome';
import TeacherStudents from '../screens/teacher/TeacherStudents'; 
import TeacherProfile from '../screens/teacher/TeacherProfile';

const Tab = createBottomTabNavigator();

const TeacherTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Dashboard') iconName = 'grid';
          else if (route.name === 'Students') iconName = 'people';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarStyle: { height: 70, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherHome} />
      
      {/* 2. ENSURE THIS MATCHES THE IMPORT NAME ABOVE */}
      <Tab.Screen name="Students" component={TeacherStudents} /> 
      
      <Tab.Screen name="Profile" component={TeacherProfile} />
    </Tab.Navigator>
  );
};

export default TeacherTabs;