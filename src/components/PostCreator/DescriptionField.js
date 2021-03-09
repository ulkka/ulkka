import React from 'react';
import {View} from 'react-native';
import {Input} from 'react-native-elements';

export const DescriptionField = (props) => {
  const {onChangeText, description} = props;
  return (
    <View style={{flex: 3}}>
      <Input
        style={{
          maxHeight: 300,
          minHeight: 150,
        }}
        inputContainerStyle={{
          borderBottomColor: '#fff',
        }}
        onChangeText={onChangeText}
        value={description}
        placeholder={'Description'}
        numberOfLines={10}
        multiline={true}
        maxLength={10000}
      />
    </View>
  );
};
