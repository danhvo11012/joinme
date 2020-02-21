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
function ProfileScreen( { route, navigation }) {
  YellowBox.ignoreWarnings(['VirtualizedLists should never be nested inside plain ScrollViews']);

  //prepare data to call API
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profileDetails = db.collection('profiles');

  //state
  const { currentUserId, user } = route.params;
  const [ loadingComplete, setLoadingComplete] = useState(false);
  const [ profile, setProfile ] = useState(null);


  //
  //const isSameUser = fale
  const styles = useStyleSheet(themedStyle);

  const onFollowButtonPress = (): void => {
    
  };

  const onMessageButtonPress = (): void => {
    
  };
  //user id: 5e475135639cc32a5bfdfefa
  const renderFriendItem = (info: ListRenderItemInfo<Profile>): React.ReactElement => (
    <View style={styles.friendItem}>
      <Avatar source={info.item.photo}/>
      <Text
        style={styles.friendName}
        category='c2'>
        {info.item.firstName}
      </Text>
    </View>
  );

  const renderPostItem = (info: ListRenderItemInfo<Post>): React.ReactElement => (
    <ImageBackground
      style={styles.postItem}
      source={info.item.photo}
    />
  );
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
      <TabBarIcon size={20} color="black" name="ios-create"></TabBarIcon>
    );
  };
  
  const friends: Profile[] = [
  Profile.jenAustin(),
  Profile.jenniferGreen(),
  Profile.helenKuper(),
  Profile.jenAustin(),
  Profile.jenniferGreen(),
  Profile.helenKuper(),
];  
  const posts: Post[] = [
    Post.plant1(),
    Post.travel1(),
    Post.style1(),
    Post.style1(),
    Post.plant1(),
    Post.travel1(),
    Post.travel1(),
    Post.style1(),
    Post.plant1(),
  ];

  useEffect(() => {
    function handleSetProfile(results) {
      setProfile(results);
    }
    profileDetails.findOne({})
      .then(results => {
        handleSetProfile(results);
        setLoadingComplete(true);
      });
  }, []);
  
  function onEditButtonPress() {
    navigation.navigate('Profile Settings', {
      //pass profile data to edit screen
      profile: {
        id: profile.userId,
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
          source={{uri: profile.avatar}}
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
        <Button
          style={styles.editButton}
          icon={EditIcon}
          status='control'
          onPress={onEditButtonPress}
          >
          EDIT
        </Button>
        {false &&
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
        </View>}
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
      <Text
        style={styles.sectionLabel}
        category='s1'>
        Friends
      </Text>
      <List
        contentContainerStyle={styles.friendsList}
        horizontal={true}
        data={friends}
        renderItem={renderFriendItem}
      />
      <Text
        style={styles.sectionLabel}
        category='s1'>
        Projects
      </Text>
      <List
        data={posts}
        numColumns={3}
        renderItem={renderPostItem}
      />
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
    marginVertical: 16,
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
    marginVertical: 20
  },
  socialsContainer: {
    flexDirection: 'row',
    width: '75%',
    marginVertical: 8,
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
