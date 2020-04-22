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
import { itemWidth } from './SliderEntry';

function FollowingList(props) {
  const followingListsCollection = props.followingListsCollection;
  const profilesCollection = props.profilesCollection;

  const default_avatar = '../assets/images/default_avatar.jpg';

  const [ followingIds, setFollowingIds ] = useState(new Array());
  useEffect(() => { 
    if (!followingIds.length) {
      followingListsCollection.findOne({ userId: props.currentUserId })
        .then(res => {
          if (res) {
            setFollowingIds(res.followingList);
          }
        })
    }
  }, [ followingIds ]);

  const [ followingList, setFollowingList ] = useState(new Array());
  useEffect(() => {
    var myPromise = (userId) => {
      return new Promise((resolve, reject) => {
        profilesCollection.findOne({userId: userId})
          .then(res => {
            // if (!res.avatar) { res.avatar = default_avatar }
            resolve(res);
          })
      })
    }
      if (followingIds.length) {
        const list = followingIds;
        Promise.all(list.map(userId => myPromise(userId)))
          .then(data => setFollowingList(data));
    }
  }, [ followingIds ]);

  const [ followingListFullyLoaded, setFollowingListFullyLoaded ] = useState(false);
  useEffect(() => {
    if (!(followingList.length > 0 && followingList.length == followingIds.length)) {                         
      setFollowingListFullyLoaded(false);
    } else {
      setFollowingListFullyLoaded(true);
    }
  }, [ followingList, followingListFullyLoaded ]);
 
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
      {
        followingListFullyLoaded && followingList.map((profile, index) => {
            return(
              <ListItem
                key={index}
                leftAvatar={{ source: profile.avatar !== '' ? { uri: profile.avatar } : require(default_avatar) }}
                title={profile.firstName + " " + profile.lastName}
                subtitle={profile.email}
                bottomDivider
              />
            )
          })
      }
    </ScrollView>
    </View>
  );
}
export default FollowingList;
