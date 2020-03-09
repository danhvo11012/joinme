import React, { useState, useEffect } from 'react';

import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';

import {Layout, Avatar} from '@ui-kitten/components';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  Image,
  TouchableHighlight,
  TouchableOpacity
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



function Comment(props) {
  //profile, if not existed navigate => ProfileSettingScreen 
  const profiles = props.profiles;

  const [ profile, setProfile ] = useState(null);

  const [ pressedLike, setPressedLike] = useState(false);
  const [ noOfLike, setNoOfLike ] = useState(0);

  const like_images = {
    liked: require('../assets/images/liked_icon.png'),
    not_liked: require('../assets/images/not_liked_icon.png')
  }
  const default_avatar = '../assets/images/default_avatar.jpg';

  useEffect(() => {
    if (!profile) {
      profiles.findOne({ userId: props.comment.ownerId })
        .then(res => {
          setProfile(res);
        })
    }
  }, [profile])

  function onLikePressed () {
    if (pressedLike) {
      setPressedLike(false);
      setNoOfLike(noOfLike - 1);
      
    } else {
      setPressedLike(true);
      setNoOfLike(noOfLike + 1);
    }
  }

  const comment = profile ? {
    ownerId: props.comment.ownerId,
    ownerfullName: profile.firstName + ' ' + profile.lastName,
    content: props.comment.content,
  } : null ;

  if (!profile) { return null }
  else {
    return(
      <View style={styles.container}>
        <Avatar
          style={styles.photo}
          source={profile.avatar != '' ? {uri: profile.avatar} : require(default_avatar)}
        />
        <View style={{}}>
          <View style={styles.contentSection}>
            <Text style={styles.name}>{comment.ownerfullName}</Text>
            <Text>{comment.content}</Text>
          </View>

          <TouchableOpacity  onPress={onLikePressed} style={{zIndex: 999}}>
              <View style={styles.reaction_container}>
                <Image style={styles.img_icon} source={pressedLike ? like_images.liked : like_images.not_liked}></Image>
                <Text style={{color: '#606770',fontSize:13}}>{noOfLike}</Text>
              </View>
          </TouchableOpacity>

          <Text style={styles.time}>29m</Text>    
          
        </View>
      </View>
    );
  }
};

export default Comment;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: "2.5%",
    marginTop: "2%",
  },
  photo: {
    aspectRatio: 1.0,
    height: 76,
    marginRight: 10,
    marginTop: "2%"
  },
   contentSection: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginTop: 5,
    borderRadius: 3,
    backgroundColor:'#f2f3f5',
    width: '100%'
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
    marginHorizontal: 10,
    marginTop: '3%',
    color: '#606770',
    left: '50%',
    bottom: '5%'
  },
  reaction_container: {
    position: 'absolute',
    alignSelf: 'flex-end',
    flexDirection:'row',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
    bottom: -18,
    //right: -8,
    left: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1.2,
    shadowOpacity: 0.3

  },
  img_icon: {
   height: 18,
   width: 18,
   marginRight: 4
  }
});