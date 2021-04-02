import React from 'react';
import {View, Platform} from 'react-native';
import {Input} from 'react-native-elements';

export const DescriptionField = (props) => {
  const {onChangeText, description} = props;
  return (
    <View
      style={{
        flex: 3,
        marginBottom: Platform.OS == 'ios' ? 0 : 15,
        justifyContent: 'center',
      }}>
      <Input
        inputContainerStyle={{
          borderBottomColor: '#fff',
        }}
        inputStyle={{textAlign: 'center', lineHeight: 24}}
        onChangeText={(text) => onChangeText(text.trim())}
        value={description}
        placeholder={'Description'}
        numberOfLines={9}
        multiline={true}
        maxLength={10000}
      />
    </View>
  );
};
