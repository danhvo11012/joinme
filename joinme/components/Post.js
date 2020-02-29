/**
 * Post Component
 * 
 * @author Danh Vo
 * @version 1.0
 */
import React, { useState, useEffect } from 'react';

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
  Icon
} from 'react-native-elements';

import Comment from './Comment';
import CommentTextBox from '../components/CommentTextBox';

function Post(props) {

  const [ viewCommentOn, setViewCommentOn ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ noOfLike, setNoOfLike ] = useState(props.post.likes);
  const [ toggle, setToggle ] = useState(false);
  const [ comments, setComments ] = useState(null);
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

  // Hooks handle view comment toggler logic
  useEffect(() => {
    if (viewCommentOn) {
      props.viewCommentsOf({
        postId: props.post._id,
      });
      setComments(props.comments);
    } else {       
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShouldRenderComments(false)
    }
  }, [viewCommentOn])

  useEffect(() => {
    if (props.comments = []) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShouldRenderComments(true);
    }
    if (viewCommentOn && props.comments[0].postId.toString() == props.post._id) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShouldRenderComments(true);
    } else {        
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setShouldRenderComments(false) 
    }
  }, [props.comments])

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

  // const noCommentFound = <View><Text>No comment found</Text></View>;
  const Comments = shouldRenderComments ? props.comments.map((comment, key) => <Comment key={key} comment={comment}/>) : null;
  
  const likeBtnType = liked ? 'solid' : 'outline';
  const likeBtnTitle = noOfLike > 1 ? noOfLike + " Likes" : noOfLike + " Like";

  const cmtBtnType = viewCommentOn ? 'solid' : 'outline';
  const cmtBtnTitle =  viewCommentOn ? "Hide Comments" : "View Comments"; 

  return(
    <Card 
      title={props.post.ownerEmail} 
      containerStyle={{ width: '100%', alignSelf: 'center', borderRadius: 6, borderWidth: 0, borderBottomWidth: 1.2, borderColor: 'grey' }}>
      <View>
        <Text>Post id: {props.post._id.toString()}</Text>
        <Text>Post#: {props.postKey}</Text>
        <Text>Post owner Id: {props.post.ownerId}</Text>
        <Text>Post date: {props.post.postDate.toString()}</Text>
        <Text>Category: {props.post.category}</Text>
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
        <View>
          {Comments}
        </View>
        <Divider />
        <CommentTextBox post={props.post} currentUserId={props.currentUserId} getCommentCallback={getCommentFromCommentTBox}/>
    </Card>
    
  );
}

export default Post;