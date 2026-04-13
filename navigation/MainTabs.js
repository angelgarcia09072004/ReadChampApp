import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import StudentHome from '../screens/StudentHome';
import StudentStats from '../screens/StudentStats'; // Import this
import StudentProfile from '../screens/StudentProfile'; // Import this
import { COLORS } from '../theme';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Stats') iconName = 'bar-chart';
          else if (route.name === 'Profile') iconName = 'person';
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