import React from 'react';
import {View, ActivityIndicator} from 'react-native';

export default function Splash() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  );
}
