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


function RecruitScreen({ route, navigation }) {
  const { currentUserId, user } = route.params;

  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const [ email, setEmail ] = useState( '' );
  const [ UserAuth, setUserAuth ] = useState(null);

 
  return(
    <View style={{ alignItems: 'center', marginTop: 10}}>
      <Text>Welcome back, {user.email}!</Text>
      <Button 
        title="Recruit new crews"         
        style={{ marginVertical: 50 }}
      />
    </View>
  );
};

export default RecruitScreen;