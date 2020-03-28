import {View, Text,ScrollView,StyleSheet, Button} from 'react-native';
import {Avatar, Button as ElementButton} from 'react-native-elements';
import React, { useState, useEffect } from 'react';
import TabBarIcon from './TabBarIcon';
import { ImageOverlay } from '../components/ImageOverlay';
export default function CreateUserModal(props) {

    const {profile} = props;
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
    return (
        <ScrollView style={styles.container}>
       <View
        style={styles.header}
        >
        
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
                <ElementButton
                style={styles.profileButton}
                icon={PersonAddIcon}
                
                >
                FOLLOW
                </ElementButton>
                <ElementButton
                style={styles.profileButton}
                status='control'
                icon={MessageCircleIcon}
                
                >
                MESSAGE
                </ElementButton>
                <Button title="Back" onPress={props.onClose}> </Button>
        </View>

        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
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
