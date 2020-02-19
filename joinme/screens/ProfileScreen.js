import React, { useState, useEffect } from 'react'
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';

import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  Button
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Input, Button as ElementsButton, Icon, Image } from 'react-native-elements';
function ProfileScreen( { route, navigation }) {

  // navigator.setOptions({headerRight: () => (
  //   <Button onPress={logOut} title="Log Out" />
  // )});
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profileDetails = db.collection('profiles');

  const { currentUserId, user } = route.params;
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ profile, setProfile ] = useState(null);


  useEffect(() => {

    const handleSetProfile = (e) => {
      setProfile(e);
    }

    profileDetails.findOne({})
      .then(results => {
        handleSetProfile(results);
        setLoadingComplete(true);
      });

  }, []);

  function openEditScreen() {
    navigation.navigate('Edit Profile', {
      currentUserId: currentUserId, user:user
    }); 
    
  }

  const logOut = async () => {      
        client.auth.logout().then(user => {
          console.log(`User ${currentUserId} successfully logged out`);
          
          navigation.navigate('Auth', {
            currentUserId: currentUserId
          }); 
        }).catch(err => {
          console.log(`User ${user} failed to log out: ${err}`);
        });
  }
  if (!loadingComplete) {
    return null;
  } else {
    return(
      <View style={{ alignItems: 'center', marginTop: 10}}>
        <Image
          source={{uri: profile.avatar}}   
          style={{width: 300, height: 300, marginBottom: 20}} 
        />
        <Text style={{fontSize: 20, marginVertical: 5}}>{profile.userEmail}</Text>
        <Text style={{fontSize: 20, marginVertical: 5}}>{profile.firstName} {profile.lastName}</Text>
        
        <ElementsButton 
          title="Edit profile"         
          style={{ marginVertical: 5 }}
          onPress={openEditScreen}
        />
  
        <ElementsButton 
          title="Log out"         
          style={{ marginVertical: 50 }}
          onPress={logOut}
        />
        
      </View>
    );
  }
};

export default ProfileScreen;
