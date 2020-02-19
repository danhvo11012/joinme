import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import BoardScreen from '../screens/BoardScreen';
import RecruitScreen from '../screens/RecruitScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyDeskScreen from '../screens/MyDeskScreen';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'

const INITIAL_ROUTE_NAME = 'MyDesk';

export default function BottomTabNavigator({ navigation, route }) {
  // export default function BottomTabNavigator({ navigation, route }) {

  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  const { currentUserId } = route.params;
  const { user } = route.params;

  navigation.setOptions({ headerTitle: getHeaderTitle(route)});
    
  return (
      <BottomTab.Navigator 
        tabBarOptions ={{showIcon: true}}
        initialRouteName={INITIAL_ROUTE_NAME} tabBarPosition={'bottom'}>
        <BottomTab.Screen
          name="MyDesk"
          component={MyDeskScreen}
          options={{
            title: 'My Desk',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-desktop" />,
            
          }}
          
          initialParams={{ currentUserId: currentUserId, user: user }}
        />
        <BottomTab.Screen
          name="Board"
          component={BoardScreen}
          options={{
            title: 'Board',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-clipboard"/>,
          }}
          initialParams={{ currentUserId: currentUserId, user: user }}
        />
        <BottomTab.Screen
          name="Recruit"
          component={RecruitScreen}
          options={{
            title: 'Recruit',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person-add" />,
           
          }}
          initialParams={{ currentUserId: currentUserId, user: user }}
        />
        <BottomTab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
            
          }}
          initialParams={{ currentUserId: currentUserId, user: user }}
        />
    </BottomTab.Navigator>
    
  );
}

const BottomTab = createMaterialTopTabNavigator();

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  switch (routeName) {
    case 'MyDesk':
      return 'My desk';
    case 'Board':
      return 'Bulletin Board';
    case 'Recruit':
      return 'Find your crew';
    case 'Profile':
      return 'Profile'
    case 'EditProfile':
      return 'Edit Profile';
  }
}
