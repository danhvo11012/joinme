/**
 * MyDeskScreen
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
  const comments = db.collection('comments');

  const { currentUserId, user } = route.params;

  //profile, if not existed navigate => ProfileSettingScreen 
  // const profiles = db.collection('profiles');
  
  //posts
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ shouldReload, setShouldReload ] = useState(true );
  const [ isPostReceived, setIsPostReceived ] = useState(false);
  const [ isPostReady, setIsPostReady ] = useState(false);
  const [ isCommentReceived, setIsCommentReceived ] = useState(false);
  const [ postsCommentsLoaded, setPostsCommentsLoaded ] = useState(false);

  const [ myPosts, setMyPosts] = useState(null);
  const [ showCreateNewPostModal, setShowCreateNewPostModal ] = useState(false);
  const [ postFromModal, setPostFromModal ] = useState(null);
  const [ fullPost, setFullPost ] = useState(null);

  const [ postsComments, setPostsComments ] = useState(null);
  const [ postsAndComments, setPostsAndComments ] = useState(null);

  const [ showSpinner, setShowSpinner ] = useState(false);

  // const [ profileChecked, setProfileChecked ] = useState(false);
  
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

  const createNewPost = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowCreateNewPostModal(true);
  }

  const handlePost = (modalShow) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    posts.findOneAndUpdate({_id: signal.postId}, {$set: {likes: signal.likes, likers: Array.from(signal.likers) }})
      .then((res) => {
        // console.log('Update likes of post ' + signal.postId );
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
  * likes: number of likes
  * likers: userId of those who liked this post
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

  const handleViewComment = (viewCommentSignal) => {
    if (viewCommentSignal != null) {
      // console.log(viewCommentSignal);
      getComments(viewCommentSignal);
    }
  }

  const getComments = (signal) => {
    // console.log(signal.postId);
    comments.find({ postId: signal.postId })
      .asArray()
      .then(res => {
        res.sort((a, b) => a._id < b._id);
        if (res.length) { setPostsComments(res) } else { setPostsComments(null)}
        setPostsCommentsLoaded(true);
      })
  }

  useEffect(() => {
    if (postsCommentsLoaded) {
      // console.log(postsComments);
      setPostsCommentsLoaded(false);
    } 
  }, [postsCommentsLoaded])

  const handleSendComment = (commentFromCommentTBox) => {
    // console.log(commentFromCommentTBox);
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
        .then(res => {
          res.sort((a, b) => a._id < b._id);  // Sort results by document's id
          handleSetPosts(res);
          setLoadingComplete(true);
          resetLogicStates();
        });
    }
    return () => {
      setTimeout(() => {setShowSpinner(false)}, 500);
    }
  }, [shouldReload, loadingComplete, showSpinner]);

  useEffect(() => {
    if (myPosts && postsComments) {
      // working...
    }
  }, [myPosts, postsComments])

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
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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

  const Posts = myPosts ? myPosts.map((post, i) => {
    return (
      <Post 
        key={i} 
        currentUserId={currentUserId} 
        post={post} 
        postKey={i} 
        postToDelete={getPostToDelete} 
        likeSignal={getLikeSignal} 
        comments={postsComments}
        viewCommentsOf={handleViewComment}
        commentToSend={handleSendComment}
      />
    )
  }
    
  ) : null;

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

          {Posts}

        </View> 
      </ScrollView>
    );
  }
};
export default MyDeskScreen;