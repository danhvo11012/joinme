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

function FollowingList(props) {
  const [ IdsReady, setIdsReady ] = useState(false);
  const [ listReady, setListReady ] = useState(false);
  const [ followingIds, setFollowingIds ] = useState(null);
  const [ followingList, setFollowingList ] = useState(null);
  const [ shouldRender, setShouldRender ] =useState(false);

  const followingListsCollection = props.followingListsCollection;
  const profilesCollection = props.profilesCollection;

  const default_avatar = '../assets/images/default_avatar.jpg';

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
      console.log("FollowingIds is ready");
    }
  }, [ followingIds, IdsReady ]);

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

  useEffect(() => {
    if (!listReady && followingList && followingIds ) {
      console.log("Not even yet");
      console.log(followingList.length + '; ' + followingIds.length);
      if (followingList.length == followingIds.length) {
        setListReady(true);
        console.log("Even!");
      } else { setFollowingList(null) }
    }
  }, [ followingList, followingIds, listReady ])

  useEffect(() => {
    if (!shouldRender && listReady) {
      console.log("Done loading following list: " + followingList.length + '; ' + followingIds.length);
      setShouldRender(true);
    }
  }, [ shouldRender, listReady ]);

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
          shouldRender && followingList.map((profile, index) => (
            <ListItem
              key={index}
              leftAvatar={{ source: { uri: profile.avatar } }}
              title={profile.firstName + " " + profile.lastName}
              subtitle={profile.email}
              bottomDivider
            />
          ))
        }
      </ScrollView>
      </View>
  );
}
export default FollowingList;
