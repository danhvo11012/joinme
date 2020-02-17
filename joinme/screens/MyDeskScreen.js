import React, { useState, useEffect } from 'react'

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

function MyDeskScreen({ route, navigation }) {
  const { currentUserId, user } = route.params;


  // console.log('ID from my desk screen: ', currentUserId);
  // console.log('User from my desk screen: ', user);



  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const [ email, setEmail ] = useState(null);
  const [ UserAuth, setUserAuth ] = useState(null);

 
  return(
    <View style={{ alignItems: 'center', marginTop: 10}}>
      <Text>Welcome back, {user.email}!</Text>
      <Button 
        title="Create a new post"         
        style={{ marginVertical: 50 }}
      />
    </View>
  );
};

export default MyDeskScreen;