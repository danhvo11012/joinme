import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import BoardScreen from '../screens/BoardScreen';
import RecruitScreen from '../screens/RecruitScreen';
import ProfileScreen from '../screens/ProfileScreen';
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
          name="Board"
          component={BoardScreen}
          options={{
            title: 'Board',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          }}
        />
        <BottomTab.Screen
          name="Recruit"
          component={RecruitScreen}
          options={{
            title: 'Recruit',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
          }}
        />
        <BottomTab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
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
