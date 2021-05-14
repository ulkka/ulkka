import React, {useEffect, useState} from 'react';
import {View, Text, Modal, Platform} from 'react-native';
import {Icon} from 'react-native-elements';

export default function ShowSubmitStatus(props) {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(new Map());
  useEffect(() => {
    if (
      !(
        Object.keys(props.data).length === 0 &&
        props.data.constructor === Object
      )
    ) {
      setVisible(true);
      setStatus(props.data);
    } else {
      setVisible(false);
    }
  }, [props.data]);

  return (
    <Modal
      statusBarTranslucent={true}
      visible={visible}
      transparent={false}
      animationType="none">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eee',
          opacity: 0.9,
        }}>
        {status?.type == 'success' ? (
          <Icon
            name="check-circle"
            size={100}
            type="font-awesome5"
            color="green"
          />
        ) : (
          <Icon name="error" size={100} color="red" />
        )}

        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            paddingTop: 50,
            lineHeight: 45,
            textAlign: 'center',
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {status?.message}{' '}
        </Text>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            paddingTop: 30,
            ...(Platform.OS == 'android' && {fontFamily: 'roboto'}),
          }}>
          {status?.entity}{' '}
        </Text>
      </View>
    </Modal>
  );
}
