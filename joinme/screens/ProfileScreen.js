import React, { useState, useEffect } from 'react'
import { Stitch, AnonymousCredential, UserPasswordCredential } from 'mongodb-stitch-react-native-sdk';

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

function ProfileScreen( { route, navigation }) {
  const { currentUserId, user } = route.params;

  const logOut = async () => {
       const client = Stitch.getAppClient("joinme-ufpra");
      
        client.auth.logout().then(user => {
          console.log(`User ${currentUserId} successfully logged out`);
          
          navigation.navigate('Auth', {
            currentUserId: currentUserId
          }); 
        }).catch(err => {
          console.log(`User ${user} failed to log out: ${err}`);
        });
      
  }
 
  return(
    <View style={{ alignItems: 'center', marginTop: 10}}>
      <Text>My Profile is here!</Text>
      <Button 
        title="Log out"         
        style={{ marginVertical: 50 }}
        onPress={logOut}
      />
    </View>
  );
};

export default ProfileScreen;