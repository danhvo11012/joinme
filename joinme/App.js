// @ts-nocheck
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import useLinking from './navigation/useLinking';
import { cacheImages, cacheFonts } from './helpers/AssetsCaching';
import vectorFonts from './helpers/vector-fonts';

import AppContainer from './navigation';

import { Stitch } from 'mongodb-stitch-react-native-sdk';
import { Button } from 'react-native-elements';

export default function App(props) {
  
  const [isLoadingComplete, setLoadingComplete] = useState(false);
  const [initialNavigationState, setInitialNavigationState] = useState();
  const containerRef = useRef();
  const { getInitialState } = useLinking(containerRef);


  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide();

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
        
        const fontAssets = cacheFonts([
          ...vectorFonts,
          { georgia: require('./assets/fonts/Georgia.ttf') },
          { regular: require('./assets/fonts/Montserrat-Regular.ttf') },
          { light: require('./assets/fonts/Montserrat-Light.ttf') },
          { bold: require('./assets/fonts/Montserrat-Bold.ttf') },
          { UbuntuLight: require('./assets/fonts/Ubuntu-Light.ttf') },
          { UbuntuBold: require('./assets/fonts/Ubuntu-Bold.ttf') },
          { UbuntuLightItalic: require('./assets/fonts/Ubuntu-Light-Italic.ttf') },
        ]);

        //load images
        const imageAssets = cacheImages([
          require('./assets/images/bg_screen4.jpg'),
        ]);
    
        await Promise.all([...imageAssets, ...fontAssets]);
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hide();
      }
    };

    loadResourcesAndDataAsync();
  }, []);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return null;
  } else {
    return (
      <AppContainer />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
