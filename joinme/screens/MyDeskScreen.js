import React, { useState, useEffect } from 'react'
import { Stitch, AnonymousCredential, UserPasswordCredential, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';

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

  useEffect(()=> {
    onLoad();
  });

  // console.log('ID from my desk screen: ', currentUserId);
  // console.log('User from my desk screen: ', user);
  function onLoad() {
    // Get the existing Stitch client.
    const stitchClient = Stitch.getAppClient("joinme-ufpra");

    // Get a client of the Remote Mongo Service for database access
    const mongoClient = stitchClient.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')

    // Retrieve a database object
    const db = mongoClient.db('joinme')

    // Retrieve the collection in the database
    const movieDetails = db.collection('posts')

    // Find 10 documents and log them to console.
    movieDetails.find({}, {limit: 10})
      .toArray()
      .then(results => console.log('Results:', results))
  }

  function createNewPost() {
    alert('Creating new post alert!');
    console.log()
  }

  // const [ currentUserId, setCurrentUserId ] = useState( null );
  const [ email, setEmail ] = useState(null);
  const [ UserAuth, setUserAuth ] = useState(null);

 
  return(
    <View style={{ alignItems: 'center', marginTop: 10}}>
      <Text>Welcome back, {user.email}!</Text>
      <Button 
        title="Create a new post"         
        style={{ marginVertical: 50 }}
        onPress={createNewPost}
      />
    </View>
  );
};

export default MyDeskScreen;