import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import BottomTabNavigator from './BottomTabNavigator';
import EditProfileScreen from '../screens/EditProfileScreen';
import { TransitionSpecs } from '@react-navigation/stack';
import ProfileSettingScreen from '../screens/profile-settings-2/ProfileSettingScreen';
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
<<<<<<< HEAD
                      options={{
                        gestureEnabled: false, 
                        transitionSpec: {
                          open: TransitionSpecs.TransitionIOSSpec,
                          close: TransitionSpecs.TransitionIOSSpec,
                        },
                      }}
        />
=======
                      options={{ gestureEnabled: false}
                      }/>
        <Stack.Screen name="Profile Settings" 
                      component={ProfileSettingScreen} 
                      options={{ gestureEnabled: false}
                      }/>
>>>>>>> 71069b17eff22d12b73c6b193f05b4d69fd7c648
      </Stack.Navigator>
    </NavigationContainer>
  )
}
export default AuthNavigator;