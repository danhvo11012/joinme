import React, { useState, useEffect } from 'react';
import {Layout, Avatar} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView
} from 'react-native';
import ProfileAvatar from './ProfileAvatar';
import ProfileSetting from './ProfileSetting';
import {
  Text,
  Card,
  ListItem,
  Icon,
  Button
} from 'react-native-elements';

export default function Comment() {
  return(
   
      <View style={styles.container}>
        <Avatar
          style={styles.photo}
          source={{uri: comment.avatar}}
        />
        <View style={{}}>
          <View style={styles.contentSection}>
            <Text style={styles.name}>{comment.ownerfullName}</Text>
            <Text>{comment.content}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Button style={styles.actionButton} type="clear" title="Like" titleStyle={styles.buttonTitle}></Button>
            <Button style={styles.actionButton} type="clear" title="Reply" titleStyle={styles.buttonTitle}></Button>
            <Text style={styles.time}>29m</Text>
          </View>
        </View>
      </View>
  
  );
}
const comment = {
  ownerId: 'someone@gmail.com',
  ownerfullName: 'Nameless Boyy',
  avatar: 'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/s960x960/83009231_2625407500907338_7630964988617687040_o.jpg?_nc_cat=104&_nc_ohc=jm7RGaAHGokAX9o-_W1&_nc_ht=scontent-dfw5-2.xx&_nc_tp=7&oh=be5920e9cce38b1df8464eef98fd55a6&oe=5EFCE6EE',
  content: 'Hi, my name is Some Namasdaasdasasdasdasdasdasdasddasdasdasdassadasdsadsasdasdasdasdasasdasdasdasdasdasddasdasdasdasdasdasdasdasdasdsadasdase.'
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
    marginVertical:5,
    width:'80%',
    marginHorizontal:10,
    // backgroundColor: 'red'
  },
  photo: {
    aspectRatio: 1.0,
    height: 76,
    marginHorizontal: 10,
    marginTop: 5
  },
   contentSection: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 18,
    backgroundColor:'#f2f3f5',
    width: '95%'
  },
  name: {
    fontWeight: 'bold'
  },
  buttonTitle:{
    fontSize: 14
  },
  actionButton: {
    marginRight: 10
  },
  time:{
    fontSize: 14,
    marginVertical:11,
    marginHorizontal: 6,
    color: '#606770'
  } 
});