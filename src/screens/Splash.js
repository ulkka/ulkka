import React, {useContext} from 'react';
import {View, Image} from 'react-native';
import {ThemeContext} from 'react-native-elements';
export default function Splash() {
  const {theme} = useContext(ThemeContext);

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
