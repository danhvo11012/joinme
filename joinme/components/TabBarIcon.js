import * as React from 'react';
import { Ionicons } from 'react-native-vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  const defaultColorPack = props.focused ? Colors.tabIconSelected : Colors.tabIconDefault;
  return (
    <Ionicons
      name={props.name}
      size={props.size === undefined ? 26 : props.size}
      style={{ marginBottom: -3 }}  
      color={props.color != undefined ? props.color : defaultColorPack}
    />
  );
}
