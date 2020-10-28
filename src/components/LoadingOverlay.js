import React from 'react';
import {View, ActivityIndicator, Modal} from 'react-native';

export default function LoadingOverlay(props) {
  return (
    <Modal
      visible={props.loading}
      transparent={false}
      style={{}}
      transparent={true}
      animationType="fade">
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
