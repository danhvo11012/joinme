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
  
  const [ IdsReady, setIdsReady ] = useState(false);
  const [ followingIds, setFollowingIds ] = useState(null);
  useEffect(() => { 
    if (!IdsReady && !followingIds) {
      followingListsCollection.findOne({ userId: props.currentUserId })
        .then(res => {
          if (res) {
            setFollowingIds(res.followingList);
          }
        })
    }
  }, [ IdsReady, followingIds ]);

  useEffect(() => {
    if (followingIds && !IdsReady) {
      setIdsReady(true);
    }
  }, [ followingIds, IdsReady ]);

  const [ followingList, setFollowingList ] = useState(null);
  useEffect(() => {
    if (IdsReady && !followingList) {
      let tempList = [];
      
      followingIds.map((userId, index) => {
        profilesCollection.findOne({userId: userId})
          .then(res => {
            tempList.push(res);
            if (index == followingIds.length -1 ) {
              setFollowingList(tempList);
            }
          });
      });
    }
  }, [ IdsReady, followingList ]);




  const [ followingListFullyLoaded, setFollowingListFullyLoaded ] = useState(false);
  const [ reconsider, setReconsider ] = useState(false);

  useEffect(() => {
    if (!reconsider) {

    if (followingList && !followingListFullyLoaded) {
      if (followingList.length === followingIds.length) {
        setFollowingListFullyLoaded(true);
        setReconsider(false);
      } else if (followingList.length != followingIds.length) {
        console.log("problem explodes");
        setReconsider(true);
      }
    }
  }
  }, [ followingListFullyLoaded, followingList, reconsider ]);

  useEffect(() => {
      console.log("reconsidering..")
      if (followingList) {
        if (followingList.length == followingIds.length) {
          setReconsider(true);
        } else {
          setReconsider(false);
        }
      }
      console.log("reconsidered is set to " + reconsider);
  }, [ reconsider ]);

  function followingListPrep() {
    let Items = []

    followingList.map((profile, index) => {
      Items.push(
        <ListItem
          key={index}
          leftAvatar={{ source: { uri: profile.avatar } }}
          title={profile.firstName + " " + profile.lastName}
          subtitle={profile.email}
          bottomDivider
        />
      );
    });

    return Items;
  }

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
        followingListFullyLoaded && followingListPrep()
      }
    </ScrollView>
    </View>
  );
}
export default FollowingList;
