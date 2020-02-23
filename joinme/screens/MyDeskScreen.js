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
      })
  }

  const getPostToDelete = (postIdFromPostJS) => {
    console.log('Post id to delete: ', postIdFromPostJS);
    handleDeletePost(postIdFromPostJS);
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
      });
    }
  }

  const resetLogicStates = () => {
    setShouldReload(false);
    setIsPostReady(false);
    setIsPostReceived(false);
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
  }, [shouldReload]);

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
        <View style={{marginTop: 10}}>

          <Text>Welcome back, {user.email}!</Text>
          
          <Button 
            title="Create a new post"         
            style={{ marginVertical: 15 }}
            onPress={createNewPost}
          />

          <View 
            style={{ marginVertical: 20, justifyContent: 'center', alignItems: 'center'}}
          >
            <Modal 
              visible={showCreateNewPostModal}
              animationType="slide"
            >
              <CreatePostModal onPost={handlePost} postToInsert={handleGetPost} />
            </Modal>

          </View>
          {myPosts.map((post, i) => <Post key={i} post={post} postKey={i} postToDelete={getPostToDelete} />)}
        </View> 
      </ScrollView>
    );
  }
};
export default MyDeskScreen;