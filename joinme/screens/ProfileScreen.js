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
  YellowBox
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { Input, Button as ElementsButton, Icon, Image } from 'react-native-elements';
import { ImageOverlay } from '../components/ImageOverlay';
import { ProfileSocial } from '../components/ProfileSocial';
import { Post, Profile } from './profile-7/extra/data';
import TabBarIcon from '../components/TabBarIcon'
import { Avatar, Button, List, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import ProfileSchema from '../constants/ProfileSchema';
function ProfileScreen( { route, navigation }) {
  YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews']);
  
  //prepare data to call API
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profiles = db.collection('profiles');

  //state
  const { currentUserId, user } = route.params;
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ profile, setProfile ] = useState(null);
 
  const styles = useStyleSheet(themedStyle);

  const onFollowButtonPress = (): void => {
    
  };

  const onMessageButtonPress = (): void => {
    
  };
  
  //icons
  const MessageCircleIcon = () => {
    return(
      <TabBarIcon color="black" name="ios-mail"></TabBarIcon>
    );
  };
  const PersonAddIcon = () => {
    return(
      <TabBarIcon color="white" name="ios-add"></TabBarIcon>
    );
  };
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
    if(!loadingComplete)
    {
      profiles.findOne({ userId: currentUserId })
      .then((result) => {
        if (result) {
          console.log(`found the profile!`);
          setProfile(result);
        } else {
          console.log('No profile');
          //create a new profile
          const profile = ProfileSchema(currentUserId, user.email);
          profiles.insertOne(profile)
          .then(res => {
            console.log('profiles responded: ');
            console.log(res);
          });
          setProfile(profile);
        }
        setLoadingComplete(true);
      }, [loadingComplete]);
    }
  });

  // useEffect(() => {
  //   if(!loadingComplete)
  //   {
  //     profiles.findOne({userId: currentUserId})
  //       .then(results => {
  //         console.log(results);
  //         setProfile(results);
  //         setLoadingComplete(true);
  //     });
  //   }
  // }, [loadingComplete]);
  
  function reload() {
    setLoadingComplete(false);
  }

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
      },
      onGoBack: () => reload()
    }); 
  }

  const isSameUser = true;
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

  if (!loadingComplete) {
    return null;
  } else {
    return(
      <ScrollView style={styles.container}>
      <ImageOverlay
        style={styles.header}
        source={require('./profile-7/assets/image-background.jpg')}>
       
        <Avatar
          style={styles.profileAvatar}
          source={profile.avatar != '' ? {uri: profile.avatar}}
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
        {isSameUser &&
          <View style={styles.profileButtonsContainer}>
            <Button
              style={styles.editButton}
              icon={EditIcon}
              status='control'
              onPress={onEditButtonPress}>
              EDIT
            </Button> 
          </View>
        }
        {!isSameUser &&
          <View style={styles.profileButtonsContainer}>
            <Button
              style={styles.profileButton}
              icon={PersonAddIcon}
              onPress={onFollowButtonPress}>
              FOLLOW
            </Button>
            <Button
              style={styles.profileButton}
              status='control'
              icon={MessageCircleIcon}
              onPress={onMessageButtonPress}>
              MESSAGE
            </Button>
          </View>
        }
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
    top: '-5%'
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
    //Danh modified:
    width: 70,
    left: -25,
    bottom: -20

    // Khiem's
    // width:'12%', 
    // borderRadius: 0,
    // bottom: '48%',
    // backgroundColor:'#f2f3f5',
    // borderColor:'white',
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 1.2,
    // shadowOpacity: 0.3
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
