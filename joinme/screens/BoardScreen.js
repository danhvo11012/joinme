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
  ScrollView,
} from 'react-native';

import { Input, Button, Icon } from 'react-native-elements';


function BoardScreen({ route, navigation }) {
  const { currentUserId, user } = route.params;

  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const [ email, setEmail ] = useState( '' );
  const [ UserAuth, setUserAuth ] = useState(null);

 
  return(
    <ScrollView>
      <View style={{ alignItems: 'center', marginTop: 10}}>
        <Text>Welcome back, {user.email}!</Text>
        <Button 
          title="Do nothing"         
          style={{ marginVertical: 50 }}
        />
      </View>
    </ScrollView>
  );
};

export default BoardScreen;