import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Modal} from 'react-native';

export default function LoadingOverlay(props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(props.visible);
  }, [props.visible]);

  return (
    <Modal visible={visible} transparent={true} animationType="none">
      <View
        style={{
          flex: 1,
          borderRadius: 1,
          borderColor: '#000',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eee',
          opacity: 0.9,
        }}>
        <ActivityIndicator size="large" color="#4285f4" />
      </View>
    </Modal>
  );
}
