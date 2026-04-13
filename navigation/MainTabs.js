import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

// Import from the new STUDENT folder
import StudentHome from '../screens/student/StudentHome';
import StudentStats from '../screens/student/StudentStats';
import StudentProfile from '../screens/student/StudentProfile';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'Home' ? 'home' : route.name === 'Stats' ? 'bar-chart' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={StudentHome} />
      <Tab.Screen name="Stats" component={StudentStats} />
      <Tab.Screen name="Profile" component={StudentProfile} />
    </Tab.Navigator>
  );
};

export default MainTabs;