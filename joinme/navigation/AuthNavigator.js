import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import { TransitionSpecs } from '@react-navigation/stack';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="float" screenOptions={{ headerLeft: null}}>
        <Stack.Screen name="Auth" 
                      component={LoginScreen} 
                      options={{ headerShown: false}}/>
        <Stack.Screen name="App"  
                      component={BottomTabNavigator} 
                      options={{ gestureEnabled: false}}/>
        <Stack.Screen name="Edit Profile" 
                      component={EditProfileScreen} 
                      options={[{ gestureEnabled: false},{transitionSpec: {
                        open: TransitionSpecs.TransitionIOSSpec,
                        close: TransitionSpecs.TransitionIOSSpec,
                      },}]}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AuthNavigator;