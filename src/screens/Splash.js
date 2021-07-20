import React from 'react';
import {View, Image} from 'react-native';

export default function Splash() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
    </View>
  );
}
