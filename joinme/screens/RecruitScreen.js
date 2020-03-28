import React, { useState, useEffect } from 'react'
import { Stitch, AnonymousCredential, UserPasswordCredential, RemoteMongoClient } from 'mongodb-stitch-react-native-sdk';
import CreateUserModal from '../components/CreateUserModal';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  Dimensions,
  LayoutAnimation,
  UIManager,
  KeyboardAvoidingView,
  ScrollView,
  Modal
} from 'react-native';

import { Input, Button, Icon } from 'react-native-elements';
import Carousel, { Pagination, getInputRangeFromIndexes } from 'react-native-snap-carousel';
import SliderEntry from '../components/SliderEntry';

//width, height
function wp (percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const slideHeight = viewportHeight * 0.36;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

function RecruitScreen({ route, navigation }) {
  const client =  Stitch.defaultAppClient;
  const mongoClient = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas')
  const db = mongoClient.db('joinme');
  const profiles = db.collection('profiles');

  const { currentUserId, user } = route.params;
  const [ profilesReady, setProfilesReady ] = useState(false);
  const [ filteredProfiles, setFilteredProfiles ] = useState(null);
  const [ showCreateUserModal, setShowCreateUserModal ] = useState(false);
  const [ selectedUser, setSelectedUser] = useState(null);
  
  useEffect(() => {
    if (!profilesReady) {
      profiles.find({})
        .asArray()
        .then(res => {
          setFilteredProfiles(res);
          setProfilesReady(true);
        });
    }
  }, [ profilesReady ])

  //animation
function _scrollInterpolator (index, carouselProps) {
        const range = [3, 2, 1, 0, -1];
        const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
        const outputRange = range;

        return { inputRange, outputRange };
}

function _animatedStyles (index, animatedValue, carouselProps) {
        const sizeRef = carouselProps.vertical ? carouselProps.itemHeight : carouselProps.itemWidth;
        const translateProp = carouselProps.vertical ? 'translateY' : 'translateX';

        return {
            zIndex: carouselProps.data.length - index,
            opacity: animatedValue.interpolate({
                inputRange: [2, 3],
                outputRange: [1, 0]
            }),
            transform: [{
                rotate: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2, 3],
                    outputRange: ['-25deg', '0deg', '-3deg', '1.8deg', '0deg'],
                    extrapolate: 'clamp'
                })
            }, {
                [translateProp]: animatedValue.interpolate({
                    inputRange: [-1, 0, 1, 2, 3],
                    outputRange: [
                        -sizeRef * 0.5,
                        0,
                        -sizeRef, // centered
                        -sizeRef * 2, // centered
                        -sizeRef * 3 // centered
                    ],
                    extrapolate: 'clamp'
                })
            }]
        };
}
//items
function _renderLightItem ({item, index}) {
  return <SliderEntry data={item} even={false} onEntryClick={handleEntryClick} />;
}

const handleEntryClick = (id) => {
  //show user modal
  setShowCreateUserModal(true);
  
  //send profile to modal
  var profile = filteredProfiles.find( ({userId}) => userId === id);
  setSelectedUser(profile);
}

const hideUserModal = () => {
  //hide user modal
  setShowCreateUserModal(false);
}

  return(
    <View style={[styles.exampleContainer, styles.exampleContainerDark ]}>
      <Text style={styles.title}>Recruiting...</Text>
      <Text style={styles.subtitle}>Is this one you're looking for?</Text>
      {filteredProfiles && 
        <Carousel
          data={ filteredProfiles }
          renderItem={_renderLightItem}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          layout={'tinder'}
          layoutCardOffset={19}
          loop={true}
          scrollInterpolator={_scrollInterpolator}
          slideInterpolatedStyle={_animatedStyles}
          useScrollView={true}
        />
      }
            <Modal 
              visible={showCreateUserModal}
              animationType="slide"
            >
              <CreateUserModal profile={selectedUser} onClose={hideUserModal}/>
            </Modal>

    </View>
  );
}

export default RecruitScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black'
  },
  container: {
    flex: 1,
    backgroundColor: '#B721FF'
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  scrollview: {
    flex: 1
  },
  exampleContainer: {
    paddingVertical: 30,
    alignSelf: 'center',
      
  },
  exampleContainerDark: {
    backgroundColor: 'grey'
  },
  exampleContainerLight: {
    backgroundColor: 'white'
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  titleDark: {
    color: 'black'
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  slider: {
    marginTop: 15,
    overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10 // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  }
});