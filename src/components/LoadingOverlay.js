import React from 'react';
import {View, Image, Modal} from 'react-native';
import {useSelector} from 'react-redux';
import {isVisible} from '../redux/reducers/LoadingOverlaySlice';

export default function LoadingOverlay() {
  const visible = useSelector(isVisible);

  const LoadingView = (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        opacity: 0.8,
      }}>
      <Image
        source={require('../../assets/loading.gif')}
        style={{height: 40, width: 40}}
      />
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
