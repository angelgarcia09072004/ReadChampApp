import React from 'react';
import { View, Text } from 'react-native'; // Move these here
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme';
import ParentHome from '../screens/parent/ParentHome'; // Ensure the file is named ParentHome.js

const Tab = createBottomTabNavigator();

// Correct way to make a placeholder
const Placeholder = ({ name }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>{name} Coming Soon</Text>
  </View>
);

const ParentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'My Child') iconName = 'heart';
          else if (route.name === 'Messages') iconName = 'chatbubbles';
          else if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarStyle: { height: 70, paddingBottom: 10 },
      })}
    >
      <Tab.Screen name="My Child" component={ParentHome} />
      <Tab.Screen name="Messages" component={() => <Placeholder name="Messages" />} />
      <Tab.Screen name="Profile" component={() => <Placeholder name="Profile" />} />
    </Tab.Navigator>
  );
};

export default ParentTabs;