/** @format */

import React, {Component } from "react";
import { View, StyleSheet,Dimensions, Platform } from "react-native";
import TabBarIcon from "../components/TabBarIcon";
import { HeaderBackButton } from 'react-navigation';
import Modal from 'react-native-modalbox';


export default function EditProfileModal ({user, ref}){
  function closeModal (){
    this.modal.close();
  };

  function openModal() {
    this.modal.open();
  }
    return (
      <Modal
          style={[styles.modal]}
          isOpen={true}
          ref={(modal) => (this.modal = modal)}>
            <Text style={styles.text}>Basic modal</Text>
            <Button title={'Nothing to see'}/>
        </Modal>
    );
}



const styles = StyleSheet.create({

  wrapper: {
    paddingTop: 50,
    flex: 1
  },

  modal: {
    justifyContent: 'center',
    alignItems: 'center'
  },
});