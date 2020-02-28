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
} from 'react-native';

import Post from '../components/Post'
import { Input, Button, Icon } from 'react-native-elements';
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

  
  const createNewPost = () => {
    setShowCreateNewPostModal(true);
  }

  const handlePost = (modalShow) => {
    setShowCreateNewPostModal(modalShow);
  }

  const handleGetPost = (postFromModal) => {
    console.log('isPostReceived ', isPostReceived);
    setPostFromModal(postFromModal);
    setIsPostReceived(true);
  }

  const handleDeletePost = (postId) => {
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
    resetLogicStates();
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
          resetLogicStates();
          setLoadingComplete(true);
        });  
    }
  }, [shouldReload, loadingComplete]);

  useEffect(() => {
    if (isPostReceived) {
      console.log('received');
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


  if (!loadingComplete) { return null } 
  else {
    return(
      <ScrollView>
        <View style={{marginTop: 10, justifyContent: 'center', alignItems: 'center'}}>

          <Text>Welcome back, {user.email}!</Text>
          
          <Button 
            title="Create a new post"         
            style={{ width: 200, marginVertical: 15 }}
            onPress={createNewPost}
          />

          <Button 
            title="Refresh"         
            style={{ width: 200, marginVertical: 0 }}
            onPress={handlePageReload}
          />

          <View 
            style={{ marginVertical: 20 }}
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