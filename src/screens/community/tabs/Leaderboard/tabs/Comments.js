import React, {memo} from 'react';
import {View, Text} from 'react-native';

export default memo(function Comments(props) {
  return (
    <View style={{flex: 1}}>
      <Text style={{color: '#000'}}>Comments</Text>
    </View>
  );
});
