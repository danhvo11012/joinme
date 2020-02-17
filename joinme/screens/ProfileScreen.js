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

function ProfileScreen( { navigation,route }) {
  
  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const { user,currentUserId } = route.params;
  

  logOut = async () => {
       const client = Stitch.getAppClient("joinme-ufpra");
      
        client.auth.logout().then(user => {
          console.log(`User ${currentUserId} successfully logged out`);
          
          navigation.navigate('Auth', {
            currentUserId: currentUserId
          }); 
        }).catch(err => {
          console.log(`User ${user} failed to log out: ${err}`);
          // this.setState({ currentUserId: undefined })
        });
      
  }
 
  return(
    <View style={{justifyContent: "center"}}>
       <Button
          style={{justifyContent: "center", marginTop: '50%'}}
          title="Logout"
          onPress={logOut}
          />
    </View>
  );
};

export default ProfileScreen;