import React, { useState, useEffect } from 'react';
import {Layout, Avatar} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
} from 'react-native';
import ProfileAvatar from './ProfileAvatar';
import ProfileSetting from './ProfileSetting';
import {
  Text,
  Card,
  ListItem,
  Button,
  Icon
} from 'react-native-elements';

//{post, postKey, comment}
/* <Card titleStyle={{fontSize: 16, textAlign: "left"}} title={comment.ownerEmail + " said:"}>
      <View>
        <Text>Comment Id: {comment._id}</Text>
        <Text>Comment on: {comment.date.toString()}</Text>
        <Text>Comment content:
          <Text>
            {comment.content}
          </Text>
        </Text>
      </View>
    </Card> */

export default function Comment() {
  const comment = {
  ownerId: 'someone@gmail.com',
  ownerfullName: 'Nameless Boyy',
  avatar: 'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/s960x960/83009231_2625407500907338_7630964988617687040_o.jpg?_nc_cat=104&_nc_ohc=jm7RGaAHGokAX9o-_W1&_nc_ht=scontent-dfw5-2.xx&_nc_tp=7&oh=be5920e9cce38b1df8464eef98fd55a6&oe=5EFCE6EE',
  content: 'Hi, my name is Some Name.'
};
  return(
    <Card style={styles.container}>
      <Layout
          style={styles.photoSection}
          level='1'>
          <Avatar
            style={styles.photo}
            source={{uri: comment.avatar}}
          />
          <View style={styles.nameSection}>
            <ProfileSetting
              type='name'
              style={styles.setting}
              value={comment.ownerfullName}
            />
          </View>
      </Layout>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  photo: {
    aspectRatio: 1.0,
    height: 76
  },
  setting: {
    padding: 16,
    
  },
});