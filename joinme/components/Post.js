import React, { useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
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

export default function Post({post, postKey}) {

  const [ viewCommentOn, setViewCommentOn ] = useState(false);
  const [ toggle, setToggle ] = useState(false);

  const sampleComment = {
    _id: "1111111",
    ownerId: "123",
    ownerEmail: "someOne@gmail.com",
    date: new Date(),
    content: "This is the new comment from someOne."
  }

  function handleSetToggle() {
    setToggle(!toggle);
  }

  return(
    <Card title={post.ownerEmail}>
      <View>
        <Text>Post id: {post._id.toString()}</Text>
        <Text>Post#: {postKey}</Text>
        <Text>Post owner Id: {post.ownerId}</Text>
        <Text>Post owner Email: {post.ownerEmail}</Text>
        <Text>Post date: {post.postDate.toString()}</Text>
        <Text>Post content:
          <Text>{post.postContent}</Text>
        </Text>
        </View>
        <Button style={{width: 100}} title="Comment" type="clear" onPress={() => { handleSetToggle(); alert('Toggle view comment = ' + toggle)}} />
        <Divider style={{ backgroundColor: 'black' }} />
        <Comment post={post} postKey={postKey} comment={sampleComment} />
        <Comment post={post} postKey={postKey} comment={sampleComment} />
    </Card>
    
  );
}