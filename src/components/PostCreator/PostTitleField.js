import React from 'react';
import {View} from 'react-native';
import {Input} from 'react-native-elements';
import {transformText} from './helpers';

export const PostTitleField = (props) => {
  const {title, onChangeText} = props;

  return (
    <View
      style={{
        flex: 3,
        marginTop: 30,
        justifyContent: 'flex-end',
      }}>
      <Input
        inputContainerStyle={{
          borderBottomColor: '#ddd',
        }}
        inputStyle={{textAlign: 'center', lineHeight: 24, marginBottom: 10}}
        onChangeText={(text) => onChangeText(transformText(text))}
        value={title}
        numberOfLines={3}
        multiline={true}
        placeholder={'Title'}
        maxLength={300}
      />
    </View>
  );
};
