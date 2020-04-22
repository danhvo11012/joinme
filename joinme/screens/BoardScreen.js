/**
 * BoardScreen
 * 
 * @author Danh Vo
 * @version 1.0
 */
import React, { useState, useEffect, useCallback } from 'react'
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
  ScrollView,
  Modal,
  Alert,
  Picker,
  ActivityIndicator,
} from 'react-native';

import Post from '../components/Post'
import { Input, Button, Icon, colors, Card } from 'react-native-elements';

import Comment from '../components/Comment';

function BoardScreen({ route, navigation }) {
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const posts = db.collection('posts');
  const comments = db.collection('comments');

  const { currentUserId, user } = route.params;

  //profile, if not existed navigate => ProfileSettingScreen 
  const profiles = db.collection('profiles');

  //posts
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ shouldReload, setShouldReload ] = useState(true );

  const [ profile, setProfile ] = useState(null);
  useEffect(() => {
    if (!profile) {
      profiles.findOne({userId: currentUserId})
        .then(res => {
          setProfile(res);
        });
    } else {
      if (profile.avatar.length > 1) setAvatarHandler(profile.avatar);
    }
  },[profile]);

  const [ avatarHandler, setAvatarHandler ] = useState('../assets/images/default_avatar.jpg');
  const [ isCommentReceived, setIsCommentReceived ] = useState(false);

  const [ myPosts, setMyPosts] = useState(null);
  const [ showSpinner, setShowSpinner ] = useState(false);

  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  const Indicator = 
    <View 
      style={{
        justifyContent: 'center', 
        flexDirection: 'row', 
        padding: 20, 
        display: (showSpinner ? 'block' : 'none')
      }}
    >
      <ActivityIndicator
        animating={showSpinner}
        size="large"
        color="grey"
      />
    </View>;

  const handleSendComment = (commentFromCommentTBox) => {
    if (commentFromCommentTBox) {
      setShowSpinner(true);
      setIsCommentReceived(true);
      comments.insertOne(commentFromCommentTBox)
        .then((res) => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setLoadingComplete(false);
          setShouldReload(true);
        });
    }
  }
  
  const handlePageReload = () => {
    setShowSpinner(true);
    setLoadingComplete(false);
    setShouldReload(true);
  }

  const getLikeSignal = (likeSignalFromPost) => {
    handleLikeSignal(likeSignalFromPost);
  }

  const handleLikeSignal = (signal) => {
    posts.findOneAndUpdate({_id: signal.postId}, {$set: {likes: signal.likes, likers: Array.from(signal.likers) }})
      .then((res) => {
        // console.log('Update likes of post ' + signal.postId );
      })
  }
const [ searchToken, setSearchToken ] = useState({ type: "category", value: "project" });

useEffect(()=> {
  if(shouldReload) {
    function handleSetPosts(results) {
      setMyPosts(results);
    }
    let searchObj = null;
    switch(searchToken.type) {
      case "category":
        searchObj = { category: searchToken.value };
        break;

      case "ownerEmail":
        searchObj = { ownerEmail: searchToken.value };
        break;

      // Add more

      default:
        alert("Error: No token type found!");
        break;
    }
    if (searchObj) {
      posts.find({ category: searchToken.value })
        .toArray()
        .then(res => {
          res.sort((a, b) => a._id < b._id);  // Sort results by document's id
          handleSetPosts(res);
          setLoadingComplete(true);
        });
    }
  }
  return () => {
    setTimeout(() => {setShowSpinner(false)}, 500);
  }
}, [shouldReload, loadingComplete, showSpinner]);

const Posts = myPosts && profile ? myPosts.map((post, i) => {
  return (
    <Post 
      key={i} 
      profiles={profiles}
      comments={comments}
      ownerId={post.ownerId}
      currentUserId={currentUserId}
      currentUserAvatar={avatarHandler}
      userAvatar={avatarHandler}
      post={post} 
      postKey={i} 
      likeSignal={getLikeSignal} 
      commentToSend={handleSendComment}
      deletable={false}
    />
  )
}) : null;

if (!loadingComplete) { return (Indicator) } 
  else {
    return(
      <ScrollView>
        <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>        
          <View style={{flex: 1, paddingTop: 0, alignItems: "center" }}>
          <Text style={{fontSize: 20, marginVertical: 5}}>Currently using filter: </Text>
          <Picker
            selectedValue={searchToken.value}
            style={{ alignSelf: 'center', width: '100%' }}
            itemStyle={{ fontSize: 17, height: 100, width: 300 }}
            onValueChange={(itemValue, itemIndex) => setSearchToken({ type: "category", value: itemValue })}
          >
            {/* <Picker.Item label="Select a category to filter.." value="dummyValue" /> */}
            <Picker.Item label="Project" value="project" />
            <Picker.Item label="Peer to Peer Learning" value="p2pLearning" />
            <Picker.Item label="A dummy Value" value="dummyValue" />
          </Picker>
          </View>
          
          <Button 
            title="Refresh"         
            style={{ width: 200, marginVertical: 5 }}
            onPress={handlePageReload}
          />

          {Posts}

        </View> 
      </ScrollView>
    );
  }
};

export default BoardScreen;