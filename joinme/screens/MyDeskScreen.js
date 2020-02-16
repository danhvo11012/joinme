import React, { useState, useEffect } from 'react'

import { useNavigation } from '@react-navigation/native';

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
} from 'react-native';

import { Input, Button, Icon } from 'react-native-elements';


function MyDeskScreen({ navigation, route }) {
  const { currentUserId } = route.params;
  const { user } = route.params;

  console.log('ID from my desk screen: ', currentUserId);
  console.log('User from my desk screen: ', user);



  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const [ email, setEmail ] = useState( '' );
  const [ UserAuth, setUserAuth ] = useState(null);

 
  return(
    <View>
      <Text containerStyle={{justifyContent: "center"}}>Welcome back, User-{currentUserId}!</Text>
      <Input placeHolder="Email" />
      <Button title="Do nothing" containerStyle={{justifyContent: "center", alignItems: "center"}} style={{width: 200}} />
    </View>
  );
};

export default MyDeskScreen;