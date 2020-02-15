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


function RecruitScreen() {
  
  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const [ email, setEmail ] = useState( '' );
  const [ UserAuth, setUserAuth ] = useState(null);

 
  return(
    <>
      <Text containerStyle={{justifyContent: "center"}}>Welcome back, user!</Text>
      <Input placeHolder="Email" />
      <Button title="Do nothing" containerStyle={{justifyContent: "center", alignItems: "center"}} style={{width: 200}} />
    </>
  );
};

export default RecruitScreen;