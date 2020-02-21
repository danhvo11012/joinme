import * as React from 'react';
import { Ionicons } from 'react-native-vector-icons';

import Colors from '../constants/Colors';

export default function TabBarIcon(props) {
  const defaultColorPack = props.focused ? Colors.tabIconSelected : Colors.tabIconDefault;
  return (
    <Ionicons
      name={props.name}
<<<<<<< HEAD
      size={24}
=======
      size={props.size === undefined ? 24 : props.size}
>>>>>>> origin
      style={{ marginBottom: -3 }}
      color={props.type==='AvatarIcon' ? 'white' : defaultColorPack}
    />
  );
}
