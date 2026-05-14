import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';

import StudentHome from '../screens/student/StudentHome';
import StudentStats from '../screens/student/StudentStats';
import StudentProfile from '../screens/student/StudentProfile';

//SAMPLE COMMENT


//SAMPLE COMMENT 2


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
        tabBarInactiveTintColor: '#B0BEC5',
        tabBarStyle: { height: 70, paddingBottom: 10, borderTopWidth: 1, borderTopColor: '#ECEFF1' },
        tabBarLabelStyle: { fontWeight: '900', fontSize: 11, marginBottom: 5 }
      })}
    >
      <Tab.Screen name="Home" component={StudentHome} />
      <Tab.Screen name="Stats" component={StudentStats} />
      <Tab.Screen name="Profile" component={StudentProfile} />
    </Tab.Navigator>
  );
};

export default MainTabs;