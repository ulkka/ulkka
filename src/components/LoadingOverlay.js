import React from 'react';
import {View, ActivityIndicator, Modal} from 'react-native';
import {useTheme} from 'react-native-elements';
import {useSelector} from 'react-redux';
import {isVisible} from '../redux/reducers/LoadingOverlaySlice';

export default function LoadingOverlay() {
  const {theme} = useTheme();

  const visible = useSelector(isVisible);

  const LoadingView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        opacity: 0.8,
      }}>
      <ActivityIndicator size="large" color={theme.colors.blue} />
    </View>
  );
  return (
    <Modal
      statusBarTranslucent={true}
      visible={visible}
      transparent={true}
      animationType="none">
      {LoadingView}
    </Modal>
  );
}
