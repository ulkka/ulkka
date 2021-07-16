import React from 'react';
import {View, Platform} from 'react-native';
import {Input} from 'react-native-elements';

export const DescriptionField = (props) => {
  const {onChangeText, description} = props;
  return (
    <View
      style={{
        // flex: 3,
        marginTop: 20,
        marginBottom: 10,
        justifyContent: 'center',
      }}>
      <Input
        inputContainerStyle={{
          borderBottomColor: '#fff',
          minHeight: 100,
        }}
        inputStyle={{textAlign: 'center', lineHeight: 24}}
        onChangeText={(text) => onChangeText(text)}
        value={description}
        placeholder={'Description'}
        multiline={true}
        maxLength={10000}
      />
    </View>
  );
};
