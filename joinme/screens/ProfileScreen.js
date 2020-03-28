import React, { useState, useEffect } from 'react'
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';
import {
  StyleSheet,
  View,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  ScrollView,
  YellowBox,
  DeviceEventEmitter,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationEvents } from 'react-navigation';

import { Input, Button as ElementsButton, Icon, Image, Overlay } from 'react-native-elements';
import { ImageOverlay } from '../components/ImageOverlay';
import { ProfileSocial } from '../components/ProfileSocial';

import TabBarIcon from '../components/TabBarIcon'
import { Avatar, Button, List, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import ProfileSchema from '../constants/ProfileSchema';
import FollowingList from '../components/FollowingList';

function ProfileScreen( { route, navigation }) {
  useEffect (()=>{
    DeviceEventEmitter.addListener('listener', (e)=>{
        setLoadingComplete(false);
    });
  });

  //prepare data to call API
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profiles = db.collection('profiles');
  const followingListsCollection = db.collection('followingLists');

  //state
  const { currentUserId, user } = route.params;
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ profile, setProfile ] = useState(null);
  const [ isListVisible, setIsListVisble ] = useState(false);

  // Following List
  const [ followingListFound, setFollowingListFound ] = useState(false);

  const styles = useStyleSheet(themedStyle);
  
  //icons

  const EditIcon = () => {
    return(
      <TabBarIcon size={24} color="black" name="ios-create"></TabBarIcon>
    );
  };

  const LogOutIcon = () => {
    return(
      <TabBarIcon  size={35} color="#bababa" name="ios-log-out"></TabBarIcon>
    );
  };

  useEffect(() => {
    if (!followingListFound) {
      followingListsCollection.findOne({ userId: currentUserId })
        .then(res => {
          console.log(res);
          if (res) {
            setFollowingListFound(true);
          } else {
            console.log("Following list not found.");
            followingListsCollection.insertOne({
              userId: currentUserId,
              followingList: [
                "5e61671b93037f34d9fd7935",
                "5e4759b2125403d353cc0a6f",
                "2e61671b233037f13d9fd7935",
              ],
            })
              .then(res => {
                console.log("New following list created.");
                console.log(res);
              });
          }
        })
    }
  }, [followingListFound]);

  useEffect(() => {
    if(!loadingComplete) {
      profiles.findOne({ userId: currentUserId })
      .then((result) => {
        if (result) {
          console.log('Profile found.');
          setProfile(result);

        } else {
          console.log('No profile found.');
          const profile = ProfileSchema(currentUserId, user.email);
          profiles.insertOne(profile)
            .then(res => {
              console.log('New profile added.');
            });
          setProfile(profile);
        }
      });
        setLoadingComplete(true);
    }
  }, [loadingComplete]);

  function onEditButtonPress() {
    navigation.navigate('Profile Settings', {
      //pass profile data to edit screen
      profile: {
        userId: currentUserId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        school: profile.school,
        avatar: profile.avatar,
        city: profile.city,
        work: profile.work,
        summary: profile.summary
      }
    });
  }

  const handleIsListVisible = () => {
    setIsListVisble(!isListVisible);
  }

  
  const logOut = async () => {      
        client.auth.logout().then(user => {
          console.log(`User ${currentUserId} successfully logged out`);
          
          navigation.navigate('Auth', {
            currentUserId: currentUserId
          }); 
        }).catch(err => {
          console.log(`User ${user} failed to log out: ${err}`);
        });
  }

  if (!loadingComplete || !profile) {
    return null;
  } else {
    return(
      <ScrollView style={styles.container}>
      <ImageOverlay
        style={styles.header}
        source={require('../assets/images/profile_bg.jpg')}>
       
        <Avatar
          style={styles.profileAvatar}
          source={profile.avatar != '' ? {uri: profile.avatar} : require('../assets/images/default_avatar.jpg')}
        />
        <Text
          style={styles.profileName}
          category='h5'
          status='control'>
          {profile.firstName + " " + profile.lastName}
        </Text>
        <View style={styles.locationContainer}>
          <TabBarIcon size={16} color="white" name='ios-pin' /> 
          <Text
            style={styles.location}
            status='control'>
            {profile.city}
          </Text>
        </View>
        
          <View style={styles.profileButtonsContainer}>
            <Button
              style={styles.editButton}
              icon={EditIcon}
              status='control'
              onPress={onEditButtonPress}>
              EDIT
            </Button> 
          </View>
        
        
        <View style={{ flexDirection: 'row', width: '100%' }} >
          <View style={{flex:1}}></View>
          <View style={styles.socialsContainer}>
            <ProfileSocial
              style={styles.profileSocial}
              hint='Projects'
              value={`${profile.project_count}`}
            />
            <ProfileSocial
              style={styles.profileSocial}
              hint='Friends'
              value={`${profile.friend_count}`}
            />
            <ProfileSocial
              style={styles.profileSocial}
              hint='Posts'
              value={`${profile.post_count}`}
            />
          </View>
          <View style={{ flex: 1}}>
            <ElementsButton
                style={styles.logOutButton}
                icon={LogOutIcon}
                onPress={logOut}
                type="clear"
                >
            </ElementsButton>
          </View>
        </View>
      </ImageOverlay>
      <Text
        style={styles.sectionLabel}
        category='s1'>
        About
      </Text>
      <Text
        style={styles.profileDescription}
        appearance='hint'>
        {profile.summary}
      </Text>
      <View>
        <Text
          style={styles.sectionLabel}
          category='s1'>
          Following
        </Text>
        <ElementsButton
          style={{width: 300, heigh: 100, alignSelf: 'center'}}
          type="outline"
          titleStyle={{ fontSize: 15}}
          title="View Full Following List"
          onPress={handleIsListVisible}>
        </ElementsButton>
      </View>
      <View>
        <Overlay 
          isVisible={isListVisible}
          height='100%'
          overlayStyle={{ marginTop: 80}}
          animated={true}
          onBackdropPress={handleIsListVisible}
        >
            <FollowingList 
              currentUserId={currentUserId} 
              followingListsCollection={followingListsCollection}
              profilesCollection={profiles}
            />
        </Overlay>
      </View>
    </ScrollView>
    );
  }
};
export default ProfileScreen;

const themedStyle = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  header: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  profileAvatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    top: '-5%',
    marginTop: 10
  },
  profileName: {
    zIndex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    marginVertical: 8,
    marginLeft: 8
  },
  profileButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 32,
    marginHorizontal: 20,
  },
  profileButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  editButton: {
    width: '40%',
  },
  logOutButton: {
    width: 70,
    left: -25,
    bottom: -20
  },
  socialsContainer: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: '80%',
    marginVertical: 5,
  },
  profileSocial: {
    flex: 1,
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  profileDescription: {
    marginHorizontal: 16,
  },
  friendsList: {
    marginHorizontal: 8,
  },
  friendItem: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  friendName: {
    marginTop: 8,
  },
  postItem: {
    flex: 1,
    aspectRatio: 1.0,
  },
});
