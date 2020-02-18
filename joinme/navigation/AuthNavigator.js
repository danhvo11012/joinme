import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import EditFormScreen from '../screens/EditFormScreen';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerLeft: null }}  >
        <Stack.Screen name="Auth" component={LoginScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="App"  component={BottomTabNavigator}/>
        <Stack.Screen name="Edit-Profile" component={EditFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AuthNavigator;