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

const [pressedLike, setPressedLike] = useState(false);
const [likeCount, setLikeCount] = useState(0);
const badge_liked_icon = () => {
  var name = pressedLike ? '../assets/images/liked_icon.png' : '../assets/images/not_liked_icon.png';
  return require($name);
}

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

          <TouchableOpacity  style={{zIndex: 999}}>
              <View style={styles.reaction_container}>
                <Image style={styles.img_icon} source={badge_liked_icon}></Image>
                <Text style={{color: '#606770',fontSize:13}}>999</Text>
              </View>
          </TouchableOpacity>

          <Text style={styles.time}>29m</Text>    
          
        </View>
      </View>
  
  );
}
const comment = {
  ownerId: 'someone@gmail.com',
  ownerfullName: 'Nameless Boyy',
  avatar: 'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/s960x960/83009231_2625407500907338_7630964988617687040_o.jpg?_nc_cat=104&_nc_ohc=jm7RGaAHGokAX9o-_W1&_nc_ht=scontent-dfw5-2.xx&_nc_tp=7&oh=be5920e9cce38b1df8464eef98fd55a6&oe=5EFCE6EE',
  content: 'Hi, my name is Some Namas sa sd asd as dasdaas asd a d  da asdasasdasd asdasdasda sddasdasd sdassadasd sadsas dasdasdasd asasdasdasd asda sdasdda sdasdasda sdasdasdasda sdasdsadasdase.'
};
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: "2.5%",
    marginVertical: "2%"
    //backgroundColor: 'red'
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
    marginHorizontal: 10,
    marginTop: '3%',
    color: '#606770',
    left: '25%',
    bottom: '5%'
  },
  reaction_container: {
    position: 'absolute',
    alignSelf: 'flex-end',
    flexDirection:'row',
    backgroundColor: 'white',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
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