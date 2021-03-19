import React, {memo} from 'react';
import {View, Text} from 'react-native';
import {Icon} from 'react-native-elements';

const MediaLoadError = (props) => {
  const {type} = props;
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 5,
        opacity: 0.7,
        borderRadius: 10,
      }}>
      <Icon type="font-awesome" name="warning" color="red" size={22} />
      <Text style={{padding: 5}}>{type} not available</Text>
    </View>
  );
};

export default memo(MediaLoadError);
