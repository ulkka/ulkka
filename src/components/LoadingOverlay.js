import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Modal} from 'react-native';

export default function LoadingOverlay(props) {
  const [visible, setVisible] = useState(false);
  // const [useModal, setUseModal] = useState(false);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  const LoadingView = (
    <View
      style={{
        flex: 1,
        borderRadius: 1,
        borderWidth: 2,
        borderColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        opacity: 0.9,
      }}>
      <ActivityIndicator size="large" color="#4285f4" />
    </View>
  );
  return (
    <Modal visible={visible} transparent={true} animationType="none">
      {LoadingView}
    </Modal>
  );
}
