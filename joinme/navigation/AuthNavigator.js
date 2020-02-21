import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import { TransitionSpecs } from '@react-navigation/stack';
<<<<<<< HEAD
import ProfileSettingScreen from '../screens/ProfileSettingScreen';
=======
>>>>>>> 4a88f891e45a4fe77d5ae7ca3e4fe8cc1504ca38
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
                      options={{ gestureEnabled: false}
                      }/>
        <Stack.Screen name="Profile Settings" 
                      component={ProfileSettingScreen} 
                      options={{ gestureEnabled: false}
                      }/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AuthNavigator;