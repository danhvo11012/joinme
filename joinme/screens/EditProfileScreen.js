/** @format */

import React, {Component } from "react";
import { Text, View, StyleSheet, Button,Platform } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import { Button as ElementButton} from "react-native-elements";



export default function EditProfileScreen ({navigation, user, ref}){
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
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal!</Text>
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
  );
}

const styles = StyleSheet.create({
  saveBtnContainer:{
    width:"100%",
  },
  saveBtn: {
    color: 'white',
    fontSize:18,
    fontWeight: 'bold'
  }
});