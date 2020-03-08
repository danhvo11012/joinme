/**
 * Component Text Box
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
  TextInput
} from 'react-native';

import {
  Text,
  Card,
  Divider,
  ListItem,
  Button,
  Icon
} from 'react-native-elements';

import {Layout, Avatar} from '@ui-kitten/components';

function CommentTextBox(props) {
  const [ contentBoxHeight, setContentBoxHeight ] = useState(0);
  const [ content, setContent ] = useState(null);

  /**
  * Comment metrics
  * 
  * commentId = default ObjId
  * postId = postId of the post this comment belongs to
  * ownerId = currentUserId
  * commentDate = new Date();
  * commentContent: TextInput
  * likes: number of likes
  * likers: userId of those who liked this post
  */

  const handleSendComment = () => {
    props.getCommentCallback({
      ownerId: props.currentUserId,
      postId: props.post._id,
      date: new Date(),
      content: content,
      likes: 0,
      likers: [],
    });
  }

  return(
    <View style={{marginTop: 10, flexDirection: 'row', justifyContent: 'space-between'}}>
      <Avatar
          style={{    
            aspectRatio: 1.0,
            height: 90,
          }}
          size="large"
          source={{uri: props.userAvatar}}
      />

      <TextInput 
        style={{ 
            fontSize: 16, 
            borderRadius: 5, 
            borderWidth: 2, 
            borderColor: '#d0dffe',
            width: '70%',
            height: Math.max(48, contentBoxHeight),
            paddingLeft: 5,
            }}
        autoFocus={false}
        multiline={true}
        numberOfLines={10}
        placeholder="Type your comment here..."
        onContentSizeChange={(event) => {
            setContentBoxHeight(Math.min(event.nativeEvent.contentSize.height, 120))
        }}
        onChangeText={(comment) => setContent(comment)}
      />
      <Button style={{alignSelf: 'flex-end'}} type="clear" 
        icon={
          <Icon
            name="send"
            size={33}
            color="#6d9dff"
          />
        }
        onPress={handleSendComment}
      />

    </View>
  )
}

export default CommentTextBox;