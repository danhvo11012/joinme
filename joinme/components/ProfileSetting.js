import React,{useState, useEffect} from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { Divider, Layout, LayoutProps, Text, Input } from '@ui-kitten/components';

export interface ProfileSettingProps extends LayoutProps {
  hint?: string;
  value: string;
}

export const ProfileSetting = (props: ProfileSettingProps): React.ReactElement => {

  const { style, hint, value,type,sendTextValue, ...layoutProps } = props;
  //console.log(value);
  const renderHintElement = (): React.ReactElement => (
    <Text
      appearance='hint'
      category='s1'>
      {hint}
    </Text>
  );
  const [text, setText] = useState(value);
  
  return (
    <React.Fragment>
      <Layout
        level='1'
        {...layoutProps}
        style={[styles.container, style]}>
        {hint && renderHintElement()}
        <TextInput category='s1'
            style={type === 'fname' || type === 'lname' ? styles.name : styles.input}
            editable={hint==='Email' ? false:true}
            color={hint==='Email' ? '#848c86' : "#000000"}
            placeholder={type ==='fname' ? 'First name' : type === 'lname' ? 'Last name' : ''}
            placeholderTextColor={"#9E9E9E"}
            onChangeText={(content) => sendTextValue(content)}
            >
          {text}
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
