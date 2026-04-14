import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import TeacherHome from '../screens/teacher/TeacherHome';
import TeacherStudents from '../screens/teacher/TeacherStudents';
import StudentProfile from '../screens/student/StudentProfile';
import TeacherProfile from '../screens/teacher/TeacherProfile';

const Tab = createBottomTabNavigator();

const Placeholder = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Coming Soon</Text>
  </View>
);

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
        tabBarStyle: { height: 70, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="Dashboard" component={TeacherHome} />
      <Tab.Screen name="Students" component={TeacherStudents} />
      <Tab.Screen name="Profile" component={TeacherProfile} />
    </Tab.Navigator>
  );
};

export default TeacherTabs;