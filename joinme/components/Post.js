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

function Post(props) {

  const [ viewCommentOn, setViewCommentOn ] = useState(false);
  const [ liked, setLiked ] = useState(false);
  const [ noOfLike, setNoOfLike ] = useState(props.post.likes);
  const [ toggle, setToggle ] = useState(false);

  const sampleComment = {
    _id: "1111111",
    ownerId: "123",
    ownerEmail: "someOne@gmail.com",
    date: new Date(),
    content: "This is the new comment from someOne."
  }

  const handleSetToggle = () => {
    setToggle(!toggle);
  }

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

  useEffect(() => {
    if (isUserFound()) {
      setLiked(true);
    } else { setLiked(false) }
  }, [liked])

  useEffect(() => {
    handleLikes();
  }, [liked, noOfLike])

  const likeBtnType = liked ? 'solid' : 'outline';
  const likeBtnTitle = noOfLike > 1 ? noOfLike + " Likes" : noOfLike + " Like";

  return(
    <Card title={props.post.ownerEmail} containerStyle={{ width: '100%', alignSelf: 'center' }}>
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
          <View style={{ alignItems: 'flex-start'}} >
            <Button style={{ width: 100}} title={likeBtnTitle} type={likeBtnType} onPress={handleLikeToggle} />
          </View>

          <View style={{ flexGrow: 1, alignItems: 'flex-start'}} >
            <Button style={{ width: 100}} title="Comment" type="outline" onPress={() => { handleSetToggle(); alert('Toggle view comment = ' + toggle)}} />
          </View>

          <View style={{ flexGrow: 1, alignItems: 'flex-end'}} >
            <Button style={{ width: 50}} type="outline" 
              icon={
                <Icon
                  name="delete"
                  size={20}
                />
              }
              onPress={handleDeletePost}
            />
              
          </View>
        </View>

        <Divider style={{ backgroundColor: 'black' }} />
        <Comment />
        <Comment />
    </Card>
    
  );
}

export default Post;