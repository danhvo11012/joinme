/** @format */

import React, {Component } from "react";
import { View, StyleSheet,Dimensions, Platform } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import { HeaderBackButton } from 'react-navigation';

const Back = (navigation) => (
    <TouchableOpacity
      
      onPress={() => {
        navigation.goBack(null);
      }}>

      <TabBarIcon name="arrowleft"></TabBarIcon>
    </TouchableOpacity>
  );

export default class EditFormScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
      headerLeft:Back(navigation),
      headerStyle: styles.toolbarFloat,
      headerTransparent: true,
  });

  render() {
    const { navigation } = this.props;

    return (
      <View  />
    );
  }
}

const { height, width } = Dimensions.get("window");
const styles = StyleSheet.create({
    toolbarFloat: {
        position: "absolute",
        top: 0,
        borderBottomWidth: 0,
        zIndex: 999,
        width,

        ...Platform.select({
        ios: {
            backgroundColor: "transparent",
            
        },
        android: {
            backgroundColor: "transparent",
            height: 46,
            paddingTop: 24,
        },
        }),
    }
});