import React from 'react';
import {View, Platform} from 'react-native';
import {Input} from 'react-native-elements';
import {removeEmptyLines} from './helpers';

export const DescriptionField = (props) => {
  const {onChangeText, description} = props;
  return (
    <View
      style={{
        // flex: 3,
        marginTop: 40,
        marginBottom: Platform.OS == 'ios' ? 30 : 60,
        justifyContent: 'center',
      }}>
      <Input
        inputContainerStyle={{
          borderBottomColor: '#fff',
        }}
        inputStyle={{textAlign: 'center', lineHeight: 24}}
        onChangeText={(text) => onChangeText(removeEmptyLines(text))}
        value={description}
        placeholder={'Description'}
        numberOfLines={9}
        multiline={true}
        maxLength={10000}
      />
    </View>
  );
};
