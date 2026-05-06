import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

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
          let iconName = route.name === 'Dashboard' ? 'grid' : route.name === 'Students' ? 'people' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarStyle: { height: 70, paddingBottom: 10, borderTopWidth: 1, borderTopColor: '#ECEFF1' },
        tabBarLabelStyle: { fontWeight: '900', fontSize: 11, marginBottom: 5 }
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherHome} />
      <Tab.Screen name="Students" component={TeacherStudents} />
      <Tab.Screen name="Profile" component={TeacherProfile} />
    </Tab.Navigator>
  );
};

export default TeacherTabs;