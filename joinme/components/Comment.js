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

export default function Comment({post, postKey, comment}) {
  return(
    <Card titleStyle={{fontSize: 16, textAlign: "left"}} title={comment.ownerEmail + " said:"}>
      <View>
        <Text>Comment Id: {comment._id}</Text>
        <Text>Comment on: {comment.date.toString()}</Text>
        <Text>Comment content:
          <Text>
            {comment.content}
          </Text>
        </Text>
      </View>
    </Card>
  );
}