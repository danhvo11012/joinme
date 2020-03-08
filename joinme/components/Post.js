/**
 * Post Component
 * 
 * @author Danh Vo
 * @version 1.0
 */
import React, { useState, useEffect } from 'react';
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';

import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  ShadowPropTypesIOS,
} from 'react-native';

import {
  Text,
  Card,
  Divider,
  ListItem,
  Button,
  Icon,
  // ActivityIndicator,
} from 'react-native-elements';

import {Layout, Avatar} from '@ui-kitten/components';

import Comment from './Comment';
import CommentTextBox from '../components/CommentTextBox';

function Post(props) {

  const client =  props.client;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profiles = db.collection('profiles');
  const comments = db.collection('comments');

  const [ profile, setProfile ] = useState(null);
  const [ viewCommentOn, setViewCommentOn ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ noOfLike, setNoOfLike ] = useState(props.post.likes);
  const [ toggle, setToggle ] = useState(false);
  const [ cmtsViewHeight, setCmtsViewHeight ] = useState('auto');
  const [ cmts, setCmts ] = useState(null);
  const [ noOfCmt, setNoOfCmt ] = useState(0);
  const [ shouldRenderComments, setShouldRenderComments ] = useState(false);

  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

  const handleDeletePost = () => {
    props.postToDelete(props.post._id);
  }

  const handleLikeToggle = () => {
    setLiked(!liked);
    setNoOfLike(!liked ? noOfLike + 1 : noOfLike -1);
    if (!liked) { 
      props.post.likers.push(props.currentUserId); 
    } else { 
      props.post.likers = props.post.likers.filter((userId) => { return userId != props.currentUserId });

    }
  }

  const handleLikes = () => {
    props.likeSignal({postId: props.post._id, likes: noOfLike, likers: new Set(props.post.likers) });
  }

  const isUserFound = () => {
    const userFound = props.post.likers.find((userId) => { return userId == props.currentUserId });
    return (userFound ? true : false);
  }

  const getCommentFromCommentTBox = (commentFromCallback) => {
    props.commentToSend(commentFromCallback);
  }

  const handleViewComments = () => {
    setViewCommentOn(!viewCommentOn);
  }

  useEffect(() => {
    if (!profile) {
      profiles.findOne({ userId: props.currentUserId })
        .then(res => {
          setProfile(res);
        })
    }
  }, [profile])

  // Hooks handle view comment toggler logic
  useEffect(() => {
    if (viewCommentOn) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShouldRenderComments(true);
      setCmtsViewHeight('auto');
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setCmtsViewHeight(0);
      setShouldRenderComments(false);
    }
  }, [viewCommentOn])

  useEffect(() => {
    if (!cmts) {
      comments.find({ postId: props.post._id })
        .asArray()
        .then(res => {
          res.sort((a, b) => a._id < b._id);
          setCmts(res);
        })
    } 
  }, [cmts])

  useEffect(() => {
    if (!shouldRenderComments) setViewCommentOn(false);
  }, [shouldRenderComments])

  // Hooks handle like button
  useEffect(() => {
    if (isUserFound()) {
      setLiked(true);
    } else { setLiked(false) }
  }, [liked])

  useEffect(() => {
    handleLikes();
  }, [liked, noOfLike])

  
  const Comments = shouldRenderComments ? cmts.map((comment, key) => <Comment key={key} client={props.client} comment={comment}/>) : null;
  
  const likeBtnType = liked ? 'solid' : 'outline';
  const likeBtnTitle = noOfLike > 1 ? noOfLike + " Likes" : noOfLike + " Like";

  const cmtBtnType = viewCommentOn ? 'solid' : 'outline';
  const cmtBtnTitle = viewCommentOn ? "Hide Comments" : "View Comments"; 

  const postTitle = profile ? (profile.firstName + ' ' + profile.lastName + ' posted:') : 'post title undefined.'

  if (!profile) { return null }
  else {
    return(
      <Card
        title={postTitle}
        titleStyle={{alignSelf: 'center'}}
        containerStyle={{ width: '100%', alignSelf: 'center', borderRadius: 6, borderWidth: 0, borderBottomWidth: 1.2, borderColor: 'grey' }}>
        <View>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Avatar
                style={{    
                  // aspectRatio: 1.0,
                  height: 150,
                  width: 120,
                  alignSelf: 'flex-start',
                  // marginVertical: 10,
                  borderRadius: 5,
                  borderWidth: 0,
                  borderColor: 'grey',
                  shadowOffset: {20 20 20 20},
                }}
                shape="square"
                size="large"
                source={{uri: profile.avatar}}
              />
            </View>
            <View style={{flex: 2}}>
              <Text>Post id: {props.post._id.toString()}</Text>
              <Text>Post#: {props.postKey}</Text>
              <Text>Post owner Id: {props.post.ownerId}</Text>
              <Text>Post date: {props.post.postDate.toString()}</Text>
              <Text>Category: {props.post.category}</Text>   
            </View>
          </View>

          <Text>Post content:     {props.post.content}</Text>
          <Text>Preferred experience:     {props.post.preferred}</Text>
        </View>

          <View style={{ flexDirection: 'row', marginVertical: 10 }}>
            <View style={{ alignItems: 'flex-start'}}>
              <Button 
                style={{ width: 100}} 
                title={likeBtnTitle} 
                type={likeBtnType} 
                onPress={handleLikeToggle} 
              />
            </View>

            <View style={{ flexGrow: 1, alignItems: 'flex-start', marginLeft: 5}} >
              <Button 
                style={{ width: 150}} 
                title={cmtBtnTitle} 
                type={cmtBtnType} 
                onPress={handleViewComments}
              />
            </View>

            <View style={{ flexGrow: 1, alignItems: 'flex-end'}} >
              <Button 
                style={{ width: 50}} 
                type="clear" 
                icon={
                  <Icon
                    name="delete"
                    size={25}
                  />
                }
                onPress={handleDeletePost}
              />
                
            </View>
          </View>

          <Divider />
          <View style={{ height: cmtsViewHeight }}>
            {Comments}
          </View>
          <Divider />
          <CommentTextBox post={props.post} currentUserId={props.currentUserId} userAvatar={props.userAvatar} getCommentCallback={getCommentFromCommentTBox}/>
      </Card>
      
    );
  }
};

export default Post;