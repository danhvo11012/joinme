import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/login/LoginScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Login';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerShown: false});
  const token = 'sdas';// Get this token from LoginScreen
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      { token !== null ? (
        <BottomTab.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Get Started',
            tabBarVisible: false
          }}
        /> ) : ([
        <BottomTab.Screen
          name="Home"
          key= '1'
          component={HomeScreen}
          options={{
            title: 'Resources',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
            
          }}
        />,
        <BottomTab.Screen
          name="Profile"
          key= '2'
          component={ProfileScreen}
          options={{
            title: 'Resources',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
            
          }}
        />]
        )
      }
    </BottomTab.Navigator>
  );
}

// function getHeaderTitle(route) {
//   const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

//   switch (routeName) {
//     case 'Login':
//       return 'How to get started';
//     case 'Home':
//       return 'Links to learn more';
//   }
// }
