import React from 'react';
import { ScrollView, View, TextInput,Button } from 'react-native';
import { Button as KittenButton, Layout, StyleService, Text, useStyleSheet } from '@ui-kitten/components';
import { ProfileSetting } from '../components/ProfileSetting';
import { ProfileAvatar } from '../components/ProfileAvatar';
import TabBarIcon from '../components/TabBarIcon'  
import {Button as ElementButton} from 'react-native-elements' 

export default function ProfileSettingScreen( {route, navigation} ) {
  const { currentUserId, profile } = route.params;
  const styles = useStyleSheet(themedStyles);
  navigation.setOptions({
      headerLeft: () => (
        <Button onPress={() => navigation.goBack()} title="Cancel" />
      ),
  });
  console.log(profile);
  const onDoneButtonPress = (): void => {
    navigation && navigation.goBack();
  };
  const CameraIcon =()=>{
    return (
      <TabBarIcon 
        style={styles.icon} 
        name="ios-camera" 
        type="AvatarIcon">
      </TabBarIcon>)
    ;
  } 
  const renderPhotoButton = (): React.ReactElement => (
    <KittenButton
      style={styles.photoButton}
      size='small'
      status='basic'
      icon={CameraIcon}
    />
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}>
      <Layout
        style={styles.photoSection}
        level='1'>
        <ProfileAvatar
          style={styles.photo}
          source={{uri: profile.avatar}}
          editButton={renderPhotoButton}
        />
        <View style={styles.nameSection}>
          <ProfileSetting
            type='name'
            style={styles.setting}
            value={profile.firstName}
          />
          <ProfileSetting
            type='name'
            style={styles.setting}
            value={profile.lastName}
          />
        </View>
      </Layout>
      <TextInput
        style={styles.description}
        underlineColorAndroid="transparent"
        placeholder={"Type Something in Text Area."}
        placeholderTextColor={"#9E9E9E"}
        numberOfLines={10}
        multiline={true}
        value={profile.summary}
      />
      <ProfileSetting
        style={[styles.setting, styles.emailSetting]}
        hint='Email'
        value={profile.email}
      />
      <ProfileSetting
        style={styles.setting}
        hint='College'
        value={profile.school}
      />
      <ProfileSetting
        style={styles.setting}
        hint='Work'
        value={profile.work}
      />
      <ProfileSetting
        style={styles.setting}
        hint='City'
        value={profile.city}
      />
      <ElementButton
        style={styles.doneButton}
        onPress={onDoneButtonPress}
        title="Save">
        
      </ElementButton>
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
  doneButton: {
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
