import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity,Dimensions,StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import DoubleClick from './DoubleTap';


export default class SliderEntry extends Component {
    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };


    get image () {
      const { data: { avatar }, parallax, parallaxProps, even } = this.props;

      return false ? (
        <ParallaxImage
          source={avatar != '' ? {uri: avatar} : require('../assets/images/default_avatar.jpg')}
          containerStyle={[ styles.imageContainer, even ? styles.imageContainerEven : {} ]}
          style={styles.image}
          parallaxFactor={0.35}
          showSpinner={true}
          spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
          {...parallaxProps}
        />
      ) : (<Image
            source={avatar != '' ? {uri: avatar} : require('../assets/images/default_avatar.jpg')}
            style={styles.image}
          />);
    }

  render () {
    const { data: { userId, firstName, lastName, email }, even, onEntryClick, onEntryDoubleClick } = this.props;
    const title = firstName + ' ' + lastName;
    const subtitle = email;
    const uppercaseTitle = title ? (
      <Text
        style={[styles.title, even ? styles.titleEven : {}]}
        numberOfLines={2}
      >
          { title.toUpperCase() }
      </Text>
    ) : false;

    return (
      <DoubleClick
          style={[styles.slideInnerContainer, styles.shadow]}
          activeOpacity={0.95}
          singleTap={() => {
            onEntryClick();
          }}
          doubleTap={() => {
            onEntryDoubleClick();
          }}
          delay={350}
        >

        <View style={[styles.slideInnerContainer]} >

            <View style={[styles.imageContainer, even ? styles.imageContainerEven : {}]}>
                { this.image }
                <View style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]} />
            </View>
            <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
                { uppercaseTitle }
                <Text
                  style={[styles.subtitle, even ? styles.subtitleEven : {}]}
                  numberOfLines={2}
                >
                  { subtitle }
                </Text>
            </View>
        </View>
      </DoubleClick>
    );
  }
}

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

const slideHeight = viewportHeight * 0.65;
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 5;

const styles = StyleSheet.create({
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 15, // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: 'black',
        shadowOpacity: 0.35,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius,
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
    },
    imageContainerEven: {
        backgroundColor: 'black'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        width: '100%'
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: 'black'
    },
    textContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius,
    },
    textContainerEven: {
        backgroundColor: 'black'
    },
    title: {
        color: 'black',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: 'gray',
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});