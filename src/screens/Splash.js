import React from 'react';
import {View, Image} from 'react-native';
import {useTheme} from 'react-native-elements';
export default function Splash() {
  const {theme} = useTheme();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
      }}>
      <Image
        source={require('../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
    </View>
  );
}
