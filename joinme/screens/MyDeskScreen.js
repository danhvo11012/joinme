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
  const profiles = db.collection('profiles');
  
  //posts
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ shouldReload, setShouldReload ] = useState(true );
  const [ profile, setProfile ] = useState(null);
  const [ avatarHandler, setAvatarHandler ] = useState('../assets/images/default_avatar.jpg');

  const [ isPostReceived, setIsPostReceived ] = useState(false);
  const [ isPostReady, setIsPostReady ] = useState(false);
  const [ isCommentReceived, setIsCommentReceived ] = useState(false);
  const [ postsCommentsLoaded, setPostsCommentsLoaded ] = useState(false);

  const [ myPosts, setMyPosts] = useState(null);
  const [ showCreateNewPostModal, setShowCreateNewPostModal ] = useState(false);
  const [ postFromModal, setPostFromModal ] = useState(null);
  const [ fullPost, setFullPost ] = useState(null);

  const [ showSpinner, setShowSpinner ] = useState(false);

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

  useEffect(() => {
    if (!profile) {
      profiles.findOne({userId: currentUserId})
        .then(res => {
          setProfile(res);
        });
    } else {
      if (profile.avatar) {
        if (profile.avatar.length > 1) setAvatarHandler(profile.avatar);
      }
    }
  },[profile]);

  useEffect(() => {
    if (postsCommentsLoaded) {
      setPostsCommentsLoaded(false);
    } 
  }, [postsCommentsLoaded])

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
    if (isPostReceived) {
      setShowSpinner(true);
      handleSetFullPost();
      setIsPostReady(true);
    }
  }, [isPostReceived])

  useEffect(() => {
    if (isPostReady) {
      // console.log('Full post: ', fullPost);
      posts.insertOne(fullPost).then(res => {
        // console.log('Response from stitch: ', res);
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

  const Posts = myPosts ? myPosts.map((post, i, posts) => {
    return (
      <Post 
        key={i} 
        profiles={profiles}
        comments={comments}
        ownerId={currentUserId}
        currentUserId={currentUserId}
        // currentUserAvatar={profile.avatar}
        userAvatar={avatarHandler}
        post={post} 
        postKey={i} 
        postToDelete={getPostToDelete} 
        likeSignal={getLikeSignal} 
        commentToSend={handleSendComment}
        deletable={true}
      />
    )
  }) : null;

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