import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import StudentHome from '../screens/StudentHome';
import { COLORS } from '../theme';

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
        tabBarStyle: { height: 70, paddingBottom: 10, borderTopWidth: 2, borderTopColor: '#E5E5E5' }
      })}
    >
      <Tab.Screen name="Home" component={StudentHome} />
      <Tab.Screen name="Stats" component={() => <View><Text>Stats Coming Soon</Text></View>} />
      <Tab.Screen name="Profile" component={() => <View><Text>Profile Coming Soon</Text></View>} />
    </Tab.Navigator>
  );
};

export default MainTabs;