import React from 'react';
import {View} from 'react-native';
import {Icon, Button} from 'react-native-elements';

export const SubmitButton = (props) => {
  const {onPress} = props;
  return (
    <View
      style={{
        width: '40%',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Button
        icon={
          <Icon name="send" size={15} color={'#77c063'} type="font-awesome" />
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
          color: '#77c063',
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
