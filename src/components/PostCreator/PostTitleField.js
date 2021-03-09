import React from 'react';
import {View} from 'react-native';
import {Input} from 'react-native-elements';

export const PostTitleField = (props) => {
  return (
    <View style={{flex: 1}}>
      <Input
        style={{
          height: 40,
        }}
        inputContainerStyle={{
          borderBottomColor: '#ddd',
        }}
        onChangeText={props.onChangeText}
        value={props.title}
        placeholder={'Title'}
        maxLength={300}
      />
    </View>
  );
};
