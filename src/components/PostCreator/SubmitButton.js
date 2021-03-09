import React from 'react';
import {View} from 'react-native';
import {Icon, Button} from 'react-native-elements';

export const SubmitButton = (props) => {
  const {onPress} = props;
  return (
    <View
      style={{
        flex: 1,
        width: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Button
        icon={
          <Icon name="send" size={15} color={'green'} type="font-awesome" />
        }
        raised
        title="Post"
        buttonStyle={{
          backgroundColor: '#fff',
          borderRadius: 20,
          borderColor: '#ddd',
          //padding:20
        }}
        titleStyle={{
          color: 'green',
          fontWeight: 'bold',
          paddingLeft: 20,
        }}
        type="solid"
        //  disabled={true}
        onPress={onPress}
      />
    </View>
  );
};
