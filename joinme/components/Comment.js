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
// import ProfileAvatar from './ProfileAvatar';
// import ProfileSetting from './ProfileSetting';
import {
  Text,
  Card,
  ListItem,
  Icon,
  Button
} from 'react-native-elements';

const getNonZero = (num, unit) => {
  return num > 0 ? num + unit : '';
}

function convertMS(ms) {
  var d, h, m, s;
  s = Math.floor(ms / 1000);
  m = Math.floor(s / 60);
  s = s % 60;
  h = Math.floor(m / 60);
  m = m % 60;
  d = Math.floor(h / 24);
  h = h % 24;
  // return { d: d, h: h, m: m, s: s };
  if (d > 0) return d + (d > 1 ? ' days ' : ' day ') + 'ago';
  if (h > 0) return h + (h > 1 ? ' hours ' : ' hour ') + 'ago';
  if (m > 0) return m + (m > 1 ? ' minutes ' : ' minute ') + 'ago';
  if (s > 0) return s + (s > 1 ? ' seconds ' : ' second ') + 'ago';
  return null;
};

function Comment(props) {
  const now = new Date();

  const comments = props.comments;
  const profiles = props.profiles;
  const [ profile, setProfile ] = useState(null);
  const [ commentedTime, setCommentedTime ] = useState(convertMS(now.getTime() - props.comment.date.getTime()));
  const [ liked, setLiked ] = useState(false);
  const [ noOfLike, setNoOfLike ] = useState(props.comment.likes);

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

  const handleLikePressed = () => {
    setNoOfLike(noOfLike + 1);
    handleUpdateLikes(noOfLike + 1);
  }

  const handleUpdateLikes = (nOL) => {
    comments.findOneAndUpdate({ _id: props.comment._id }, {$set: { likes: nOL }});
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

        <View>
          <View style={styles.contentSection}>
            <Text style={styles.name}>{comment.ownerfullName}</Text>
            <Text>{comment.content}</Text>
          </View>
          <TouchableOpacity  onPress={handleLikePressed} style={{zIndex: 9999}}>
            <View style={styles.reaction_container}>
              <Image style={styles.img_icon} source={like_images.liked}></Image>
              <Text style={{color: '#606770',fontSize:13}}>{noOfLike}</Text>
            </View>
          </TouchableOpacity>


          <Text style={styles.time}>{commentedTime}</Text>    
          
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
    alignSelf: 'flex-start',
    flexDirection:'row',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
    bottom: -18,
    left: -5,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 1.2,
    shadowOpacity: 0.4

  },
  img_icon: {
   height: 18,
   width: 18,
   marginRight: 4
  }
});