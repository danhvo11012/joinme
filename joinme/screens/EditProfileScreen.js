/** @format */

import React, {Component } from "react";
import { Text, View, Button,Dimensions, Platform } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import { HeaderBackButton } from 'react-navigation';
import Modal from 'react-native-modalbox';


export default function EditProfileScreen ({navigation, user, ref}){
  
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30 }}>This is a modal!</Text>
        <Button onPress={() => navigation.goBack()} title="Dismiss" />
    </View>
    );
}


