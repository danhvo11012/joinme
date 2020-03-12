/**
 * Post Component
 * 
 * @author Danh Vo
 * @version 1.0
 */
import React, { useState, useEffect } from 'react';
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';

import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  ShadowPropTypesIOS,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import {
  Text,
  Card,
  Divider,
  ListItem,
  Button,
  Icon,
} from 'react-native-elements';

import {Layout, Avatar} from '@ui-kitten/components';

const Item = ({profile}) => {
  const default_avatar = '../assets/images/default_avatar.jpg';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10,}}>
      <Avatar
        style={{  
                  aspectRatio: 1.0,
                  alignSelf: 'flex-start',
                  borderWidth: 0.5,
                  borderColor: 'grey',
                }}
        size="medium"
        source={profile.avatar != '' ? {uri: profile.avatar} : require(default_avatar)}
      />
      <Text style={{marginLeft: 20, fontSize: 15}}>No Name</Text>
    </View>
  )
}

function FollowingList(props) {
  const [ listReady, setListReady ] = useState(false);
  const [ followingList, setFollowingList ] = useState(null);
  // const FLCollection = props.followingListsCollection;

  // useEffect(() => { 
  //   if (!listReady) {
  //     FLCollection.findOne({ userId: props.currentUserId })
  //       .then(res => {
  //         console.log(res);
  //       })
  //   }
  // }, [ listReady ]);

  const profile = { avatar: 'https://i.kinja-img.com/gawker-media/image/upload/todfqqyvpitss7ezk2ox.png' };

  return(
    <View
      style={{ 
        width: 260, 
        alignSelf: 'center',
      }}
    >
    <Text 
      style={{
        marginBottom: 40, 
        marginTop: 10, 
        alignSelf: 'center', 
        fontSize: 17,
        fontWeight: 'bold', 
        borderBottomWidth: 1, 
        borderBottomColor: 'black' 
        }}
    >
      Following List
    </Text>
    <ScrollView>
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    <Item profile={profile} />
    </ScrollView>
    </View>

  )
}
export default FollowingList;
