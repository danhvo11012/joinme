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
  ActivityIndicator,
} from 'react-native';

import Post from '../components/Post'
import { Input, Button, Icon, colors } from 'react-native-elements';
import CreatePostModal from '../components/CreatePostModal';

function MyDeskScreen({ route, navigation }) {
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const posts = db.collection('posts');

  const { currentUserId, user } = route.params;

  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ shouldReload, setShouldReload ] = useState(true );
  const [ isPostReceived, setIsPostReceived ] = useState(false);
  const [ isPostReady, setIsPostReady ] = useState(false);

  const [ myPosts, setMyPosts] = useState(null);
  const [ showCreateNewPostModal, setShowCreateNewPostModal ] = useState(false);
  const [ postFromModal, setPostFromModal ] = useState(null);
  const [ fullPost, setFullPost ] = useState(null);

  const [ showSpinner, setShowSpinner ] = useState(false);
  
  const createNewPost = () => {
    setShowCreateNewPostModal(true);
  }

  const handlePost = (modalShow) => {
    setShowCreateNewPostModal(modalShow);
  }

  const handleGetPost = (postFromModal) => {
    setPostFromModal(postFromModal);
    setIsPostReceived(true);
  }

  const handleDeletePost = (postId) => {
    setShowSpinner(true);
    posts.findOneAndDelete({_id: postId})
      .then(res => {
        console.log('response from delete: ', res);
        setShouldReload(true);
        setLoadingComplete(false);
      })
  }

  const getPostToDelete = (postIdFromPostJS) => {
    console.log('Post id to delete: ', postIdFromPostJS);
    handleDeletePost(postIdFromPostJS);
  }

  const getLikeSignal = (likeSignalFromPost) => {
    handleLikeSignal(likeSignalFromPost);
  }

  const handleLikeSignal = (signal) => {
    console.log('likes from post: ' + signal.likes + '; is liked by: ' + signal.likers);
    posts.findOneAndUpdate({_id: signal.postId}, {$set: {likes: signal.likes, likers: Array.from(signal.likers) }})
      .then(res => {
        // Do nothing after handling likes.
      })
  }

  /**
  * Post metrics
  * 
  * postId = default ObjId
  * ownerId = currentUserId
  * ownerEmail = user.email
  * category : Side-project || p2p learning || others
  * postDate = new Date();
  * postContent: TextInput
  * preferred: Preferred exp
  */
  const handleSetFullPost = () => {
    if(isPostReceived) {
      setFullPost({
        ownerId: currentUserId,
        ownerEmail: user.email,
        postDate: new Date(),
        category: postFromModal.category,
        content: postFromModal.content,
        preferred: postFromModal.preferred,
        likers: [],
        likes: 0,
      });
    }
  }

  const resetLogicStates = () => {
    setShouldReload(false);
    setIsPostReady(false);
    setIsPostReceived(false);
  }

  const handlePageReload = () => {
    setShowSpinner(true);
    setLoadingComplete(false);
    setShouldReload(true);
  }

  useEffect(()=> {
    if(shouldReload) {
      function handleSetPosts(results) {
        setMyPosts(results);
      }
      posts.find({ ownerId: currentUserId })
        .toArray()
        .then(results => {
          results.sort((a, b) => a._id < b._id);  // Sort results by document's id
          handleSetPosts(results);
          setLoadingComplete(true);
          resetLogicStates();
        });
    }
    return () => {
      setTimeout(() => {setShowSpinner(false)}, 500);
    }
  }, [shouldReload, loadingComplete, showSpinner]);

  useEffect(() => {
    if (isPostReceived) {
      setShowSpinner(true);
      console.log(postFromModal);
      handleSetFullPost();
      setIsPostReady(true);
    }
  }, [isPostReceived])

  useEffect(() => {
    if (isPostReady) {
      console.log('Full post: ', fullPost);
      posts.insertOne(fullPost).then(res => {
        console.log('Response from stitch: ', res);
        setLoadingComplete(false);
        setShouldReload(true);
      })
    }
  }, [isPostReady])

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

  if (!loadingComplete) { return (Indicator) } 
  else {
    return(
      <ScrollView>
        <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, marginVertical: 10}}>Welcome back, {user.email}!</Text>
          
          <Button
            title="Create a new post"         
            style={{ width: 200, marginVertical: 5 }}
            onPress={createNewPost}
          />

          <Button 
            title="Refresh"         
            style={{ width: 200, marginVertical: 5 }}
            onPress={handlePageReload}
          />
          {Indicator}
          <View 
            style={{ marginVertical: 5 }}
          >
            <Modal 
              visible={showCreateNewPostModal}
              animationType="slide"
            >
              <CreatePostModal onPost={handlePost} postToInsert={handleGetPost} />
            </Modal>

          </View>
          {myPosts.map((post, i) => <Post key={i} currentUserId={currentUserId} post={post} postKey={i} postToDelete={getPostToDelete} likeSignal={getLikeSignal} />)}
        </View> 
      </ScrollView>
    );
  }
};
export default MyDeskScreen;