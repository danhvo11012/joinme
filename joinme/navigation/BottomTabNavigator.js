import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
// import LoginScreen from '../screens/LoginScreen';
import MyDeskScreen from '../screens/MyDeskScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'MyDeskScreen';

export default function BottomTabNavigator({ navigation, route }) {
  // export default function BottomTabNavigator({ navigation, route }) {

  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle:null });

  return (
      <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
        <BottomTab.Screen
          name="MyDesk"
          component={MyDeskScreen}
          options={{
            title: 'My Desk',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          }}
        />
        <BottomTab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          }}
        />
        <BottomTab.Screen
          name="Links"
          component={LinksScreen}
          options={{
            title: 'Resources',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          }}
        />
      </BottomTab.Navigator>
    
  );
}

// function getHeaderTitle(route) {
//   const routeName = route.state?.routes[route.state.index]?.name ?? 'Home';

//   switch (routeName) {
//     case 'Home':
//       return 'How to get started';
//     case 'MyDesk':
//       return 'What\'s on my desk?';
//     case 'Links':
//       return 'Links to learn more';
//   }
//}
