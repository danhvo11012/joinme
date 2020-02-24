import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Divider, Layout, LayoutProps, Text, Input } from '@ui-kitten/components';

export interface ProfileSettingProps extends LayoutProps {
  hint?: string;
  value: string;
}

export const ProfileSetting = (props: ProfileSettingProps): React.ReactElement => {

  const { style, hint, value,type, ...layoutProps } = props;
  //console.log(value);
  const renderHintElement = (): React.ReactElement => (
    <Text
      appearance='hint'
      category='s1'>
      {hint}
    </Text>
  );

  return (
    <React.Fragment>
      <Layout
        level='1'
        {...layoutProps}
        style={[styles.container, style]}>
        {hint && renderHintElement()}
        <TextInput category='s1'
            style={type === 'name' ? styles.name : styles.input}
            editable={hint==='Email' ? false:true}
            color={hint==='Email' ? '#848c86' : "#000000"}
            >
          {value}
        </TextInput >
      </Layout>
      <Divider/>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input :{
    //borderColor: 'white',
    width:'80%',
    textAlign:'right'
  },
  name: {
   
    width:'100%',
    textAlign:'left'
  }
  
});
