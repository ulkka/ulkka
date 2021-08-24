import React from 'react';
import {View, ActivityIndicator} from 'react-native';
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
      <ActivityIndicator size="large" color={theme.colors.blue} />
    </View>
  );
}
