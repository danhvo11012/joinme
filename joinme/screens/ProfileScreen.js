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
  Button,
  ScrollView,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Input, Button as ElementsButton, Icon, Image } from 'react-native-elements';
function ProfileScreen( { route, navigation }) {

  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profileDetails = db.collection('profiles');

  const { currentUserId, user } = route.params;
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ profile, setProfile ] = useState(null);

  useEffect(() => {
    profileDetails.findOne({})
      .then(results => {
        setProfile(results);
        setLoadingComplete(true);
      });
  }, []);
  
  function openEditScreen() {
    navigation.navigate('Profile Settings', {
      //pass profile data to edit screen
      profile:{
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.userEmail,
          school: profile.school,
          work: 'NASA',
          summary: 'I am a big big girl in the big big world.',
          city: 'Richardson',
          avatar: profile.avatar
       }
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
      <ScrollView>
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
      </ScrollView>
    );
  }
};

export default ProfileScreen;
