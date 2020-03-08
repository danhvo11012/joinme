import React, {useState,useEffect} from 'react';
import { ScrollView, View, TextInput,Button } from 'react-native';
import { Button as KittenButton, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { ProfileSetting } from '../components/ProfileSetting';
import { ProfileAvatar } from '../components/ProfileAvatar';
import TabBarIcon from '../components/TabBarIcon'  
import {Button as ElementButton} from 'react-native-elements' 
import { Stitch, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';

export default function ProfileSettingScreen(props) {
  const {route, navigation} = props;
  const { profile } = route.params;
  //console.log('From psetting: ' + profile);
  const styles = useStyleSheet(themedStyles);

  //prepare data to call API
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profileDetails = db.collection('profiles');

  //profile metrics
  const [fname, setFname] = useState(profile.firstName);
  const [lname, setLname] = useState(profile.lastName);
  const [summary, setSummary] = useState(profile.summary);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [school, setSchool] = useState(profile.school);
  const [work, setWork] = useState(profile.work);
  const [city, setCity] = useState(profile.city);
  
  //full profile
  const [fullProfile, setFullProfile] = useState(profile);

  const [ profileReady, setProfileReady ] = useState(false);
  
  navigation.setOptions({
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()} title="Cancel" />
      ),
  });

  useEffect(() => {
    if (profileReady) {
      // console.log(fullProfile);
      profileDetails.findOneAndUpdate(
        { userId: fullProfile.userId },
        { $set: fullProfile }
      ).then(res => {
          navigation && navigation.navigate('Profile');
        });
      setProfileReady(false);
    }
  }, [profileReady]);

  function onSaveButtonPress() {
    handleFulllProfileChange();
    setProfileReady(true);
  }

  const CameraIcon =()=>{
    return (
      <TabBarIcon 
        style={styles.icon} 
        name="ios-camera" 
        color="white">
      </TabBarIcon>)
    ;
  }

  function handleFulllProfileChange(){   
    setFullProfile({
      userId: fullProfile.userId,
      firstName: fname,
      lastName: lname,
      email: fullProfile.email,
      school: school,
      avatar: avatar,
      city: city,
      work: work,
      summary: summary
    });   
  }
 
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Layout
        style={styles.photoSection}
        level='1'>
        <ProfileAvatar
          style={styles.photo}
          source={fullProfile.avatar != '' ? {uri: fullProfile.avatar} : require('../assets/images/default_avatar.jpg')}
        />
        <View style={styles.nameSection}>
          <ProfileSetting
            type='fname'
            style={styles.setting}
            value={fullProfile.firstName}
            sendTextValue={setFname}
          />
          <ProfileSetting
            type='lname'
            style={styles.setting}
            value={fullProfile.lastName}
            sendTextValue={setLname}
          />
        </View>
      </Layout>
      <TextInput
        style={styles.description}
        underlineColorAndroid="transparent"
        placeholder={"About me..."}
        placeholderTextColor={"#9E9E9E"}
        numberOfLines={10}
        multiline={true}
        onChangeText={setSummary}
      >
        {fullProfile.summary}
      </TextInput>
      <ProfileSetting
        style={styles.setting}
        hint='Avatar Url'
        value={fullProfile.avatar}
        sendTextValue={setAvatar}
      />
      <ProfileSetting
        style={[styles.setting, styles.emailSetting]}
        hint='Email'
        value={fullProfile.email}
      />
      <ProfileSetting
        style={styles.setting}
        hint='College'
        value={fullProfile.school}
        sendTextValue={setSchool}
      />
      <ProfileSetting
        style={styles.setting}
        hint='Work'
        value={fullProfile.work}
        sendTextValue={setWork}
      />
      <ProfileSetting
        style={styles.setting}
        hint='City'
        value={fullProfile.city}
        sendTextValue={setCity}
      />
      <KittenButton
        style={styles.saveButton}
        onPress={onSaveButtonPress}
        title="Save">
        Save
      </KittenButton>
    </ScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-2',
  },
  contentContainer: {
    paddingBottom: 24,
  },
  photoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  photo: {
    aspectRatio: 1.0,
    height: 76
  },
  photoButton: {
    aspectRatio: 1.0,
    height: 40,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 52, 52, 0)',
    borderColor:'rgba(52, 52, 52, 0)'
  },
  icon: {
    alignSelf: 'center',
    color: 'white'
  },
  nameSection: {
    flex: 1,
    marginHorizontal: 8,
  },
  description: {
    padding: 24,
    backgroundColor: 'background-basic-color-1',
    paddingTop:15,
    
  },
  saveButton: {
    marginHorizontal: 24,
    marginTop: 24,
  },
  setting: {
    padding: 16,
    
  },
  emailSetting: {
    marginTop: 24,
  },
});
