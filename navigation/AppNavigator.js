import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

// Import your screens
import LoginScreen from '../screens/LoginScreen';
import Dashboard from '../screens/Dashboard';

const Stack = createStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator  
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} // Hides the default top bar
      >
        {/* Screen 1: Login */}
        <Stack.Screen name="Login" component={LoginScreen} />
        {/* Screen 2: Dashboard */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;