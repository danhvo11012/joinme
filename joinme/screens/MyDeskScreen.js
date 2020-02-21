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
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const posts = db.collection('posts');

  const { currentUserId, user } = route.params;

  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ myPosts, setMyPosts] = useState(null);

  useEffect(()=> {
    posts.find({})
      .toArray()
      .then(results => {
        setMyPosts(results);
        setLoadingComplete(true);
      });
  }, []);
    
  

  function createNewPost() {
    alert('Creating new post alert!');
    console.log()
  }

  if (!loadingComplete) { return null } 
  else {
    return(
        <View style={{ alignItems: 'center', marginTop: 10}}>
          <Text>Welcome back, {user.email}!</Text>
            {myPosts.map((post, i) => {
              <>
                console.log(post);
                <Text>Post id: {post._id}</Text>
                <Text>Post owner: {post.owner}</Text>
                <Text>Post owner email: {post.ownerEmail}</Text>
                <Text>Posted date: {post.postDate}</Text>
                <Text>Post content:</Text>
                <Text>{post.content}</Text>
              </>
            })
          }

          <Button 
            title="Create a new post"         
            style={{ marginVertical: 50 }}
            onPress={createNewPost}
          />
        </View> 
    );
  }
};

export default MyDeskScreen;