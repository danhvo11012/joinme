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
  ListItem,
  Button,
  Icon
} from 'react-native-elements';

export default function Post({post, postKey}) {
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
    </Card>
    // <View>    Post id: {post._id},       
  );
}