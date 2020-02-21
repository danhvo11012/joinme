/** @format */

import React, {Component } from "react";
import { Text, View, StyleSheet, Button,Animated, ScrollView, } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import { Button as ElementButton} from "react-native-elements";



export default function EditProfileScreen ({navigation, user}) {
  navigation.setOptions({
    headerLeft: () => (
      <Button onPress={() => navigation.goBack()} title="Cancel" />
    ),
  });

  function submitChange(){
    navigation.goBack();
    alert('Infor Updated!');
  }

  return (
    <ScrollView>
      <View style={[styles.container]}>
          <Animated.ScrollView
            // ref={(c) => (this.list = c)}
            overScrollMode="never"
            
            scrollEventThrottle={1}
            onScroll={(event) => {
              this.state.scrollY.setValue(event.nativeEvent.contentOffset.y);
            }}>
              <View>
                <Text style={{ fontSize: 30 }}>This is a modal!</Text>
              </View>
            </Animated.ScrollView>
        <View style={styles.saveBtnContainer}>
          <ElementButton
            titleStyle={styles.saveBtn}
            onPress={submitChange}
            title="Save"
            buttonStyle={{
              borderRadius: 0,
            }}
          />
        </View> 
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "white",
    elevation: 5,
  },
  saveBtnContainer:{
    width:"100%",
  },
  saveBtn: {
    color: 'white',
    fontSize:18,
    fontWeight: 'bold',
    zIndex:999
  }
});