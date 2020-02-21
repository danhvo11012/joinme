import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import BoardScreen from '../screens/BoardScreen';
import RecruitScreen from '../screens/RecruitScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyDeskScreen from '../screens/MyDeskScreen';

import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import {Button} from 'react-native'

const INITIAL_ROUTE_NAME = 'MyDesk';

export default function BottomTabNavigator({ navigation, route }) {
  const { currentUserId } = route.params;
  const { user } = route.params;

  navigation.setOptions({ headerTitle: getHeaderTitle(route)});

  const BottomTab = createMaterialTopTabNavigator();

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
            headerRight: () => (
              <Button title="Log Out" />
            )
          }}
          initialParams={{ currentUserId: currentUserId, user: user }}
        />
    </BottomTab.Navigator>
    
  );
}

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
      return 'Profile';
  }
}

