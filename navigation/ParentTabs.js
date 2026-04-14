import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import ParentHome from '../screens/parent/ParentHome';
import ParentProfile from '../screens/parent/ParentProfile';

const Tab = createBottomTabNavigator();

const ParentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName = route.name === 'My Child' ? 'heart' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: { height: 70, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="My Child" component={ParentHome} />
      <Tab.Screen name="Profile" component={ParentProfile} />
    </Tab.Navigator>
  );
};

export default ParentTabs;