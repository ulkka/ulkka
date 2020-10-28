import React, {useEffect, useState} from 'react';
import {View, Text, Modal} from 'react-native';
import {Icon} from 'react-native-elements';

export default function SubmitStatus(props) {
  const [status, setStatus] = useState(new Map());
  useEffect(() => {
    console.log('in use effect');
    setStatus(props.data);
    console.log(props.data, status.get('status'));
  }, [props.data]);

  return (
    <Modal visible={status.size} transparent={true} animationType="none">
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#eee',
          opacity: 0.9,
        }}>
        {status.get('status') == 'success' ? (
          <Icon
            name="check-circle"
            size={100}
            type="font-awesome5"
            color="green"
          />
        ) : (
          <Icon name="error" size={100} color="red" />
        )}

        <Text style={{fontSize: 20, fontWeight: 'bold', paddingTop: 50}}>
          {status.get('message')}
        </Text>
        <Text style={{fontSize: 30, fontWeight: 'bold', paddingTop: 30}}>
          {status.get('entity')}
        </Text>
      </View>
    </Modal>
  );
}
