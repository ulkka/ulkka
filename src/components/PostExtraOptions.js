import React from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

export default function PostExtraOptions(props) {
  return (
    <TouchableOpacity
      style={{padding: 5}}
      onPress={() => props.showOptionSheet(props.optionType, props.item._id)}>
      <Icon name="more-horiz" size={18} color="#888" />
    </TouchableOpacity>
  );
}
